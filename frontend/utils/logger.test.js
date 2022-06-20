// SPDX-FileCopyrightText: 2021 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from './logger'

global.console = {
  error:jest.fn(),
  warn:jest.fn(),
  log:jest.fn()
}

describe('Logger',()=>{
  it('Logs error to console.error',()=>{
    const message='This is my error message'
    logger(message,'error')
    // eslint-disable-next-line
    expect(console.error).toBeCalledWith(`[ERROR] ${message}`)
  })
  it('Logs warning to console.warn',()=>{
    const message='This is my warning message'
    logger(message,'warn')
    // eslint-disable-next-line
    expect(console.warn).toBeCalledWith(`[WARNING] ${message}`)
  })
  it('Ignores console.log in production mode',()=>{
    process.env.NEXT_PUBLIC_ENV = 'production'
    const message='This is my log message'
    logger(message,'info')
    // eslint-disable-next-line
    expect(console.log).not.toBeCalledWith(message)
  })
  it('Logs to console.log in dev mode',()=>{
    // console.log(process.env.NEXT_PUBLIC_ENV)
    process.env.NEXT_PUBLIC_ENV = 'dev'
    // console.log(process.env.NEXT_PUBLIC_ENV)
    const message='This is my log message'
    logger(message,'info')
    // eslint-disable-next-line
    expect(console.log).toBeCalledWith(`[INFO] ${message}`)
  })

})
