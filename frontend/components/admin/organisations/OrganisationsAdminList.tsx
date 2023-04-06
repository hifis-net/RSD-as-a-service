// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import List from '@mui/material/List'

import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import ContentLoader from '~/components/layout/ContentLoader'
import {OrganisationList} from '~/types/Organisation'
import {RemoveOrganisationProps} from './apiOrganisation'
import OrganisationItem from './OrganisationItem'

type DeleteOrganisationModal = {
  open: boolean,
  organisation?: OrganisationList
}

type OrganisationsAdminListProps = {
  organisations: OrganisationList[]
  loading: boolean
  onDeleteOrganisation: (props:RemoveOrganisationProps)=>void
}

export default function OrganisationsAdminList({organisations,loading,onDeleteOrganisation}:OrganisationsAdminListProps) {
  const [modal, setModal] = useState<DeleteOrganisationModal>({
    open: false
  })

  if (loading) return <ContentLoader />

  function onDelete(organisation:OrganisationList) {
    if (organisation) {
      setModal({
        open: true,
        organisation
      })
    }
  }

  return (
    <>
      <List sx={{
        width: '100%',
      }}>
        {
          organisations.map(item => {
            return (
              <OrganisationItem
                key={item.id}
                item={item}
                onDelete={()=>onDelete(item)}
              />
            )
          })
        }
      </List>
      <ConfirmDeleteModal
        open={modal.open}
        title="Remove organisation"
        body={
          <>
            <p>
              Are you sure you want to delete organisation <strong>{modal?.organisation?.name}</strong>?
            </p>
          </>
        }
        onCancel={() => {
          setModal({
            open: false
          })
        }}
        onDelete={() => {
          onDeleteOrganisation({
            uuid: modal?.organisation?.id ?? '',
            logo_id: modal?.organisation?.logo_id ?? null
          })
          setModal({
            open: false
          })
        }}
      />
    </>
  )
}
