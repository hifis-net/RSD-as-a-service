// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext, useState, useRef} from 'react'
import {useRouter} from 'next/router'
import Button from '@mui/material/Button'

import StickyHeader from '../../layout/StickyHeader'
import useStickyHeaderBorder from '~/components/layout/useStickyHeaderBorder'
import editSoftwareContext from './editSoftwareContext'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'

export default function StickyHeaderEditSoftware() {
  const {pageState} = useContext(editSoftwareContext)
  const {isDirty, isValid} = pageState
  const headerRef = useRef(null)
  const [classes, setClasses] = useState('')
  const router = useRouter()
  // add border when header is at the top of the page
  const {el} = useStickyHeaderBorder({
    headerRef, setClasses
  })

  function isSaveDisabled() {
    if (isDirty === false || isValid === false) {
      return true
    }
    return false
  }

  return (
    <StickyHeader className={`flex py-4 w-full bg-white ${classes}`}>
      <h1
        ref={headerRef}
        className="flex-1 text-primary">
        {pageState?.software?.brand_name || ''}
      </h1>
      <div>
        <Button
          tabIndex={1}
          type="button"
          color="secondary"
          onClick={() => {
            const slug = router.query['slug']
            router.push(`/software/${slug}`)
          }}
          sx={{
            marginRight:'2rem'
          }}
        >
          VIEW
        </Button>
        {pageState?.step?.formId ?
          <SubmitButtonWithListener
            formId={pageState?.step?.formId}
            disabled={isSaveDisabled()}
          />
        : null
        }
      </div>
    </StickyHeader>
  )
}
