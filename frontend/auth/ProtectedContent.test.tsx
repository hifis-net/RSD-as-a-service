// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {render,screen} from '@testing-library/react'
import {Session} from './index'
import {WrappedComponentWithProps} from '../utils/jest/WrappedComponents'

import ProtectedContent from './ProtectedContent'

const session:Session = {
  user: null,
  token: 'TEST_TOKEN',
  status: 'loading'
}

it('renders loader when status loader', () => {
  session.status = 'loading'
  render(WrappedComponentWithProps(ProtectedContent,{
    session
  }))
  const loader = screen.getByRole('progressbar')
  expect(loader).toBeInTheDocument()
})

it('renders content when authenticated', async() => {
  session.status = 'authenticated'
  const Content = () => (
    <ProtectedContent>
      <h1>Authenticated</h1>
    </ProtectedContent>
  )
  render(WrappedComponentWithProps(Content,{
    session
  }))
  const header = await screen.findByText('Authenticated')
  expect(header).toBeInTheDocument()
})

it('renders 403 when no maintainer', async() => {
  session.status = 'authenticated'
  const Content = () => (
    <ProtectedContent slug="/maintainer">
      <h1>Authenticated</h1>
    </ProtectedContent>
  )
  render(WrappedComponentWithProps(Content,{
    session
  }))
  const b403 = await screen.findByText('403')
  expect(b403).toBeInTheDocument()
})
