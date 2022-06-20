// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ProjectKeyword} from '~/components/projects/edit/information/projectKeywordsChanges'
import {SoftwareKeyword} from '~/components/software/edit/information/softwareKeywordsChanges'
import {createJsonHeaders, extractReturnMessage} from './fetchHelpers'
import logger from './logger'

export async function createKeyword({keyword, token}: { keyword: string, token: string }) {
  try {
    // POST
    const url = '/api/v1/keyword'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // return id in header
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify({
        value: keyword
      })
    })
    if (resp.status === 201) {
      // we need to return id of created record
      // it can be extracted from header.location
      const id = resp.headers.get('location')?.split('.')[1]
      return {
        status: 201,
        message: id
      }
    }
    // debugger
    return extractReturnMessage(resp, keyword ?? '')
  } catch (e: any) {
    logger(`createKeyword: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function addKeywordsToProject({data, token}:
  { data: ProjectKeyword[], token: string }) {
  try {
    // POST
    const url = '/api/v1/keyword_for_project'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // this will add new items and update existing
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp, '')
  } catch (e: any) {
    logger(`addKeywordToProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteKeywordFromProject({project, keyword, token}:
  { project: string, keyword: string, token: string }) {
  try {
    // DELETE record based on project and keyword uuid
    const query = `keyword_for_project?project=eq.${project}&keyword=eq.${keyword}`
    const url = `/api/v1/${query}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, project ?? '')
  } catch (e: any) {
    logger(`deleteKeywordFromProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}


export async function addKeywordsToSoftware({data, token}:
  { data: SoftwareKeyword[], token: string }) {
  try {
    // POST
    const url = '/api/v1/keyword_for_software'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // this will add new items and update existing
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp, '')
  } catch (e: any) {
    logger(`addKeywordsToSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteKeywordFromSoftware({software, keyword, token}:
  { software: string, keyword: string, token: string }) {
  try {
    // DELETE record based on software and keyword uuid
    const query = `keyword_for_software?software=eq.${software}&keyword=eq.${keyword}`
    const url = `/api/v1/${query}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, software ?? '')
  } catch (e: any) {
    logger(`deleteKeywordFromSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
