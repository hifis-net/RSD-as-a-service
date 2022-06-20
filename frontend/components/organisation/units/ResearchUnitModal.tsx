// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {
  Avatar,
  Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, useMediaQuery
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import {useForm} from 'react-hook-form'

import useSnackbar from '../../snackbar/useSnackbar'
import ControlledTextField from '../../form/ControlledTextField'
import {EditOrganisation} from '../../../types/Organisation'
import {organisationInformation as config} from '../organisationConfig'
import {getUrlFromLogoId} from '../../../utils/editOrganisation'
import logger from '../../../utils/logger'

import {getSlugFromString, sanitizeSlugValue} from '../../../utils/getSlugFromString'
import SubmitButtonWithListener from '~/components/form/SubmitButtonWithListener'

type EditOrganisationModalProps = {
  open: boolean,
  onCancel: () => void,
  onSubmit: ({data, pos}: { data: EditOrganisation, pos?: number }) => void,
  onDeleteLogo: (logo_id:string) => void,
  organisation?: EditOrganisation,
  // item position in the array
  pos?: number
  title?: string
}

const formId='research-unit-modal'

export default function EditOrganisationModal({
  open, onCancel, onSubmit, onDeleteLogo, organisation, pos, title = 'Organisation'
}: EditOrganisationModalProps) {
  const {showWarningMessage} = useSnackbar()
  const smallScreen = useMediaQuery('(max-width:600px)')
  const [baseUrl, setBaseUrl] = useState('')
  const [slugValue, setSlugValue] = useState(organisation?.slug ?? '')
  const [validating, setValidating] = useState(false)
  const {handleSubmit, watch, formState, reset, control, register, setValue, setError,clearErrors} = useForm<EditOrganisation>({
    mode: 'onChange',
    defaultValues: {
      ...organisation
    }
  })

  // extract
  const {isValid, isDirty, errors} = formState
  const formData = watch()

    useEffect(() => {
    if (typeof location != 'undefined') {
      // baseUrl is current location
      setBaseUrl(`${location.href}/`)
    }
  }, [])

  useEffect(() => {
    if (organisation) {
      reset(organisation)
    }
  }, [organisation, reset])

  useEffect(() => {
    const organisationSlug = getSlugFromString(formData.name)
    // debugger
    setSlugValue(organisationSlug)
    setValue('slug', organisationSlug,{shouldValidate:true,shouldDirty:true})
    // reset({slug:organisationSlug})
  },[formData.name, setValue])

  function handleCancel() {
    // hide
    onCancel()
  }

  function handleFileUpload({target}:{target: any}) {
    try {
      let file = target.files[0]
      if (typeof file == 'undefined') return
      // check file size
      if (file.size > 2097152) {
        // file is to large > 2MB
        showWarningMessage('The file is too large. Please select image < 2MB.')
        return
      }
      let reader = new FileReader()
      reader.onloadend = function () {
        if (reader.result) {
          // write to new avatar b64
          setValue('logo_b64', reader.result as string)
          setValue('logo_mime_type', file.type,{shouldDirty: true})
        }
      }
      reader.readAsDataURL(file)
    } catch (e:any) {
      logger(`handleFileUpload: ${e.message}`,'error')
    }
  }

  function deleteLogoFromDb() {
    if (formData.logo_id) {
      onDeleteLogo(formData.logo_id)
    }
    setValue('logo_id', null)
  }

  function onSlugChange(slug: string) {
    // if nothing is changed
    const newSlug = sanitizeSlugValue(slug)
    if (newSlug === formData.slug) return
    if (newSlug.length < config.slug.validation.minLength.value) {
      setError('slug',{
        type: 'invalid-slug',
        message: config.slug.validation.minLength.message
      })
    } else {
      // clear errors
      if (errors?.slug) clearErrors('slug')
    }
    // save new value on both locations
    // debugger
    setSlugValue(newSlug)
    setValue('slug', newSlug,{shouldValidate:true,shouldDirty:true})
  }

  return (
     <Dialog
      // use fullScreen modal for small screens (< 600px)
      fullScreen={smallScreen}
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
        fontWeight: 500
      }}>
        {title}
      </DialogTitle>
      <form
        id={formId}
        onSubmit={handleSubmit((data: EditOrganisation) => onSubmit({data, pos}))}
        autoComplete="off"
      >
        {/* hidden inputs */}
        <input type="hidden"
          {...register('id')}
        />
        <input type="hidden"
          {...register('parent')}
        />
        <input type="hidden"
          {...register('position')}
        />
        <DialogContent sx={{
          width: '100%',
          padding: '2rem 1.5rem 2.5rem'
        }}>
          <section className="grid grid-cols-[1fr,3fr] gap-8">
             <div>
              <label htmlFor="upload-avatar-image-modal"
                  style={{cursor:'pointer'}}
                  title="Click to upload an image"
                >
                <Avatar
                  alt={formData.name ?? ''}
                  src={formData.logo_b64 ?? getUrlFromLogoId(formData?.logo_id) ?? ''}
                  sx={{
                    width: '8rem',
                    height: '8rem',
                    fontSize: '3rem',
                    marginRight: '0rem',
                    '& img': {
                      height:'auto'
                    }
                  }}
                  variant="square"
                >
                  {formData.name ? formData.name.slice(0,3) : ''}
                </Avatar>
              </label>
              <input
                id="upload-avatar-image-modal"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{display:'none'}}
              />
              <div className="flex pt-4">
                <Button
                  title="Remove image"
                  // color='primary'
                  disabled={!formData.logo_b64 && !formData.logo_id}
                  onClick={() => {
                    if (formData?.logo_b64) {
                      setValue('logo_b64', null)
                    }
                    if (formData.logo_id) {
                      deleteLogoFromDb()
                    }
                    setValue('logo_mime_type',null,{shouldDirty: true})
                  }}
                >
                  remove <DeleteIcon/>
                </Button>
              </div>
            </div>
            <div>
              <ControlledTextField
                control={control}
                options={{
                  name: 'name',
                  // variant: 'outlined',
                  label: config.name.label,
                  useNull: true,
                  defaultValue: formData?.name,
                  helperTextMessage: config.name.help,
                  helperTextCnt: `${formData?.name?.length || 0}/${config.name.validation.maxLength.value}`,
                }}
                rules={config.name.validation}
              />
              <div className="py-2"></div>
              <div className="text-xs">{baseUrl}{formData.slug ?? ''}</div>
              <TextField
                autoComplete='off'
                placeholder={config.slug.label}
                variant="standard"
                value={formData.slug ?? ''}
                error={false}
                helperText={config.slug.help}
                onChange={({target}) => onSlugChange(target.value)}
                sx={{
                  width:'100%'
                }}
              />
            </div>
          </section>
          <div className="py-2"></div>
          <ControlledTextField
            control={control}
            options={{
              name: 'website',
              // variant: 'outlined',
              label: config.website.label,
              useNull: true,
              defaultValue: formData?.website,
              helperTextMessage: config.website.help,
              helperTextCnt: `${formData?.website?.length || 0}/${config.website.validation.maxLength.value}`,
            }}
            rules={config.website.validation}
          />
        </DialogContent>
        <DialogActions sx={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            tabIndex={1}
            onClick={handleCancel}
            color="secondary"
            sx={{marginRight:'2rem'}}
          >
            Cancel
          </Button>
          <SubmitButtonWithListener
            disabled={isSaveDisabled()}
            formId={formId}
          />
        </DialogActions>
      </form>
    </Dialog>
  )

  function isSaveDisabled() {
    // if pos is undefined we are creating
    // new entry, but we might already have required
    // information (first name - last name). In this
    // case we only check if form is valid
    if (typeof pos == 'undefined') {
      if (isValid === false) return true
    } else {
      if (isValid === false) return true
      if (isDirty === false) return true
    }
    return false
  }
}
