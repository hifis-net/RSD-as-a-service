// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

public class GithubSITest {
	private final String apiUrl = "https://api.github.com";
	private final String repo = "research-software-directory/RSD-as-a-service";
	private final GithubSI githubScraper = new GithubSI(apiUrl, repo);

	@Disabled
	@Test
	void languages() {
		final String languages = githubScraper.languages();
		Assertions.assertTrue(languages.startsWith("{"));
		Assertions.assertTrue(languages.endsWith("}"));
		Assertions.assertTrue(languages.contains("Java"));

	}

	@Disabled
	@Test
	void license() {
		Assertions.assertEquals("Apache-2.0", githubScraper.license());
	}

	@Disabled
	@Test
	void contributions() {
		final String contributions = githubScraper.contributions();
		Assertions.assertTrue(contributions.startsWith("[{\"total"));
	}
}
