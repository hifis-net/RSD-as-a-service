// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import BlockIcon from '@mui/icons-material/Block'

import {EditOrganisation} from '../../../../types/Organisation'
import {getUrlFromLogoId} from '../../../../utils/editOrganisation'
import IconOverlay from '~/components/layout/IconOverlay'

type OrganisationsListItemProps = {
  organisation: EditOrganisation
  pos: number
  onEdit: (pos:number)=>void
  onDelete: (pos:number)=>void
}

export default function OrganisationsItem({organisation, pos, onEdit, onDelete}: OrganisationsListItemProps) {

  function getSecondaryActions() {
    if (organisation.status !== 'approved') {
      return (
        <div
          title={`Affiliation rejected by ${organisation.name}`}
        >
          <BlockIcon
            sx={{
              width: '4rem',
              height: '4rem',
              color: 'error.main',
              opacity:0.5
            }}
          />
        </div>
      )
    }
    if (organisation.canEdit) {
      return (
        <>
          <IconButton
            edge="end"
            aria-label="edit"
            sx={{marginRight: '1rem'}}
            onClick={() => {
              onEdit(pos)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => {
              onDelete(pos)
            }}
            sx={{marginRight: '0rem'}}
          >
            <DeleteIcon />
          </IconButton>
        </>
      )
    }
    return (
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={() => {
          onDelete(pos)
        }}
        sx={{marginRight: '0rem'}}
      >
        <DeleteIcon />
      </IconButton>
    )
  }

  function getStatusIcon() {
    if (organisation.status !== 'approved') {
      return (
        <IconOverlay
          title="Affiliation denied by organisation"
          // className="absolute flex items-center w-[2rem] h-[6rem] bg-error"
        >
          <BlockIcon
            sx={{
              width: '100%',
              height: '100%',
              color: 'error.main'
            }}
          />
        </IconOverlay>
      )
    }
    return null
  }

  return (
     <ListItem
        key={JSON.stringify(organisation)}
        secondaryAction={getSecondaryActions()}
      sx={{
          // position:'relative',
          // this makes space for buttons
          paddingRight:'7.5rem',
          '&:hover': {
            backgroundColor:'grey.100'
          }
        }}
    >
      <ListItemAvatar>
        <Avatar
          alt={organisation.name ?? ''}
          src={getUrlFromLogoId(organisation.logo_id) ?? ''}
          sx={{
            width: '6rem',
            height: '6rem',
            fontSize: '3rem',
            marginRight: '1rem',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          {organisation.name.slice(0,3)}
        </Avatar>
      </ListItemAvatar>
      {/* {getStatusIcon()} */}
      <ListItemText
        primary={organisation.name}
        secondary={
          <>
            <span>{organisation.website}</span>
            <br/>
            <span>{organisation.ror_id}</span>
          </>
        }
      />
    </ListItem>
  )
}
