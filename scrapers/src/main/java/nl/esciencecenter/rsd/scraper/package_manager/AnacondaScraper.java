// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.package_manager;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AnacondaScraper implements PackageManagerScraper {

	private final String packageName;
	private static final Pattern urlPattern = Pattern.compile("https://anaconda\\.org/[^/]+/([^/]+)/?");

	public AnacondaScraper(String url) {
		Objects.requireNonNull(url);
		Matcher urlMatcher = urlPattern.matcher(url);
		if (!urlMatcher.matches()) {
			throw new RuntimeException("Invalid Anaconda URL: " + url);
		}

		packageName = urlMatcher.group(1);
	}

	@Override
	public Long downloads() {
		throw new UnsupportedOperationException();
	}

	@Override
	public Integer reverseDependencies() {
		String data = PackageManagerScraper.doLibrariesIoRequest("https://libraries.io/api/conda/" + packageName);
		JsonElement tree = JsonParser.parseString(data);
		return tree.getAsJsonObject().getAsJsonPrimitive("dependents_count").getAsInt();
	}
}
