// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render, screen} from '@testing-library/react'
import SoftwareIndexPage from '../pages/software/index'
import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'
import {mockResolvedValue} from '../utils/jest/mockFetch'

// mock fetch response
import softwareItem from './__mocks__/softwareItem.json'
import {RsdUser} from '../auth'

const mockedResponse=[softwareItem]

describe('pages/software/index.tsx', () => {
  beforeEach(() => {
    mockResolvedValue(mockedResponse, {
      status:206,
      headers:{
        // mock getting Content-Range from the header
        get:()=>'0-11/200'
      },
      statusText:'OK',
    })
  })

  it('renders heading with the title Software', async() => {
    render(WrappedComponentWithProps(
      SoftwareIndexPage, {
        props: {
          count:200,
          page:0,
          rows:12,
          software:mockedResponse,
          tags:[],
        },
        // user session
        session:{
          status: 'missing',
          token: 'test-token',
          user: {name:'Test user'} as RsdUser
        }
      }
    ))
    const heading = await screen.findByRole('heading',{
      name: 'Software'
    })
    expect(heading).toBeInTheDocument()
    expect(heading.innerHTML).toEqual('Software')
  })
  it('renders software card title',async()=>{
    render(WrappedComponentWithProps(
      SoftwareIndexPage, {
        props: {
          count:200,
          page:0,
          rows:12,
          software:mockedResponse,
          tags:[]
        },
        // user session
        session:{
          status: 'missing',
          token: 'test-token',
          user: {name:'Test user'} as RsdUser
        }
      }
    ))
    const cardTitle = mockedResponse[0].brand_name
    const card = await screen.findByText(cardTitle)
    expect(card).toBeInTheDocument()
  })
})
