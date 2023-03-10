// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: EUPL-1.2

import Link from 'next/link'
import {getImageUrl} from '~/utils/editImage'
import StatCounter from '../layout/StatCounter'
// import VerifiedIcon from '@mui/icons-material/Verified'
import {HelmholtzIcon} from '../icons/HelmholtzIcon'
import LogoAvatar from '../layout/LogoAvatar'
import CardTitle from '../layout/CardTitle'

type OrganisationCardProps = {
  name: string,
  is_tenant: boolean,
  rsd_path: string,
  logo_id: string | null
  software_cnt: number | null
  project_cnt: number | null
}

export default function OrganisationCard(organisation: OrganisationCardProps) {

  function getCountAndLabel() {
    const count = organisation.software_cnt ?? 0
    let label = 'software packages'
    if (organisation?.software_cnt === 1) label = 'software package'
    return {
      count,
      label
    }
  }

  const {count, label} = getCountAndLabel()

  return (
    <Link
      data-testid="organisation-card-link"
      href={`/organisations/${organisation.rsd_path}`}
      className="h-full relative"
      passHref
    >
      <article className="flex flex-col border h-full min-h-[16rem] overflow-hidden">
        <div className="pl-8 pt-8 flex">
          <CardTitle
            title={organisation.name}
            className={`${organisation.is_tenant ? 'mr-[5rem]' : 'mr-[2rem]' }`}
          >
            {organisation.name}
          </CardTitle>
          {
            // Fix for HIFIS >> START
            organisation.is_tenant && <span title="Member of the Helmholtz Association">
              <HelmholtzIcon
                sx={{
                  position: 'absolute',
                  right: '1rem',
                  top: '1rem',
                  width: '3rem',
                  height: '3rem',
                  color: 'secondary.main'
                }}
            /></span>
            // Fix for HIFIS << END
          }
        </div>
        <div className="flex-1 grid gap-8 lg:grid-cols-[1fr,1fr] p-8 overflow-hidden">
          <LogoAvatar
            name={organisation.name ?? ''}
            src={getImageUrl(organisation.logo_id) ?? undefined}
            sx={{
              fontSize: '4rem',
              '& img': {
                objectFit: 'contain',
                minHeight: '4rem',
                minWidth: '4rem'
              }
            }}
          />
          <div className="flex-1 flex gap-8 justify-center items-end">
            <StatCounter
              label={label}
              value={count}
            />
            <StatCounter
              label={'research projects'}
              value={organisation.project_cnt ?? 0}
            />
          </div>
        </div>
      </article>
    </Link>
  )
}
