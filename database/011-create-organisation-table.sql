-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE organisation (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	parent UUID REFERENCES organisation (id),
	primary_maintainer UUID REFERENCES account (id),
	slug VARCHAR(200) NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	name VARCHAR(200) NOT NULL,
	ror_id VARCHAR(100) UNIQUE,
	website VARCHAR(200) UNIQUE,
	is_tenant BOOLEAN DEFAULT FALSE NOT NULL,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL,
	UNIQUE (slug, parent)
);

CREATE UNIQUE INDEX unique_slug_for_top_level_org_idx ON organisation (slug, (parent IS NULL)) WHERE parent IS NULL;
CREATE UNIQUE INDEX unique_name_and_parent_idx ON organisation (name, parent);

CREATE FUNCTION check_cycle_organisations() RETURNS TRIGGER STABLE LANGUAGE plpgsql SECURITY DEFINER AS
$$
DECLARE initial_org UUID = NEW.id;
DECLARE current_org UUID = NEW.parent;
BEGIN
	WHILE current_org IS NOT NULL LOOP
		IF current_org = initial_org THEN
			RAISE EXCEPTION USING MESSAGE = 'Cycle detected for organisation with id ' || NEW.id;
		END IF;
		SELECT parent FROM organisation WHERE id = current_org INTO current_org;
	END LOOP;
	RETURN NEW;
END
$$;

-- z_ prefix so that if is executed after the sanitise_update_organisation trigger
CREATE TRIGGER z_check_cycle_organisations BEFORE UPDATE OF parent ON organisation FOR EACH ROW EXECUTE PROCEDURE check_cycle_organisations();

CREATE FUNCTION sanitise_insert_organisation() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_organisation BEFORE INSERT ON organisation FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_organisation();


CREATE FUNCTION sanitise_update_organisation() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.slug = OLD.slug;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;

	IF CURRENT_USER <> 'rsd_admin' AND NOT (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) THEN
		IF NEW.is_tenant IS DISTINCT FROM OLD.is_tenant OR NEW.primary_maintainer IS DISTINCT FROM OLD.primary_maintainer THEN
			RAISE EXCEPTION USING MESSAGE = 'You are not allowed to change the tenant status or primary maintainer for organisation ' || OLD.name;
		END IF;
	END IF;

	RETURN NEW;
END
$$;

CREATE TRIGGER sanitise_update_organisation BEFORE UPDATE ON organisation FOR EACH ROW EXECUTE PROCEDURE sanitise_update_organisation();


CREATE FUNCTION list_parent_organisations(child_organisation UUID) RETURNS TABLE (slug VARCHAR, organisation_id UUID) STABLE LANGUAGE plpgsql AS
$$
DECLARE current_org UUID = child_organisation;
BEGIN
	WHILE current_org IS NOT NULL LOOP
		RETURN QUERY SELECT organisation.slug, id FROM organisation WHERE id = current_org;
		SELECT parent FROM organisation WHERE id = current_org INTO current_org;
	END LOOP;
	RETURN;
END
$$;

CREATE FUNCTION slug_to_organisation(full_slug VARCHAR) RETURNS UUID STABLE LANGUAGE plpgsql AS
$$
DECLARE current_org UUID;
DECLARE slug_part VARCHAR;
BEGIN
	FOREACH slug_part IN ARRAY string_to_array(full_slug, '/') LOOP
		SELECT id FROM organisation WHERE (parent = current_org OR (parent IS NULL AND current_org IS NULL)) AND slug = slug_part INTO current_org;
			IF (current_org IS NULL) THEN
				RETURN NULL;
		END IF;
	END LOOP;
	RETURN current_org;
END
$$;


CREATE TABLE logo_for_organisation (
	organisation UUID references organisation(id) PRIMARY KEY,
	data VARCHAR(2750000) NOT NULL,
	mime_type VARCHAR(100) NOT NULL,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE FUNCTION get_logo(id UUID) RETURNS BYTEA STABLE LANGUAGE plpgsql AS
$$
DECLARE headers TEXT;
DECLARE blob BYTEA;

BEGIN
	SELECT format(
		'[{"Content-Type": "%s"},'
		'{"Content-Disposition": "inline; filename=\"%s\""},'
		'{"Cache-Control": "max-age=259200"}]',
		logo_for_organisation.mime_type,
		logo_for_organisation.organisation)
	FROM logo_for_organisation WHERE logo_for_organisation.organisation = get_logo.id INTO headers;

	PERFORM set_config('response.headers', headers, TRUE);

	SELECT decode(logo_for_organisation.data, 'base64') FROM logo_for_organisation WHERE logo_for_organisation.organisation = get_logo.id INTO blob;

	IF FOUND
		THEN RETURN(blob);
	ELSE RAISE SQLSTATE 'PT404'
		USING
			message = 'NOT FOUND',
			detail = 'File not found',
			hint = format('%s seems to be an invalid file id', get_logo.id);
	END IF;
END
$$;
