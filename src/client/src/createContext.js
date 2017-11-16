/* eslint-disable flowtype/require-valid-file-annotation */

import { create, SheetsRegistry } from 'jss';
import preset from 'jss-preset-default';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import blueGrey from 'material-ui/colors/blueGrey';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';

function isWorkingHour(now) {
  return now.getDay() <= 4 && now.getHours() >= 9 && now.getHours() < 17;
}

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    type: isWorkingHour(new Date()) ? 'light' : 'dark',
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