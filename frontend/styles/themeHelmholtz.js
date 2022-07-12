// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Colors for both themes
 * Tailwind and MUI-5 based on MUI-5 definitions
 */

const colors = {
  base: {
    // background color for the body - mui: paper and background
    100: '#ffffff',
    // background color variation
    200: '#efefef',
    // background color variation
    300: '#efefef',
  },
  // mui - text.primary
  'base-content':'#002864', // Primary Blue
  // mui - text.disabled
  'base-content-disabled':'rgba(34,36,37,0.45)',
  // mui - primary.main
  primary:'#14c8ff', // Primary Light Blue
  // mui - primary.contrastText
  'primary-content':'#002864', /* Primary Blue */
  // mui - secondary.main
  secondary:'#002864', /* Primary Blue */
  // mui - secondary.contrastText
  'secondary-content':'#05e5ba',
  // mui - not existing in mui
  accent:'#73095d',
  'accent-content':'white',
  // snackbar colors by type
  error:'#e53935',
  'error-content':'black',
  warning:'#fa7833', /* Tertiary Light Orange */
  'warning-content':'black',
  info:'#05e5ba', /* Secondary Mint */
  'info-content':'black',
  success:'#8cd600', /* Tertiary Light Green */
  'success-content':'black',
  // actions for buttons, comboxes etc.
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
    hover: 'rgba(0, 0, 0, 0.04)',
    hoverOpacity: 0.04,
    selected: 'rgba(0, 0, 0, 0.08)',
    selectedOpacity: 0.08,
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    disabledOpacity: 0.38,
    focus: 'rgba(0, 0, 0, 0.12)',
    focusOpacity: 0.12,
    activatedOpacity: 0.12
  },
  // black:'#000',
  // white: '#fff',
  // background: '#fff',
  // paper: '#fff',
  // grey: {
  //   50: '#fafafa',
  //   100: '#f5f5f5',
  //   200: '#eeeeee',
  //   300: '#e0e0e0',
  //   400: '#bdbdbd',
  //   500: '#9e9e9e',
  //   600: '#757575',
  //   700: '#616161',
  //   800: '#424242',
  //   900: '#212121',
  //   A100: '#f5f5f5',
  //   A200: '#eeeeee',
  //   // tailwind neutral is A400 in MUI
  //   A400: '#909090',
  //   A700: '#616161',
  // }
}

/**
 * Breakpoints to use in both themes
 * Note! Tailwind uses string and MUI-5 numeric values
 */
// const breakpoints = {
//   xs: 640,
//   sm: 768,
//   md: 1024,
//   lg: 1280,
//   xl: 1920
// }

module.exports={
  colors
}
