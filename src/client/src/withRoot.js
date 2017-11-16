/* eslint-disable flowtype/require-valid-file-annotation */

import React, {Component} from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import wrapDisplayName from 'recompose/wrapDisplayName';
import createContext from './createContext';
import {withStyles} from "material-ui";

// Apply some reset
const styles = theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },
    body: {
      margin: 0,
    },
  },
});

let AppWrapper = props => props.children;
//
AppWrapper = withStyles(styles)(AppWrapper);

const context = createContext();

function withRoot(App) {
  class WithRoot extends Component {
    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return (
        <JssProvider registry={context.sheetsRegistry} jss={context.jss}>
          <MuiThemeProvider theme={context.theme} sheetsManager={context.sheetsManager}>
            <AppWrapper>
              <App />
            </AppWrapper>
          </MuiThemeProvider>
        </JssProvider>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    WithRoot.displayName = wrapDisplayName(App, 'withRoot');
  }

  return WithRoot;
}

export default withRoot;
