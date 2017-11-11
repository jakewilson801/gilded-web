import React, {Component} from 'react';
import OccupationsComponent from './occupations/OccupationsComponent';
import OccupationsDetailComponent from './occupations/OccupationsDetailComponent';
import LandingScreenComponent from './landing/LandingScreenComponent';
import SchoolsDetailComponent from "./schools/SchoolsDetailComponent";
import EmployersDetailComponent from "./employers/EmployersDetailComponent";
import SchoolsComponent from "./schools/SchoolsComponent";
import MessagesComponent from "./messages/MessagesComponent";
import {Route, Link} from 'react-router-dom';
import EmployersComponent from "./employers/EmployersComponent";
import ReactModal from 'react-modal';
import FacebookLogin from './fb_login/facebook';
import SearchComponent from "./landing/SearchComponent";
import MediaQuery from 'react-responsive';
import Bookmarks from "./user/Bookmarks";
import URLUtils from "./util/URLUtils";
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import grey from 'material-ui/colors/grey';

import blue from 'material-ui/colors/blue';
import createContext from './createContext';
import withRoot from './withRoot'
// Apply some reset


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
  FB_DEV = "278110495999806";
  FB_PROD = "124782244806218";
  FB_CURRENT = this.FB_PROD;

  state = {
    showModal: false,
    userData: !!localStorage.getItem("fb_info") ? JSON.parse(localStorage.getItem("fb_info")) : ""
  };

  constructor() {
    super();
    // this.handleOpenModal = this.handleOpenModal.bind(this);
    // this.handleCloseModal = this.handleCloseModal.bind(this);
    // this.responseFacebook = this.responseFacebook.bind(this);
    // this.closeModal = this.closeModal.bind(this);
    // this.logout = this.logout.bind(this);
  }

  handleOpenModal() {
    this.setState({showModal: true});
  }

  handleCloseModal(response) {
    this.setState({showModal: false, userData: response});
  }

  responseFacebook(response) {
    if (response.email) {
      localStorage.setItem("fb_info", JSON.stringify(response));
      fetch('/api/v1/accounts/facebook', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response)
      }).then(r => r.json()).then(d => {
        localStorage.setItem('jwt', d.token);
        this.handleCloseModal(response);
        // window.location.replace("/");
      });

    } else {
      this.setState({showModal: true});
    }
  }

  logout() {
    localStorage.clear();
    window.location.replace("/");
    this.setState({userData: null});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  componentDidMount() {
    let codeParam = URLUtils.getParameterByName("code");
    let stateParam = URLUtils.getParameterByName("state");
    if (codeParam && stateParam) {
      this.setState({showModal: true});
    }
  }

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
              <Button color="contrast">Login</Button>
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
        </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));
