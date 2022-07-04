// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {PostgrestParams, softwareListUrl, ssrSoftwareUrl} from './postgrestUrl'

describe('softwareListUrl', () => {
  it('returns softwareListUrl when only baseUrl provided', () => {
    const baseUrl='http://test-base-url'
    const expectUrl = `${baseUrl}/rpc/software_list?&limit=12&offset=0`
    const url = softwareListUrl({
      baseUrl
    } as PostgrestParams)
    expect(url).toEqual(expectUrl)
  })

  it('returns softwareUrl with search', () => {
    const baseUrl = 'http://test-base-url'
    // if you change search value then change expectedUrl values too
    const expectUrl = `${baseUrl}/rpc/software_list?&or=(brand_name.ilike.*test-search*, short_statement.ilike.*test-search*))&limit=12&offset=0`
    const url = softwareListUrl({
      baseUrl,
      // if you change search value then change expectedUrl values too
      search:'test-search'
    } as PostgrestParams)
    expect(url).toEqual(expectUrl)
  })
})


describe('ssrSoftwareUrl', () => {
  it('returns ssrSoftwareUrl with query filter', () => {
    const expectUrl = '/software?&filter=filter-1%2Cfilter-2&page=0&rows=12'
    const url = ssrSoftwareUrl({
      query:{filter:['filter-1','filter-2']}
    })
    expect(url).toEqual(expectUrl)
  })

  it('returns ssrSoftwareUrl with search param and page 10', () => {
    const expectUrl = '/software?search=test-search-item&page=10&rows=12'
    const url = ssrSoftwareUrl({
      query: {},
      search: 'test-search-item',
      page: 10
    })
    expect(url).toEqual(expectUrl)
  })

  it('ignores query when filter prop provided, page 10 and 50 rows', () => {
    const expectUrl = '/software?search=test-search-item&filter=stringified-filter-prefered&page=10&rows=50'
    const url = ssrSoftwareUrl({
      filter: 'stringified-filter-prefered',
      query:{filter:['filter-1','filter-2']},
      search: 'test-search-item',
      page: 10,
      rows: 50
    })
    expect(url).toEqual(expectUrl)
  })
})
