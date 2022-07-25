// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import {Testimonial} from '~/types/Testimonial'
import SortableList from '~/components/layout/SortableList'
import SortableTestimonialListItem from './SortableTestimonialListItem'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

type SortableTestimonialProps={
  items: Testimonial[],
  onEdit:(pos:number)=>void,
  onDelete:(pos:number)=>void,
  onSorted:(items: Testimonial[])=>void
}

export default function SortableTestimonialList({items, onEdit, onDelete, onSorted}: SortableTestimonialProps) {
  if (items.length === 0) {
    return (
      <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
        <AlertTitle sx={{fontWeight:500}}>No testimonials</AlertTitle>
        Add one using <strong>ADD button!</strong>
      </Alert>
    )
  }
  /**
   * This method is called by SortableList component to enable
   * rendering of custom sortable items
   * @param item
   * @param index
   * @returns JSX.Element
   */
  function renderListItem(item:Testimonial,index?:number) {
    return (
      <SortableTestimonialListItem
        key={JSON.stringify(item)}
        item={item}
        secondaryAction={
          <>
          <IconButton
            edge="end"
            aria-label="edit"
            sx={{marginRight: '1rem'}}
            onClick={() => {
              if (typeof index !== 'undefined') onEdit(index)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => {
              if (typeof index !== 'undefined') onDelete(index)
            }}
          >
            <DeleteIcon />
          </IconButton>
          </>
        }
      />
    )
  }

  return (
    <SortableList
      items={items}
      onRenderItem={renderListItem}
      onSorted={onSorted}
    />
  )
}