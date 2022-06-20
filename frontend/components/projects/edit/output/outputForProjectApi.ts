// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {CrossrefSelectItem} from '~/types/Crossref'
import {WorkResponse} from '~/types/Datacite'
import {MentionItemProps} from '~/types/Mention'
import {addMentionItem} from '~/utils/editMentions'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import {crossrefItemToMentionItem, getCrossrefItemsByTitle} from '~/utils/getCrossref'
import {dataCiteGraphQLItemToMentionItem, getDataciteItemsByTitleGraphQL} from '~/utils/getDataCite'
import {sortBySearchFor} from '~/utils/sortFn'

export async function findPublicationByTitle({project, searchFor, token}:
  { project: string, searchFor: string, token: string }) {
  const promises = [
    getCrossrefItemsByTitle(searchFor),
    getDataciteItemsByTitleGraphQL(searchFor),
    searchForAvailableOutput({
      project,
      searchFor,
      token
    })
  ]
  // make requests
  const [crossref, datacite, rsd] = await Promise.all(promises)
  // convert crossref responses to MentionItems
  const crosrefItems = crossref?.map(item => {
    return crossrefItemToMentionItem(item as CrossrefSelectItem)
  })
  // convert datacite responses to MentionItems
  const dataciteItems = datacite?.map(item => {
    return dataCiteGraphQLItemToMentionItem(item as WorkResponse)
  })
  // change items source to RSD for ones pulled from RSD
  const rsdItems: MentionItemProps[] = rsd.map(item => ({
    ...item as MentionItemProps,
    source: 'RSD'
  }))
  // return results
  const sorted = [
    // RSD items at the top
    ...rsdItems,
    ...crosrefItems,
    ...dataciteItems
  ].sort((a, b) => sortBySearchFor(a, b, 'title', searchFor))
  return sorted
}

/**
 * Searching for items in mention table which are NOT assigned to impact of the project already.
 * @returns MentionItem[]
 */
export async function searchForAvailableOutput({project, searchFor, token}:
  { project: string, searchFor: string, token: string }) {
  const url = '/api/v1/rpc/search_output_for_project'
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify({
        project_id: project,
        search_text: searchFor
      })
    })
    // debugger
    if (resp.status === 200) {
      const json: MentionItemProps[] = await resp.json()
      return json
    }
    logger(`searchForAvailableOutput: 404 [${url}]`, 'error')
    return []
  } catch (e: any) {
    logger(`searchForAvailableOutput: ${e?.message}`, 'error')
    return []
  }
}

export async function addOutputItem({item, project, token}: { item: MentionItemProps, project: string, token: string }) {
  let mention: MentionItemProps
  // new item not in rsd
  if (item.id === null) {
    // add mention item to RSD
    const resp = await addMentionItem({
      mention: item,
      token
    })
    if (resp.status !== 201) {
      // exit
      return {
        status: resp.status,
        message: `Failed to add ${item.title}. ${resp.message}`
      }
    }
    // assign created mention item
    mention = resp.message
  } else {
    // use existing RSD item
    mention = item
  }
  // add mention item to impact table
  if (mention && mention.id) {
    const resp = await addOutputToProject({
      project,
      mention: mention.id,
      token
    })
    if (resp.status !== 200) {
      return {
        status: resp.status,
        message: `Failed to add ${item.title}. ${resp.message}`
      }
    } else {
      // return mention in message
      return {
        status: 200,
        message: mention
      }
    }
  }
  return {
    status: 500,
    message: 'Failed to save item'
  }
}

export async function addOutputToProject({mention, project, token}: { mention: string, project: string, token: string }) {
  const url = '/api/v1/output_for_project'
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify({
        project,
        mention
      })
    })

    return extractReturnMessage(resp, mention)

  } catch (e: any) {
    logger(`addOutputToProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function removeOutputForProject({mention, project, token}:
  { mention: string, project: string, token: string }) {
  const url = `/api/v1/output_for_project?project=eq.${project}&mention=eq.${mention}`
  try {
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: createJsonHeaders(token)
    })

    return extractReturnMessage(resp, mention)

  } catch (e: any) {
    logger(`removeOutputForProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
