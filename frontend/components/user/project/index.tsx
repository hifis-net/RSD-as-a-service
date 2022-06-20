// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import {Session} from '~/auth'
import ProjectsGrid from '~/components/projects/ProjectsGrid'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

import useUserProjects from './useUserProjects'

export default function UserProjects({session}: {session: Session}) {
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Search for project')
  const {loading, projects, count} = useUserProjects({
    searchFor,
    page,
    rows,
    session
  })

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  }, [count, loading, setCount])

  return (
    <ProjectsGrid
      projects={projects}
      height='17rem'
      minWidth='26rem'
      maxWidth='1fr'
      className="gap-[0.125rem] pt-4 pb-12"
    />
  )
}
