// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.authentication;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.nimbusds.oauth2.sdk.AccessTokenResponse;
import com.nimbusds.oauth2.sdk.AuthorizationCode;
import com.nimbusds.oauth2.sdk.AuthorizationCodeGrant;
import com.nimbusds.oauth2.sdk.AuthorizationGrant;
import com.nimbusds.oauth2.sdk.Scope;
import com.nimbusds.oauth2.sdk.TokenErrorResponse;
import com.nimbusds.oauth2.sdk.TokenRequest;
import com.nimbusds.oauth2.sdk.TokenResponse;
import com.nimbusds.oauth2.sdk.auth.ClientAuthentication;
import com.nimbusds.oauth2.sdk.auth.ClientSecretBasic;
import com.nimbusds.oauth2.sdk.auth.Secret;
import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import com.nimbusds.oauth2.sdk.id.ClientID;
import com.nimbusds.oauth2.sdk.token.BearerAccessToken;
import com.nimbusds.openid.connect.sdk.UserInfoRequest;
import com.nimbusds.openid.connect.sdk.UserInfoResponse;
import com.nimbusds.openid.connect.sdk.claims.UserInfo;
import net.minidev.json.JSONArray;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;
import java.util.Set;

public class HelmholtzAaiLogin implements Login {

	private final String code;
	private final String redirectUrl;
	static final String DEFAULT_ORGANISATION = "Helmholtz";

	// See https://hifis.net/doc/helmholtz-aai/list-of-vos/#vos-representing-helmholtz-centres
	static private final Collection<String> knownHgfOrganisations = Set.<String>of(
		"AWI", "CISPA", "DESY", "DKFZ", "DLR", "DZNE", "FZJ", "GEOMAR", "GFZ", "GSI", "hereon", "HMGU", "HZB", "KIT", "MDC", "UFZ"
	);

	public HelmholtzAaiLogin(String code, String redirectUrl) {
		this.code = Objects.requireNonNull(code);
		this.redirectUrl = Objects.requireNonNull(redirectUrl);
	}

	static String getOrganisationFromEntitlements(JSONArray entitlements) {
		if (entitlements == null || entitlements.isEmpty()) {
			return null;
		}

		String returnOrganisation;
		ArrayList<String> organisationsDelivered = new ArrayList<String>();
		boolean helmholtzmemberFound = false;

		// Collect all organisations delivered, because the home organisation
		// must not be the first one in the list. This assumes that a person
		// is only member of one organisation
		String organisation;
		for (Object element : entitlements.toArray()) {
			organisation = null;
			String ent = element.toString();

			// we expect this for logins from Helmholtz centres
			// see https://hifis.net/doc/helmholtz-aai/list-of-vos/#vos-representing-helmholtz-centres
			if (ent.matches("urn:geant:helmholtz\\.de:group:Helmholtz-member.*")) {
				helmholtzmemberFound = true;
				continue;
			}

			// example: urn:geant:helmholtz.de:group:GFZ#login.helmholtz.de
			if (ent.matches("urn:geant:helmholtz\\.de:group:.*")) {
				String withoutHash = ent;

				// remove everything behind the hash
				if (ent.contains("#")) {
					String[] splitHash = ent.split("#");

					if (splitHash.length != 2) {
						// unknown format
						continue;
					}

					withoutHash = splitHash[0];
				}

				// urn:geant:helmholtz.de:group:GFZ
				String[] splitGroup = withoutHash.split(":");

				if (splitGroup.length != 5) {
					// unknown format
					continue;
				}

				// get organisation from last element
				organisation = splitGroup[splitGroup.length - 1];
				organisationsDelivered.add(organisation);
			}
		}

		if (!helmholtzmemberFound) {
			return null;
		}

		// Detect whether one of the delivered organisations is in the list of known HGF centres
		organisationsDelivered.retainAll(knownHgfOrganisations);
		if (organisationsDelivered.size() == 0) {
			// No known HGF organisation could be found
			returnOrganisation = DEFAULT_ORGANISATION;
		} else {
			// Always return the first element in the list, even if there were multiple centres found
			returnOrganisation = organisationsDelivered.get(0);
		};

		// else: we either return the found the Helmholtz centre name
		// or the default organisation
		return returnOrganisation;
	}

	@Override
	public OpenIdInfo openidInfo() {
		UserInfo userInfo;
		String userinfoUrl;

		/* get the userinfo endpoint URL first */
		try {
			HttpRequest request = HttpRequest.newBuilder(
					URI.create(Config.helmholtzAaiWellknown())
				)
				.header("accept", "application/json")
				.build();
			HttpClient client = HttpClient.newHttpClient();
			HttpResponse<String> response;
			response = client.send(request, BodyHandlers.ofString());
			JsonElement resp = JsonParser.parseString(response.body());

			userinfoUrl = resp.getAsJsonObject().getAsJsonPrimitive("userinfo_endpoint").getAsString();
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}

		try {
			AuthorizationCode authcode = new AuthorizationCode(code);
			URI callback = new URI(redirectUrl);
			AuthorizationGrant codeGrant = new AuthorizationCodeGrant(authcode, callback);
			ClientID clientID = new ClientID(Config.helmholtzAaiClientId());
			Secret clientSecret = new Secret(Config.helmholtzAaiClientSecret());
			ClientAuthentication clientAuth = new ClientSecretBasic(clientID, clientSecret);
			URI tokenEndpoint = Utils.getTokenUrlFromWellKnownUrl(URI.create(Config.helmholtzAaiWellknown()));

			Scope scopes = new Scope();

			for (String scope: Config.helmholtzAaiScopes().split(" ")) {
				scopes.add(scope);
			}

			TokenRequest request = new TokenRequest(
				tokenEndpoint, clientAuth, codeGrant, scopes
			);
			TokenResponse response = TokenResponse.parse(request.toHTTPRequest().send());

			if (!response.indicatesSuccess()) {
				TokenErrorResponse errorResponse = response.toErrorResponse();
				throw new Exception(errorResponse.getErrorObject().getDescription());
			}

			AccessTokenResponse successResponse = response.toSuccessResponse();

			URI userInfoEndpoint = new URI(userinfoUrl);
			BearerAccessToken token= successResponse.getTokens().getBearerAccessToken();
			HTTPResponse httpResponse = new UserInfoRequest(userInfoEndpoint, token)
				.toHTTPRequest()
				.send();

			UserInfoResponse userInfoResponse = UserInfoResponse.parse(httpResponse);

			if (!userInfoResponse.indicatesSuccess()) {
				throw new Exception("userinfo response was not successful");
			}

			userInfo = userInfoResponse.toSuccessResponse().getUserInfo();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}

		JSONArray entitlements = (JSONArray) userInfo.getClaim("eduperson_entitlement");
		String organisation = getOrganisationFromEntitlements(entitlements);

		if (organisation == null && !Config.helmholtzAaiAllowExternalUsers()) {
			// Login denied because no HGF organisation could be found in eduperson_entitlements
			// and because social IdPs are not allowed
			throw new RsdAuthenticationException("You are not allowed to login.");
		}

		return new OpenIdInfo(
			userInfo.getSubject().toString(),
			userInfo.getName(),
			userInfo.getEmailAddress(),
			organisation
		);
	}
}
