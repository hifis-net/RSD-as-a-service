// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ListItem, ListItemAvatar, ListItemText} from '@mui/material'
import {Draggable} from 'react-beautiful-dnd'
import {Testimonial} from '../../../../types/Testimonial'

export type DraggableListItemProps = {
  item: Testimonial
  index: number
  secondaryAction: JSX.Element
}

export default function SoftwareTestimonialDndListItem({item,index,secondaryAction}:DraggableListItemProps) {
  return (
    <Draggable draggableId={item?.id??''} index={index}>
      {(provided, snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            // spacing
            paddingRight:'8rem',
            backgroundColor: snapshot.isDragging ? 'grey.100' : 'paper'
          }}
          secondaryAction={secondaryAction}
        >
          <ListItemAvatar>
            <span className='text-[3rem]'>{item?.position}</span>
          </ListItemAvatar>
          <ListItemText
            primary={item?.message}
            secondary={<span>- {item?.source}</span>}
          />
        </ListItem>
      )}
    </Draggable>
  )
}
