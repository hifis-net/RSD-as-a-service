// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import java.util.Collection;

public interface SoftwareInfoRepository {

	Collection<BasicRepositoryData> languagesData(int limit);

	Collection<BasicRepositoryData> commitData(int limit);

	Collection<BasicRepositoryData> statsData(int limit);

	void saveLanguagesData(LanguagesData languagesData);

	void saveCommitData(CommitData languagesData);

	void saveBasicData(BasicGitDatabaseData basicData);
}
