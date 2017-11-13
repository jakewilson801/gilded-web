import React, {Component} from 'react';
import OccupationsComponent from './occupations/OccupationsComponent';
import OccupationsDetailComponent from './occupations/OccupationsDetailComponent';
import LandingScreenComponent from './landing/LandingScreenComponent';
import SchoolsDetailComponent from "./schools/SchoolsDetailComponent";
import EmployersDetailComponent from "./employers/EmployersDetailComponent";
import SchoolsComponent from "./schools/SchoolsComponent";
import MessagesComponent from "./messages/MessagesComponent";
import SignUpComponent from "./signup/SignUpComponent";

import {Route} from 'react-router-dom';
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

import List, {ListItem, ListItemText} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import Logout from './util/Logout';
import DrawerNavigationButton from './util/DrawerNavigationButton';
import NavigationButton from './util/NavigationButton';
import DrawerAvatarNavigationButton from './util/DrawerAvatarNavigationButton';
import Dialog from "material-ui/es/Dialog/Dialog";
import Slide from 'material-ui/transitions/Slide';
import CloseIcon from 'material-ui-icons/Close';
import MobileStepper from 'material-ui/MobileStepper';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';

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
    activeStep: 0,
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

  getTitle() {
    return window.location.href.includes("bookmark") ? "Bookmarks" : "Gilded";
  }

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleRequestClose = () => {
    this.setState({open: false});
  };

  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };


  //TODO https://reacttraining.com/react-router/web/example/auth-workflow
  //https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
  render() {
    const {classes, theme} = this.props;
    const sideBar = (this.state.isAuth ? <List>
        <DrawerAvatarNavigationButton/>
        <DrawerNavigationButton routeUrl={"/user/bookmarks"} routeName={"Bookmarks"}/>
        <ListItem button>
          <ListItemText primary={"Projects"}/>
        </ListItem>
        <Divider/>
        <DrawerNavigationButton routeUrl={"/"} routeName={"Logout"} routeCallback={() => {
          localStorage.clear();
          this.setState({isAuth: false});
        }}/>
      </List> : <DrawerNavigationButton routeName={"Login"} routeUrl={"/user/signup"}/>
    );

    const sideList = (
      <div className={classes.list}>
        {sideBar}
      </div>
    );
    const sortDialog = (<div>
      <Dialog
        fullScreen
        open={this.state.open}
        onRequestClose={this.handleRequestClose}
        transition={(<Slide direction="up"/>)}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
              <CloseIcon/>
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              Filter
            </Typography>
            <Button color="contrast" onClick={this.handleRequestClose}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <MobileStepper
          type="progress"
          steps={4}
          position="static"
          activeStep={this.state.activeStep}
          className={classes.root}
          nextButton={
            <Button dense onClick={this.handleNext} disabled={this.state.activeStep === 5}>
              More
              <KeyboardArrowRight/>
            </Button>
          }
          backButton={
            <Button dense onClick={this.handleBack} disabled={this.state.activeStep === 0}>
              <KeyboardArrowLeft/>
              Less
            </Button>
          }
        />
      </Dialog>
    </div>);
    return (
      <div className={classes.root}>
        {sortDialog}
        <AppBar>
          <Toolbar>
            <IconButton className={classes.menuButton} color="contrast" aria-label="Menu"
                        onClick={this.toggleDrawer('left', true)}>
              <MenuIcon/>
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              {this.getTitle()}
            </Typography>
            {this.state.isAuth ? <Button color={"contrast"} onClick={this.handleClickOpen}>Filter</Button> :
              <NavigationButton routeUrl={"/user/signup"} routeName={"Login"}/>}
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.left} onRequestClose={this.toggleDrawer('left', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {sideList}
          </div>
        </Drawer>
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
  theme: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles, {withTheme: true})(App));

