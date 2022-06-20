// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: '.',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // moduleDirectories: ['./node_modules', './frontend'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  // use only files with *.test.js
  testMatch: [
    '**/*.test.{js,jsx,ts,tsx}'
  ],
  // coverage only from specific folders
  collectCoverageFrom: [
    './auth/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './utils/**/*.{js,jsx,ts,tsx}',
    '!./utils/jest/**'
  ],
  moduleNameMapper: {
    // need to map d3 to avoid SyntaxError: Unexpected token 'export'
    'd3': '<rootDir>/node_modules/d3/dist/d3.min.js',
    // Wildcard module name mapper MUST BE at the botton of this list
    '~/(.*)$': '<rootDir>/$1',
  },
  // modulePathIgnorePatterns: ['__mocks__', '__fixtures__','utils/jest'],
  // d3 solution that does not work
  // transformIgnorePatterns: ['/node_modules/(?!d3|d3-array|internmap|delaunator|robust-predicates)'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
