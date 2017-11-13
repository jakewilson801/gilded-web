import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'

import ListItem from "material-ui/es/List/ListItem";
import ListItemText from "material-ui/es/List/ListItemText";
import Avatar from "material-ui/es/Avatar/Avatar";

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
  history: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(DrawerAvatarNavigationButton);