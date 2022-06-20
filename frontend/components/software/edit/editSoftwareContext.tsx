// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {createContext} from 'react'
import {EditSoftwarePageStep} from './editSoftwareSteps'
import logger from '../../../utils/logger'

export type SoftwareInfo = {
  id?: string,
  slug?: string,
  brand_name?: string,
  concept_doi?: string,
}

export type EditSoftwareState = {
  step: EditSoftwarePageStep | undefined
  software: SoftwareInfo
  isDirty: boolean
  isValid: boolean
  loading: boolean
}

export type Action = {
  type: EditSoftwareActionType,
  payload: any
}

export const initialState = {
  step: undefined,
  software: {
    id: '',
    slug: '',
    brand_name:'',
    concept_doi: '',
  },
  isDirty: false,
  isValid: true,
  loading: true
}

export function editSoftwareReducer(state: EditSoftwareState = initialState, action: Action) {
  // console.group('editSoftwareReducer')
  // console.log('state...', state)
  // console.log('action...', action)
  // console.groupEnd()
  switch (action.type) {
    case EditSoftwareActionType.SET_EDIT_STEP:
      return {
        ...state,
        // default values
        isDirty: false,
        isValid: true,
        loading: true,
        // new step
        step: action.payload,
      }
    case EditSoftwareActionType.SET_SOFTWARE_INFO:
      return {
        ...state,
        software: {
          ...state.software,
          ...action.payload
        }
      }
    case EditSoftwareActionType.SET_LOADING: {
      return {
        ...state,
        loading: action.payload
      }
    }
    case EditSoftwareActionType.UPDATE_STATE:
      return {
        ...state,
        ...action.payload
      }
    default:
      logger(`editSoftwareReducer UNKNOWN ACTION TYPE ${action.type}`, 'warn')
      return state
  }
}

export enum EditSoftwareActionType {
  SET_SOFTWARE_INFO = 'SET_SOFTWARE_INFO',
  SET_EDIT_STEP = 'SET_EDIT_STEP',
  SET_LOADING = 'SET_LOADING',
  UPDATE_STATE = 'UPDATE_STATE',
}

const EditSoftwareContext = createContext<{ pageState: EditSoftwareState, dispatchPageState(action: Action): void }>({
  pageState: {
    step: undefined,
    software: {
      id: '',
      slug: '',
      brand_name: '',
      concept_doi: '',
    },
    isDirty: false,
    isValid: true,
    loading: true
  },
  dispatchPageState:()=>{}
})

// const EditSoftwareContext = createContext(undefined)
export default EditSoftwareContext
