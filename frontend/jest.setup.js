// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

// used to support fetch with Jest
import 'whatwg-fetch'
// specific
import '@testing-library/jest-dom/extend-expect'

// retry 2 times
jest.retryTimes(2, {
  logErrorsBeforeRetry: true
})

// TODO! investigate other options beside mocking
// MOCK REACT-MARKDOWN library as it fails to load in current setup
// there seem to be problem with ESM modules and Jest loading these
jest.mock('react-markdown', () => {
  // return mock function (functional react component)
  return jest.fn((props) => {
    // console.log("Mock react markdown...props...", props)
    if (props.hasOwnProperty('children')===true) {
      return props['children']
    } else {
      return 'No children'
    }
  })
})
// MOCK REACT-MARKDOWN plugin as it fails to load in current setup
// there seem to be problem with ESM modules and Jest loading these
jest.mock('remark-gfm', () => {
  // return mock function (functional react component)
  return jest.fn((props) => {
    // console.log("Mock react markdown...props...", props)
    if (props.hasOwnProperty('children')===true) {
      return props['children']
    } else {
      return 'No children'
    }
  })
})

// MOCK REMARK-BREAKS plugin as it fails to load in current setup
// there seem to be problem with ESM modules and Jest loading these
jest.mock('remark-breaks', jest.fn((...props) => {
  // console.log('remark-breaks...', props)
  return props
}))


// MOCK useRouter
jest.mock('next/router', () => ({
  useRouter() {
    return {
      // pathname: 'testPaths',
      asPath: 'test-path',
      // ... whatever else you call on `router`
      query: {
        test: 'query',
        slug: 'test-slug'
      }
    }
  },
}))


// mock console log
global.console = {
  ...global.console,
  error: jest.fn(),
  warn: jest.fn(),
  // do not mock log -> we can debug using console.log
  // log: jest.fn()
}

// MOCK scrollTo used in markdown component (not present in jsdom)
window.scrollTo = jest.fn()

// TOKEN
// process.env.PGRST_JWT_SECRET='reallyreallyreallyreallyverysafe'
