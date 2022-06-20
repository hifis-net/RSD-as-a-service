// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Alert, AlertTitle} from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import LockIcon from '@mui/icons-material/Lock'

import {RelatedProject} from '~/types/Project'
import {maxText} from '~/utils/maxText'

type ProjectListProps = {
  projects: RelatedProject[] | undefined
  onRemove:(pos:number)=>void
}

type ProjectItemProps = {
  project: RelatedProject
  onDelete:()=>void
}

// list item & alert height
const itemHeight='6rem'

export default function RelatedProjectList({projects,onRemove}:ProjectListProps) {

  if (typeof projects == 'undefined') return null

  if (projects.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem',height:itemHeight}}>
        <AlertTitle sx={{fontWeight:500}}>No related projects</AlertTitle>
        Add related projects using <strong>search form!</strong>
      </Alert>
    )
  }

  function renderList() {
    if (typeof projects == 'undefined') return null
    return projects.map((item,pos) => {
      return (
        <RelatedProjectItem
          key={pos}
          project={item}
          onDelete={()=>onRemove(pos)}
        />
      )
    })
  }

  return (
    <List sx={{
      width: '100%',
    }}>
      {renderList()}
    </List>
  )
}

export function RelatedProjectItem({project,onDelete}:ProjectItemProps) {
  function getStatusIcon() {
    if (project.status !== 'approved') {
      return (
        <div
          title="Waiting on approval"
          className="absolute flex items-center w-[2rem] h-[4rem] bg-primary"
        >
          <LockIcon
            sx={{
              width: '2rem',
              height: '2rem',
              color: 'white'
            }}
          />
        </div>
      )
    }
    return null
  }
  return (
     <ListItem
        secondaryAction={
          <>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={onDelete}
            sx={{marginRight: '0rem'}}
          >
            <DeleteIcon />
          </IconButton>
        </>
        }
      sx={{
          height:itemHeight,
          // this makes space for buttons
          paddingRight:'5rem',
          '&:hover': {
            backgroundColor:'grey.100'
          }
        }}
    >
      <ListItemAvatar>
        <Avatar
          alt={project.title}
          // src={getImageUrl(project.image_id) ?? ''}
          sx={{
            width: '4rem',
            height: '4rem',
            fontSize: '2rem',
            marginRight: '1rem',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          {project?.title.slice(0,2).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      {getStatusIcon()}
      <ListItemText
        primary={
          <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer">
            {project.title}
          </a>
        }
        secondary={maxText({
          text: project.subtitle
        })
        }
      />
    </ListItem>
  )
}
