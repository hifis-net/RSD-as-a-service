// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {chromium, FullConfig} from '@playwright/test'
import {loginLocal,user} from './login'

/**
 * We remove secure flag from all cookies because
 * we test on localhost and webkit ignores secure cookies
 * @param cookies
 * @returns
 */
function fixCookiesProps(cookies:any) {
  const fixed = cookies.map(cookie => {
    cookie.httpOnly = false
    cookie.secure = false
    cookie.sameSite = 'Lax'
    return cookie
  })
  return fixed
}


/**
 * Global Playwright setup.
 * We login and decline matomo tracking
 * @param config
 */
async function globalSetup(config: FullConfig) {
  // extract from configuration (there is always one project in array)
  // global use is stored in the root but it cannot be accessed directly?
  const {baseURL, storageState} = config.projects[0].use
  console.log('globalSetup...timeout...', config.projects[0].timeout)
  // launch chromium browser
  // set headles = false if you want to see/debug
  const browser = await chromium.launch({
    headless: true
  })
  const page = await browser.newPage()
  // goto to homepage
  await page.goto(baseURL??'/')
  // decline tracking
  await page.getByRole('button', {
    name: 'Decline'
  }).click()
  // sign in - we need to do this because we loose cookies
  await loginLocal({
    page,
    username: user.name
  })
  const state = await page.context().storageState()
  const fixedCookies = fixCookiesProps(state.cookies)
  // console.log('fixedCookies...', fixedCookies)
  // update cookies not to be secure - required for webkit
  await page.context().addCookies(fixedCookies)
  // save cookies
  await page.context().storageState({
    path: storageState as string
  })
  // close browser
  await browser.close()
}

export default globalSetup
