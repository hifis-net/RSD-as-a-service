// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
//
// SPDX-License-Identifier: EUPL-1.2

import Link from 'next/link'
import {OrganisationForOverview} from '~/types/Organisation'
import {getImageUrl} from '~/utils/editImage'

/* eslint-disable @next/next/no-img-element */

export default function HorizontalScrollContainer(
{organisations}: {organisations: OrganisationForOverview[]}
) {
  return (
    <div
      style={{
        display: 'flex',
        height: '200px'
      }}
    >
      {
        organisations.map(item => {
          const imageUrl = getImageUrl(item.logo_id)
          if (imageUrl !== null) {
            return(
              <Link
                key={`link_${item.name}`}
                href={`/organisations/${item.rsd_path}`}
                passHref
                >
                <img
                  alt={item.name}
                  src={imageUrl}
                  className="p-10 hover:cursor-pointer max-w-none w-auto"
                  style = {{
                    height: '200px',
                  }}
                />
              </Link>
            )
          }
        })
      }
    </div>
  )
}
