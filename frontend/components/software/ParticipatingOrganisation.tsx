// SPDX-FileCopyrightText: 2022 Dusan Mijatovic
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {ParticipatingOrganisationProps} from '../../types/Organisation'
import LogoAvatar from '~/components/layout/LogoAvatar'

export default function OrganisationItem({slug, name, website, logo_url}: ParticipatingOrganisationProps) {

  function renderLogo() {
    return (
      <LogoAvatar
        name={name}
        src={logo_url ?? undefined}
      />
    )
  }

  let url: string=''
  if (slug) {
    // internal RSD link to organisation
    url = `/organisations/${slug}`
    return (
      <Link href={url} passHref>
        <a
          title={name}
          className="flex items-center" rel="noreferrer">
          {renderLogo()}
        </a>
      </Link>
    )
  }

  if (website) {
    // organisation website
    url = website
    return (
      <a href={url} target="_blank"
        title={name}
        className="flex items-center" rel="noreferrer">
        {renderLogo()}
      </a>
    )
  }

  // should never happen
  return (
    <div
      title={name}
      className="flex">
      {renderLogo()}
    </div>
  )
}
