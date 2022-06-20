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
  primary:'#05A2E3',
  secondary:'#000',
  textPrimary:'rgba(34,36,37,1)',
  textSecondary:'rgba(34,36,37,0.87)',
  textDisabled:'rgba(34,36,37,0.45)',
  divider:'#ddd',
  contrastText:'#fff',
  error:'#e53935',
  warning:'#ed6c02',
  info:'#0288d1',
  success:'#2e7d32',
  black:'#000',
  white: '#fff',
  background: '#fff',
  paper: '#fff',
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    A100: '#f5f5f5',
    A200: '#eeeeee',
    // tailwind neutral is A400 in MUI
    A400: '#909090',
    A700: '#616161',
  }
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

const fonts={
  // Note! If you're using custom (local or remote) font faces, those fonts must
  // be loaded within styles/global.css
  default: [
    'Roboto',
    'Helvetica',
    'arial',
    'sans-serif'
  ]
}

const muiTypography={
  // Note! if you change the fonts here ensure you update
  // pages/_document.tsx file to import proper fontFamily
  // Currently we import the fonts from Google Fonts
  // legacy RSD uses these fonts
  fontFamily: fonts.default.join(','),
  // set default fontsize to 1rem for MUI-5
  // fontSize:14,
  fontWeightLight: 100,
  fontWeightRegular: 300,
  fontWeightMedium: 300,
  fontWeightBold: 400,
}

module.exports={
  colors,
  fonts,
  muiTypography
}
