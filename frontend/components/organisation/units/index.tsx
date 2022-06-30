// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'

import {Session} from '../../../auth'
import useSnackbar from '../../snackbar/useSnackbar'
import ContentLoader from '../../layout/ContentLoader'
import {EditOrganisation, OrganisationForOverview} from '../../../types/Organisation'
import {
  createOrganisation, deleteOrganisationLogo,
  newOrganisationProps, updateOrganisation,
  updateDataObjectAfterSave,
  deleteOrganisation
} from '../../../utils/editOrganisation'
import useOrganisationUnits from '../../../utils/useOrganisationUnits'
import {sortOnStrProp} from '../../../utils/sortFn'
import UnitsList from './ResearchUnitList'
import ResearchUnitModal from './ResearchUnitModal'

type EditOrganisationModal = {
  open: boolean,
  pos?: number,
  organisation?: EditOrganisation
}

export default function ResearchUnits({organisation, session}:
  {organisation: OrganisationForOverview, session: Session}) {
  const {showErrorMessage,showSuccessMessage} = useSnackbar()
  const {units, setUnits,loading} = useOrganisationUnits({
    organisation: organisation.id,
    token: session.token
  })
  const [modal, setModal] = useState<EditOrganisationModal>({
    open: false
  })
  const [isPrimary,setPrimary]=useState(organisation.primary_maintainer===session.user?.account)

  useEffect(() => {
    let abort = false
    if (organisation.primary_maintainer === session.user?.account ||
      session?.user?.role === 'rsd_admin') {
      if (abort) return
      setPrimary(true)
    }
    return ()=>{abort=true}
  },[organisation.primary_maintainer,session.user?.account,session.user?.role])

  function renderAddBtn() {
    if (isPrimary) {
      return (
        <Button
          startIcon={<AddIcon />}
          onClick={onAddUnit}
        >
          Add
      </Button>
      )
    }
    return null
  }

  function onAddUnit() {
    if (organisation) {
      const newOrganisation:EditOrganisation = newOrganisationProps({
        name:'',
        position: 1,
        // the primary_maintainer of parent is also
        // primary_maintainer of child organisations
        primary_maintainer: organisation.primary_maintainer ?? '',
        parent: organisation.id
      })
      // show modal
      setModal({
        open: true,
        organisation: newOrganisation
      })
    }
  }

  function closeModals() {
    setModal({
      open: false
    })
  }

  function addUnitToCollection(unit:EditOrganisation) {
    const newUnits = [
      ...units,
      unit
    ].sort((a,b)=>sortOnStrProp(a,b,'name'))
    setUnits({
      // cast type for now and improve later
      data: newUnits as OrganisationForOverview[],
      count: newUnits.length
    })
  }

  function updateUnitInList(unit:EditOrganisation,pos:number) {
    const newList = [
      ...units.slice(0, pos),
      ...units.slice(pos+1),
      unit
    ].sort((a, b) => sortOnStrProp(a, b, 'name'))
    setUnits({
      // cast type for now and improve later
      data: newList as OrganisationForOverview[],
      count: newList.length
    })
  }

  async function saveOrganisation({data, pos}:{data: EditOrganisation, pos?: number }) {
    try {
      closeModals()
      if (typeof pos != 'undefined' && data.id) {
        // update existing organisation
        const resp = await updateOrganisation({
          item: data,
          token: session?.token
        })
        if (resp.status !== 200) {
          showErrorMessage(resp.message)
        } else {
          updateUnitInList(data,pos)
        }
      } else {
        // create new organisation
        const resp = await createOrganisation({
          item: data,
          token: session?.token
        })
        if (resp.status === 201) {
          const newUnit = updateDataObjectAfterSave({
            data,
            id: resp.message
          })
          addUnitToCollection(newUnit)
        } else {
          showErrorMessage(resp.message)
        }
      }
    } catch (e:any) {
      showErrorMessage(e.message)
    }
  }

  async function onDeleteOrganisationLogo(logo_id: string) {
    const resp = await deleteOrganisationLogo({
      id: logo_id,
      token: session.token
    })
    if (resp.status !== 200) {
      showErrorMessage(resp.message)
    }
  }

  function onEditUnit(pos: number) {
    // TODO! missing primary maintainer!
    // console.log('ResearchUnits: TODO! on edit unit...', pos)
    const unit = units[pos]
    if (unit) {
      // convert to EditOrganisation
      const editOrganisation: EditOrganisation = {
        ...unit,
        position: pos,
        logo_b64: null,
        logo_mime_type: null,
        // it is already in RSD
        source: 'RSD'
      }
      setModal({
        open: true,
        organisation:editOrganisation,
        pos
      })
    }
  }

  async function onDeleteUnit(pos: number) {
    // TODO!
    // DELETE is more involved as it would need
    // to REMOVE logo, all software and projects
    // BEFORE removing the organisation
    // logger('ResearchUnits: TODO! delete not implemented', 'warn')
    const unit = units[pos]
    if (unit) {
      const resp = await deleteOrganisation({
        uuid: unit.id,
        logo_id: unit.logo_id,
        token: session.token
      })
      if (resp.status === 200) {
        showSuccessMessage(`${unit.name} is removed`)
      } else {
        showErrorMessage(`Failed to remove ${unit.name}. ${resp.message}`)
      }
    }
  }

  function renderUnitList() {
    if (loading) {
      return <ContentLoader />
    }
    return (
      <UnitsList
        organisations={units}
        isMaintainer={isPrimary}
        onEdit={onEditUnit}
        onDelete={onDeleteUnit}
      />
    )
  }

  return (
    <section className="flex-1 flex flex-col">
      <section className="flex justify-between py-4">
        <h2>Research Units ({units.length ?? 0})</h2>
        {renderAddBtn()}
      </section>
      <section className="py-8">
        {renderUnitList()}
      </section>
      <ResearchUnitModal
        title="Research unit"
        open={modal.open}
        pos={modal.pos}
        organisation={modal.organisation}
        onCancel={closeModals}
        onSubmit={saveOrganisation}
        onDeleteLogo={onDeleteOrganisationLogo}
      />
    </section>
  )
}
