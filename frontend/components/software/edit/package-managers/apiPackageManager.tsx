// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'

import logger from '~/utils/logger'
import {
  createJsonHeaders, extractErrorMessages,
  extractReturnMessage, getBaseUrl
} from '~/utils/fetchHelpers'

export const packageManagerSettings = {
  anaconda: {
    name: 'Anaconda',
    icon: '/images/anaconda-logo-96.svg',
    hostname: ['www.anaconda.com','anaconda.com','anaconda.org']
  },
  cran: {
    name: 'CRAN',
    icon: '/images/cran-r-logo.svg',
    hostname: ['cran.r-project.org']
  },
  dockerhub: {
    name: 'Dockerhub',
    icon: '/images/dockerhub-logo.webp',
    hostname: ['hub.docker.com']
  },
  maven: {
    name: 'Maven',
    icon: '/images/apache-maven-logo.svg',
    hostname: ['maven.apache.org','repo.maven.apache.org']
  },
  npm: {
    name: 'NPM',
    icon: '/images/npm-logo-64.png',
    hostname: ['www.npmjs.com','npmjs.com']
  },
  pypi: {
    name: 'PyPi',
    icon: '/images/pypi-logo.svg',
    hostname: ['pypi.org']
  },
  other: {
    name: 'Other',
    icon: null,
    hostname: ['other']
  }
}

export type PackageManagerTypes = keyof typeof packageManagerSettings

export type PackageManagerInfoProps = {
  name: string,
  icon: string | null,
  hostname: string[]
}

export type NewPackageManager = {
  id: string|null
  software: string,
  url: string,
  package_manager: PackageManagerTypes|null,
  position: number
}

export type UpdateManagerProps = NewPackageManager &{
  id: string,
}

export type PackageManager = NewPackageManager & {
  id: string,
  download_count: number | null,
  download_count_scraped_at: string | null,
  reverse_dependencies_count: number | null,
  reverse_dependency_count_scraped_at: string | null
}

export function usePackageManagers({token, software}: { token: string, software: string }) {
  const [managers,setManagers]=useState<PackageManager[]>([])
  const [loading,setLoading]=useState(true)

  const getManagers = useCallback(async () => {
    setLoading(true)
    const managers = await getPackageManagers({
      software,
      token
    })
    setManagers(managers)
    setLoading(false)
  },[software,token])


  useEffect(() => {
    if (token && software) {
      getManagers()
    }
  }, [token, software, getManagers])

  async function saveManager(data: NewPackageManager) {
    const resp = await postPackageManager({
      data,
      token
    })
    // debugger
    if (resp.status !== 200) {
      return resp
    }
    // reload package managers
    await getManagers()
    return resp
  }
  // NOTE! Cannot update record - it seems not to be allowed at DB level
  // async function updateManager(item: NewPackageManager) {
  //   if (item.id) {
  //     // const data:UpdateManagerProps = {
  //     //   id: item.id,
  //     //   software: item.software,
  //     //   url: item.url,
  //     //   package_manager: item.package_manager,
  //     //   position: item.position
  //     // }
  //     // update item
  //     const resp = await putPackageManager({
  //       data,
  //       token
  //     })
  //     debugger
  //     if (resp.status !== 200) {
  //       return resp
  //     }
  //     // reload package managers
  //     await getManagers()
  //     return resp
  //   } else {
  //     return {
  //       status: 400,
  //       message: 'Item id missing'
  //     }
  //   }
  // }

  async function deleteManager(id: string) {
    if (id) {
      const resp = await deletePackageManager({
        id,
        token
      })
      if (resp.status !== 200) {
        return resp
      }

      await getManagers()
      return {
        status: 200,
        message: 'OK'
      }
    } else {
      return {
        status: 400,
        message: 'Id is missing'
      }
    }
  }

  async function sortManagers(items: PackageManager[]) {
    // visually confirm position change
    setManagers(items)
    // make all request
    const resp = await patchPackageManagers({
      items,
      token
    })
    if (resp.status !== 200) {
      // revert back in case of error
      setManagers(items)
    }
    // return response
    return resp
  }

  return {
    managers,
    loading,
    saveManager,
    sortManagers,
    deleteManager
  }
}

async function getPackageManagers({software, token}: { software: string, token: string }) {
  try {
    const query = `software=eq.${software}&order=position.asc,package_manager.asc`
    const url = `${getBaseUrl()}/package_manager?${query}`

    // make request
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      },
    })

    if (resp.status === 200) {
      const json:PackageManager[] = await resp.json()
      return json
    }
    logger(`getPackageManagers...${resp.status} ${resp.statusText}`,'warn')
    return []
  } catch (e: any) {
    logger(`getPackageManagers failed. ${e.message}`,'error')
    return []
  }
}

async function postPackageManager({data, token}: { data: NewPackageManager, token: string }) {
  try {

    let url = `${getBaseUrl()}/package_manager`

    if (data.id) {
      const query=`id=eq.${data.id}`
      url = `${getBaseUrl()}/package_manager?${query}`
    }

    // make request
    const resp = await fetch(url,{
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // UPSERT=merging also works with POST method
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    logger(`postPackageManager failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}
// NOTE! Cannot update record - it seems not to be allowed at DB level
// async function putPackageManager({data, token}: { data: NewPackageManager, token: string }) {
//   try {
//     const query = `id=eq.${data.id}`
//     const url = `${getBaseUrl()}/package_manager?${query}`

//     // make request
//     const resp = await fetch(url,{
//       method: 'PUT',
//       headers: {
//         ...createJsonHeaders(token),
//         // UPSERT=merging also works with POST method
//         'Prefer': 'resolution=merge-duplicates'
//       },
//       body: JSON.stringify(data)
//     })

//     return extractReturnMessage(resp)

//   } catch (e: any) {
//     logger(`postPackageManager failed. ${e.message}`, 'error')
//     return {
//       status: 500,
//       message: e.message
//     }
//   }
// }

async function patchPackageManagers({items, token}: { items: PackageManager[], token: string }) {
  try {
    // create all requests
    const requests = items.map(item => {
      return patchPackageManagerItem({
        id: item.id,
        key: 'position',
        value: item.position,
        token
      })
    })
    // execute them in parallel
    const responses = await Promise.all(requests)
    // check for errors
    const errors = extractErrorMessages(responses)
    if (errors.length > 0) {
      return errors[0]
    }
    // if no errors it's OK
    return {
      status: 200,
      message: 'OK'
    }
  } catch (e: any) {
    logger(`patchPackageManagers failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

async function patchPackageManagerItem({id,key,value,token}:
  { id:string,key:string,value:any,token:string }) {
  try {
    const url = `/api/v1/package_manager?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      // just update position!
      body: JSON.stringify({
        [key]:value
      })
    })
    // extract errors
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`patchPackageManagerData failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

async function deletePackageManager({id,token}:{id: string,token:string}) {
  try {
    const url = `/api/v1/package_manager?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    // extract errors
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`patchPackageManagerData failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export function getPackageManagerTypeFromUrl(url:string) {
  try {
    const urlObject = new URL(url)
    const keys = Object.keys(packageManagerSettings)

    const pm_key = keys.find(key => {
      const manager = packageManagerSettings[key as PackageManagerTypes]
      // match hostname
      return manager.hostname.includes(urlObject.hostname)
    })

    if (pm_key) {
      return pm_key as PackageManagerTypes
    }
    return 'other' as PackageManagerTypes
  } catch (e: any) {
    return 'other' as PackageManagerTypes
  }
}
