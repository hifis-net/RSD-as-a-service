// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/** @type {import('next').NextConfig} */

// proxy to nginx service when running as frontend-dev docker service
// proxy to localhost when in standalone development mode (yarn dev)
let rewritesConfig = []
if (process.env.NODE_ENV === 'docker') {
  // proxies for frontend-dev service
  // developing using node docker container
  rewritesConfig=[
    {
      source: '/image/:path*',
      destination: 'http://nginx/image/:path*',
    },
    {
      source: '/api/v1/:path*',
      destination: 'http://nginx/api/v1/:path*',
    },
    {
      source: '/auth/login/local',
      destination: 'http://nginx/auth/login/local',
    }
  ]
} else if (process.env.NODE_ENV === 'development'){
  rewritesConfig = [
    {
      source: '/image/:path*',
      destination: 'http://nginx/image/:path*',
    },
    {
      source: '/api/v1/:path*',
      destination: 'http://nginx/api/v1/:path*',
    },
    {
      source: '/auth/login/local',
      destination: 'http://localhost/auth/login/local',
    }
  ]
}

// console.log('process.env.NODE_ENV',process.env.NODE_ENV)
// console.log('process.env.PWD', process.env.PWD)

module.exports = {
  images: {
    // Allow loading images from hifis.net
    domains: ['hifis.net']
  },
  // create standalone output to use in docker image
  // and achieve minimal image size (see Dockerfile)
  output: 'standalone',
  // disable strict mode if you want react to render compent once
  // see for more info https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: false,
  eslint: {
    // Run ESLint in these directories during production builds (next build)
    // by default next runs linter only in pages/, components/, and lib/
    dirs: ['auth', 'components', 'config', 'pages', 'styles', 'types', 'utils']
  },
  // only in development
  rewrites: async () => rewritesConfig,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}
