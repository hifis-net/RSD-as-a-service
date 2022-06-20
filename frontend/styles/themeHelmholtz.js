/**
 * Colors for both themes
 * Tailwind and MUI-5 based on MUI-5 definitions
 */

const colors = {
  primary:'#14c8ff', /* Primary Light Blue */
  secondary:'#002864', /* Primary Blue */
  textPrimary:'#002864', /* Primary Blue */
  textSecondary:'#14c8ff', /* Primary Light Blue */
  textDisabled:'rgba(34,36,37,0.45)',
  divider:'#cdeefb', /* Secondary Highlight Blue */
  contrastText:'#05e5ba', /* Secondary Mint */
  error:'#e53935',
  warning:'#fa7833', /* Tertiary Light Orange */
  info:'#cdeefb', /* Secondary Highlight Blue */
  success:'#8cd600', /* Tertiary Light Green */
  black:'#000',
  white: '#fff',
  background: '#fff',
  paper: '#fff',
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#ecfbfd', /* Secondary Web Pale Blue */
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
    'Helmholtz Halvar Mittel Rg',
    'Helvetica',
    'arial',
    'sans-serif'
  ]
}

const muiTypography={
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
