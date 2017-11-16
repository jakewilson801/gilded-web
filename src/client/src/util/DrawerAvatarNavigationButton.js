import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'

import ListItem from "material-ui/List/ListItem";
import ListItemText from "material-ui/List/ListItemText";
import Avatar from "material-ui/Avatar/Avatar";
import PropTypes from "prop-types";

class DrawerAvatarNavigationButton extends Component {
  render() {
    return <ListItem key={JSON.parse(localStorage.fb_info).id} dense button
                     onClick={() => this.props.history.push("/")}>
      <Avatar alt="Avatar"
              src={`http://graph.facebook.com/v2.10/${JSON.parse(localStorage.fb_info).id}/picture?width=170&height=170`}/>
      <ListItemText primary={`${JSON.parse(localStorage.fb_info).name}`}/>
    </ListItem>
  }
}


DrawerAvatarNavigationButton.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(DrawerAvatarNavigationButton);