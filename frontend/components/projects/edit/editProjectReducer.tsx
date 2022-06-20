// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {EditProjectState} from './editProjectContext'

export enum EditProjectActionType {
  SET_PROJECT_INFO = 'SET_PROJECT_INFO',
  SET_EDIT_STEP = 'SET_EDIT_STEP',
  SET_LOADING = 'SET_LOADING'
}

export type Action = {
  type: EditProjectActionType,
  payload: any
}

export function editProjectReducer(state: EditProjectState, action: Action) {
  // console.group('editProjectReducer')
  // console.log('state...', state)
  // console.log('action...', action)
  // console.groupEnd()
  switch (action.type) {
    case EditProjectActionType.SET_EDIT_STEP:
      return {
        ...state,
        // default values
        loading: true,
        // new step
        step: action.payload,
      }
    case EditProjectActionType.SET_PROJECT_INFO:
      return {
        ...state,
        project: {
          ...state.project,
          ...action.payload
        }
      }
    case EditProjectActionType.SET_LOADING: {
      return {
        ...state,
        loading: action.payload
      }
    }
    default:
      logger(`editProjectReducer UNKNOWN ACTION TYPE ${action.type}`, 'warn')
      return state
  }
}
