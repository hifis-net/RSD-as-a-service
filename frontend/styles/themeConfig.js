/**
 * Theme configuration
 * It supports loading MUI theme application during the runtime.
 * It requires color and typography configuration. To add theme:
 * 1. Use themeDefault.js as a template and adapt the colors.
 * 2. Add theme enumerator value to RsdThemes types in rsdMuiTheme.ts file
 * 3. Call getThemeConfig with provided enumerator to load theme dynamically
 * 4. Use MUI theme provider to provide the theme to child components.
 * You can use multiple theme providers/overwrite current theme,
 * the last assigned theme is applied to its children.
 */
const defaultTheme = require('./themeDefault')
const darkTheme = require('./themeDark')
const helmholtzTheme = require('./themeHelmholtz')
// example eScience theme loading
// const escienceTheme = require('./themeEscience')

function getThemeConfig(theme) {
  // console.log('themeConfig.getThemeConfig...', theme)
  switch (theme) {
    // example escience theme type
    // case 'escience':
    //   return {
    //     colors: escienceTheme.colors,
    //     muiTypography: escienceTheme.muiTypography
    //   }
    case 'helmholtz':
      return {
        colors: helmholtzTheme.colors,
        fonts: helmholtzTheme.fonts,
        muiTypography: helmholtzTheme.muiTypography
      }
    case 'dark':
      return {
        colors: darkTheme.colors,
        fonts: darkTheme.fonts,
        muiTypography: darkTheme.muiTypography
      }
    default:
      return {
        // TODO: change back
        // colors: defaultTheme.colors,
        // fonts: defaultTheme.fonts,
        // muiTypography: defaultTheme.muiTypography
        colors: helmholtzTheme.colors,
        fonts: helmholtzTheme.fonts,
        muiTypography: helmholtzTheme.muiTypography
      }
  }
}

module.exports={
  ...getThemeConfig(),
  getThemeConfig
}
