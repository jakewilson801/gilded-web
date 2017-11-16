import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom'

import ListItem from "material-ui/List/ListItem";
import ListItemText from "material-ui/List/ListItemText";

class DrawerNavigationButton extends Component {
  render() {
    return <ListItem button component="a" onClick={() => {
      if (this.props.routeCallback) {
        this.props.routeCallback();
      }

      this.props.history.push(this.props.routeUrl)
    }}>
      <ListItemText primary={this.props.routeName}/>
    </ListItem>
  }
}


DrawerNavigationButton.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(DrawerNavigationButton);