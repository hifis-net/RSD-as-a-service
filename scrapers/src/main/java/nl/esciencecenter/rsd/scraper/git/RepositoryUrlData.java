// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import java.time.ZonedDateTime;

public record RepositoryUrlData(String software, String url, CodePlatformProvider code_platform,
								String license, ZonedDateTime licenseScrapedAt,
								String commitHistory, ZonedDateTime commitHistoryScrapedAt,
								String languages, ZonedDateTime languagesScrapedAt) {
}
