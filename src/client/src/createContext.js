/* eslint-disable flowtype/require-valid-file-annotation */

import { create, SheetsRegistry } from 'jss';
import preset from 'jss-preset-default';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import blueGrey from 'material-ui/colors/blueGrey';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';

function getTheme(now) {
  let theme = localStorage.theme;
  if (theme) {
    return theme === 'light' ? 'light' : 'dark';
  } else {
    return now.getDay() <= 4 && now.getHours() >= 9 && now.getHours() < 17 ? 'light' : 'dark';
  }
}

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    type: getTheme(new Date()),
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