
import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom'
import List from "material-ui/List/List";
import ListItem from "material-ui/List/ListItem";
import ListItemText from "material-ui/List/ListItemText";
import Divider from "material-ui/Divider/Divider";

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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(Logout);