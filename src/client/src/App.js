import React, {Component} from 'react';
import OccupationsComponent from './occupations/OccupationsComponent';
import OccupationsDetailComponent from './occupations/OccupationsDetailComponent';
import LandingScreenComponent from './landing/LandingScreenComponent';
import SchoolsDetailComponent from "./schools/SchoolsDetailComponent";
import EmployersDetailComponent from "./employers/EmployersDetailComponent";
import SchoolsComponent from "./schools/SchoolsComponent";
import MessagesComponent from "./messages/MessagesComponent";
import SignUpComponent from "./signup/SignUpComponent";

import {Route, Link} from 'react-router-dom';
import EmployersComponent from "./employers/EmployersComponent";
import SearchComponent from "./landing/SearchComponent";
import Bookmarks from "./user/Bookmarks";
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import withRoot from './withRoot'
import Avatar from 'material-ui/Avatar';

const styles = theme => ({
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class App extends Component {
  //TODO https://reacttraining.com/react-router/web/example/auth-workflow
  //https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <AppBar>
          <Toolbar>
            <IconButton className={classes.menuButton} color="contrast" aria-label="Menu">
              <MenuIcon/>
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              Gilded
            </Typography>
            {localStorage.fb_info !== undefined ? <Avatar
                src={`http://graph.facebook.com/v2.10/${JSON.parse(localStorage.fb_info).id}/picture?width=170&height=170`}/> :
              <Link to={"/user/signup"}><Button color="contrast">Login</Button></Link>}
          </Toolbar>
        </AppBar>
        <div>
          <Route exact path="/" component={LandingScreenComponent}/>
        </div>
        <div>
          <Route exact path="/search" component={SearchComponent}/>
        </div>
        <div>
          <Route exact path="/occupations/:id" component={OccupationsComponent}/>
        </div>
        <div>
          <Route exact path="/occupations/:id/details" component={OccupationsDetailComponent}/>
        </div>
        <div>
          <Route exact path="/schools/:id/details/:school_id" component={SchoolsDetailComponent}/>
        </div>
        <div>
          <Route exact path="/employers/:id/details" component={EmployersDetailComponent}/>
        </div>
        <div>
          <Route exact path="/employers/occupations/:id" component={EmployersComponent}/>
        </div>
        <div>
          <Route exact path="/schools/occupations/:id" component={SchoolsComponent}/>
        </div>
        <div>
          <Route exact path="/messages" component={MessagesComponent}/>
        </div>
        <div>
          <Route exact path="/messages/:id" component={MessagesComponent}/>
        </div>
        <div>
          <Route exact path="/messages/:id" component={MessagesComponent}/>
        </div>
        <div>
          <Route exact path="/user/bookmarks" component={Bookmarks}/>
        </div>
        <div>
          <Route exact path="/user/signup" component={SignUpComponent}/>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));
