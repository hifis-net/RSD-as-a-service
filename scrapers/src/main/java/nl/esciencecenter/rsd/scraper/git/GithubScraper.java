// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.git;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import nl.esciencecenter.rsd.scraper.Config;
import nl.esciencecenter.rsd.scraper.RsdRateLimitException;
import nl.esciencecenter.rsd.scraper.RsdResponseException;
import nl.esciencecenter.rsd.scraper.Utils;

import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class GithubScraper implements GitScraper {

	private final String baseApiUrl;
	private final String repo;
	private static final Pattern LINK_PATTERN = Pattern.compile("<([^>]+page=(\\d+)[^>]*)>; rel=\"([^\"]+)\"");

	public GithubScraper(String baseApiUrl, String repo) {
		this.baseApiUrl = Objects.requireNonNull(baseApiUrl);
		this.repo = Objects.requireNonNull(repo);
	}

	/**
	 * Returns the basic data of the repository.
	 * Example URL: https://api.github.com/repos/research-software-directory/RSD-as-a-service
	 */
	@Override
	public BasicGitData basicData() {
		Optional<String> apiCredentials = Config.apiCredentialsGithub();
		String response;
		if (apiCredentials.isPresent()) {
			response = Utils.get(baseApiUrl + "/repos/" + repo, "Authorization", "Basic " + Utils.base64Encode(apiCredentials.get()));
		}
		else {
			response = Utils.get(baseApiUrl + "/repos/" + repo);
		}
		return parseBasicData(response);
	}

	/**
	 * Returns JSON as a String with the amount of lines written in each language.
	 * Example URL: https://api.github.com/repos/research-software-directory/RSD-as-a-service/languages
	 */
	@Override
	public String languages() {
		Optional<String> apiCredentials = Config.apiCredentialsGithub();
		if (apiCredentials.isPresent()) {
			return Utils.get(baseApiUrl + "/repos/" + repo + "/languages", "Authorization", "Basic " + Utils.base64Encode(apiCredentials.get()));
		}
		else {
			return Utils.get(baseApiUrl + "/repos/" + repo + "/languages");
		}
	}

	/**
	 * Returns  all contributors commit activity.
	 * https://docs.github.com/en/rest/reference/metrics#get-all-contributor-commit-activity=
	 * Requesting commit activity requires a GitHub authentication token.
	 *
	 * The returned string represents a JsonArray with one entry per contributor. THe information
	 * per entry are:
	 *
	 * {
	 *     "author": { <AuthorInformation> },
	 *     "total": number of total commits,
	 *     "weeks": [
	 *         {
	 *             "w": unix timestamp (Start of the week 00:00 on Sundays),
	 *             "a": number of additions,
	 *             "d": number of deletions,
	 *             "c": number of commits
	 *         }, ...
	 *     ]
	 * }
	 *
	 * Example URL: https://api.github.com/repos/research-software-directory/RSD-as-a-service/stats/contributors
	 */
	@Override
	public CommitsPerWeek contributions() {
		Optional<String> apiCredentials = Config.apiCredentialsGithub();
		HttpResponse<String> httpResponse = null;
		for (int i = 0; i < 2; i++) {
			httpResponse = getAsHttpResponse(baseApiUrl + "/repos/" + repo + "/stats/contributors");

			if (httpResponse.statusCode() != 202) break;
			try {
				Thread.sleep(3000L);
			} catch (InterruptedException e) {
				throw new RuntimeException(e);
			}
		}

		int status = httpResponse.statusCode();
		if (status == 404) {
			System.out.println("Commit history not found at " + httpResponse.uri().toString());
			return null;
		} else if (status == 204) {
			// empty commit history
			return new CommitsPerWeek();
		} else if (status == 403) {
			throw new RsdRateLimitException("403 Forbidden. This error occurs mostly when the API rate limit is exceeded. Error message: " + httpResponse.body());
		} else if (status == 202) {
			// response not ready yet
			return null;
		} else if (status != 200){
			throw new RsdResponseException(status,
					"Unexpected response from " + httpResponse.uri().toString() + " with status code " + status + " and body " + httpResponse.body());
		} else {
			String contributionsJson = httpResponse.body();
			return parseCommits(contributionsJson);
		}
	}

	@Override
	public Integer contributorCount() {
		// we request one contributor per page and just extract the number of pages from the headers
		// see https://docs.github.com/en/rest/guides/using-pagination-in-the-rest-api?apiVersion=2022-11-28
		HttpResponse<String> httpResponse = getAsHttpResponse(baseApiUrl + "/repos/" + repo + "/contributors?per_page=1");

		int status = httpResponse.statusCode();
		if (status == 404) {
			throw new RsdResponseException(404, "No response found at " + httpResponse.uri());
		} else if (status == 403) {
			throw new RsdRateLimitException("403 Forbidden. This error occurs mostly when the API rate limit is exceeded. Error message: " + httpResponse.body());
		} else if (status != 200){
			throw new RsdResponseException(status,
					"Unexpected response from " + httpResponse.uri().toString() + " with status code " + status + " and body " + httpResponse.body());
		} else {
			List<String> linkHeaders = httpResponse.headers().allValues("link");
			String[] lastPageData = lastPageFromLinkHeader(linkHeaders);
			if (lastPageData != null) {
				int lastPageNumber = Integer.parseInt(lastPageData[1]);
				return lastPageNumber;
			} else {
				// this was the first page, return the size of the array (either 0 or 1)
				return JsonParser.parseString(httpResponse.body()).getAsJsonArray().size();
			}
		}
	}

	static CommitsPerWeek parseCommits(String json) {
		CommitsPerWeek commits = new CommitsPerWeek();
		JsonArray commitsPerContributor = JsonParser.parseString(json).getAsJsonArray();

		for (JsonElement jsonElement : commitsPerContributor) {
			JsonArray weeks = jsonElement.getAsJsonObject().getAsJsonArray("weeks");
			for (JsonElement week : weeks) {
				long weekTimestamp = week.getAsJsonObject().getAsJsonPrimitive("w").getAsLong();
				long commitsInWeek = week.getAsJsonObject().getAsJsonPrimitive("c").getAsLong();

				Instant weekInstant = Instant.ofEpochSecond(weekTimestamp);

				commits.addCommits(weekInstant, commitsInWeek);
			}
		}

		return commits;
	}

	static BasicGitData parseBasicData(String json) {
		BasicGitData result = new BasicGitData();
		JsonObject jsonObject = JsonParser.parseString(json).getAsJsonObject();

		JsonElement jsonLicense = jsonObject.get("license");
		result.license = jsonLicense.isJsonNull() ? null : jsonLicense.getAsJsonObject().getAsJsonPrimitive("spdx_id").getAsString();
		result.starCount = jsonObject.getAsJsonPrimitive("stargazers_count").getAsLong();
		result.forkCount = jsonObject.getAsJsonPrimitive("forks_count").getAsInt();
		result.openIssueCount = jsonObject.getAsJsonPrimitive("open_issues_count").getAsInt();

		return result;
	}

	// return an object with the URL of the last page and the number of the last page respectively
	static String[] lastPageFromLinkHeader(List<String> links) {
		if (links.isEmpty()) return null;

		for (String link : links) {
			Matcher matcher = LINK_PATTERN.matcher(link);
			while (matcher.find()) {
				String relation = matcher.group(3);
				if (relation.equals("last")) return new String[] {matcher.group(1), matcher.group(2)};
			}
		}

		throw new RuntimeException("No last page found");
	}

	static HttpResponse<String> getAsHttpResponse(String url) {
		Optional<String> apiCredentials = Config.apiCredentialsGithub();
		if (apiCredentials.isPresent()) {
			return Utils.getAsHttpResponse(url, "Authorization", "Basic " + Utils.base64Encode(apiCredentials.get()));
		}
		else {
			return Utils.getAsHttpResponse(url);
		}
	}
}
