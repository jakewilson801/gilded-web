import React, {Component} from 'react';
import OccupationsComponent from '../occupations/OccupationsComponent';
import OccupationsDetailComponent from '../occupations/OccupationsDetailComponent';
import LandingScreenComponent from '../landing/LandingScreenComponent';
import SchoolsDetailComponent from "../schools/SchoolsDetailComponent";
import EmployersDetailComponent from "../employers/EmployersDetailComponent";
import SchoolsComponent from "../schools/SchoolsComponent";
import MessagesComponent from "../messages/MessagesComponent";
import SignUpComponent from "../signup/SignUpComponent";

import {Route} from 'react-router-dom';
import EmployersComponent from "../employers/EmployersComponent";
import SearchComponent from "../landing/SearchComponent";
import Bookmarks from "../user/BookmarksComponent";
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import withRoot from '../withRoot'

import Drawer from "material-ui/Drawer";
import {withRouter} from 'react-router'
import AppDrawer from "./AppDrawer";
import Filter from "./Filter";
import URLUtils from "../util/URLUtils";

const styles = theme => ({
  root: {
    width: '100%',
  },
  filter: {
    width: '100%',
    background: theme.palette.background.paper,
  },
  filterSlider: {
    width: '100%',
    background: theme.palette.background.paper,
  },
  filterLabelTop: {
    paddingTop: 10,
    justifySelf: 'center',
  },
  filterLabelBottom: {
    justifySelf: 'center',
  },
  filterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    display: 'flex',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  list: {
    width: 200,
  },
  listFull: {
    width: 'auto',
  },
  drawer: {
    maxWidth: 200,
    background: theme.palette.background.paper,
  },
  appBar: {
    position: 'relative',
  },
});

class App extends Component {
  state = {
    left: false,
    isAuth: false,
    open: false,
    years: null,
    salary: null,
    tuition: null,
    shouldOpenDrawer: false,
    occupations: null
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  componentDidMount() {
    if (localStorage.jwt) {
      fetch(`/api/v1/user/me?token=${localStorage.jwt}`)
        .then(d => d.json())
        .then(() => this.setState({isAuth: true}))
        .catch((err) => this.setState({isAuth: false}));
    }
  }

  componentDidUpdate() {
    let didLogin = URLUtils.getParameterByName("hasAuth");
    if (didLogin === "true") {
      this.setState({isAuth: true});
      this.props.history.push("/");
    }
  }

  getTitle() {
    return window.location.href.includes("bookmark") ? "Bookmarks" : "Gilded";
  }

  handleClickOpen = () => {
    this.setState({open: true});
  };


  setShouldOpenDrawer(isTheme) {
    this.setState({left: isTheme});
  }

  render() {
    const {classes, theme} = this.props;
    return (
      <div className={classes.root}>
        <Filter open={this.state.open} handleRequestClose={this.handleRequestClose} classes={classes}
                years={this.state.years}
                tuition={this.state.tuition}
                salary={this.state.salary}
                setAppState={(s) => this.setState(s)}
        />
        <AppBar>
          <Toolbar>
            <IconButton className={classes.menuButton} color="contrast" aria-label="Menu"
                        onClick={this.toggleDrawer('left', true)}>
              <MenuIcon/>
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              {this.getTitle()}
            </Typography>
            {this.state.isAuth ? <Button color="contrast" onClick={this.handleClickOpen}>Filter</Button> :
              <Button color="contrast" onClick={() => this.props.history.push("/user/signup")}>Login</Button>}
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.left} onRequestClose={this.toggleDrawer('left', false)}>
          <div
            tabIndex={0}
            role="button">
            <AppDrawer theme={theme} classes={classes} isAuth={this.state.isAuth}
                       appHistory={this.props.history}
                       setAuth={(t) => this.setState({isAuth: t})}
                       updateTheme={(type) => this.props.updateTheme(type)}
                       setShouldOpenDrawer={(t) => this.setShouldOpenDrawer(t)}/>
          </div>
        </Drawer>
        <div>
          <Route exact path="/" render={(props) => (
            <LandingScreenComponent {...props}
                                    open={() => this.setState({open: true})}
                                    occupations={this.state.occupations}
                                    id={props.location.hash}
            />
          )}/>
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
  theme: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRoot(withRouter(withStyles(styles, {withTheme: true})(App)));

