/* eslint-disable flowtype/require-valid-file-annotation */

import {create, SheetsRegistry} from 'jss';
import preset from 'jss-preset-default';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import blueGrey from 'material-ui/colors/blueGrey';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';

function createTheme(theme) {
  return createMuiTheme({
    palette: {
      primary: blueGrey,
      type: theme === 'light' ? 'light' : 'dark'
    },
  });
}

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    type: localStorage.theme === 'light' ? 'light': 'dark',
  },
});

// Configure JSS
const jss = create(preset());
jss.options.createGenerateClassName = createGenerateClassName;

export const sheetsManager = new Map();

export default function createContext() {
  return {
    jss,
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager,
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
  };
}

export function createContextWithTheme(type) {
  let theme = createTheme(type);
  return {
    jss,
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager,
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
  };
}
