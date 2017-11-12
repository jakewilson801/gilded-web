import React from 'react';
import {withRouter} from 'react-router-dom'
import List from "material-ui/es/List/List";
import ListItem from "material-ui/es/List/ListItem";
import ListItemText from "material-ui/es/List/ListItemText";
import Divider from "material-ui/es/Divider/Divider";

const Logout = ({history}) => (
  <List>
    <ListItem button onClick={() => {
      history.push('/user/signup');
    }}>
      <ListItemText primary={"Login"}/>
    </ListItem>
    <Divider/>
  </List>);


Logout.propTypes = {
  history: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(Logout);