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
import Bookmarks from "./user/BookmarksComponent";
import PropTypes from 'prop-types';
import {ListItem, ListItemText, withStyles} from 'material-ui';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import withRoot from './withRoot'

import List from 'material-ui/List';

import Divider from 'material-ui/Divider';
import Logout from './util/Logout';
import DrawerNavigationButton from './util/DrawerNavigationButton';
import NavigationButton from './util/NavigationButton';
import DrawerAvatarNavigationButton from './util/DrawerAvatarNavigationButton';
import Dialog from "material-ui/Dialog";
import Slide from 'material-ui/transitions/Slide';
import CloseIcon from 'material-ui-icons/Close';
import MobileStepper from 'material-ui/MobileStepper';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import Drawer from "material-ui/Drawer";
import URLUtils from "./util/URLUtils";
import {withRouter} from 'react-router'
import createContext from "./createContext";

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

function Transition(props) {
  return <Slide direction="up" {...props} />;
}


class App extends Component {
  state = {
    left: false,
    isAuth: false,
    open: false,
    years: parseFloat(localStorage.getItem('years')) || 0,
    salary: parseInt((localStorage.getItem('salary')) / 10000) || 0,
    tuition: parseInt((localStorage.getItem('tuition') / 5000)) || 0,
    shouldFilter: false,
    shouldOpenDrawer: false,
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

    if (URLUtils.getParameterByName("search") === 'true') {
      this.setState({open: true});
    }
  }

  getTitle() {
    return window.location.href.includes("bookmark") ? "Bookmarks" : "Gilded";
  }

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleRequestClose = () => {
    this.saveValues();
    this.setState({open: false});
    window.location.href = `/?years=${this.state.years}&salary=${this.state.salary * 10000}&tuition=${this.state.tuition * 5000}`;
  };

  saveValues = () => {
    localStorage.setItem('years', this.state.years);
    localStorage.setItem('salary', this.state.salary * 10000);
    localStorage.setItem('tuition', this.state.tuition * 5000);
  }

  componentDidUpdate(nextProps, nextState) {
    this.saveValues();
  }

  handleNextYears = () => {
    this.setState({
      years: this.state.years + 1,
    });
  };

  handleBackYears = () => {
    this.setState({
      years: this.state.years - 1,
    });
  };

  handleNextSalary = () => {
    this.setState({
      salary: this.state.salary + 1,
    });
  };

  handleBackSalary = () => {
    this.setState({
      salary: this.state.salary - 1,
    });
  };

  handleNextTuition = () => {
    this.setState({
      tuition: this.state.tuition + 1,
    });
  };

  handleBackTuition = () => {
    this.setState({
      tuition: this.state.tuition - 1,
    });
  };

  getSalary(salary) {
    return (salary * 10000).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })
  }

  getTuition(tuition) {
    return (tuition * 5000).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })
  }

  setShouldOpenDrawer(isTheme) {
    this.setState({left:isTheme});
  }

  //TODO https://reacttraining.com/react-router/web/example/auth-workflow
  //https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
  render() {
    const {classes, theme} = this.props;
    // (currentTheme.palette.type === 'light' ? "Day" : "Night")
    const sideBar = (this.state.isAuth ? <List>
        <DrawerAvatarNavigationButton/>
        <DrawerNavigationButton routeUrl={"/user/bookmarks"} routeName={"Bookmarks"}
                                routeCallback={() => this.setShouldOpenDrawer(false)}/>
        <Divider/>
        <ListItem button component="a" primary={(theme.palette.type === 'light' ? "Day" : "Night")}
                  onClick={() => {
                    this.setShouldOpenDrawer(true);
                    let type = (theme.palette.type === 'light' ? "dark" : "light");
                    localStorage.setItem("theme", type);
                    this.props.updateTheme(type);
                  }}><ListItemText primary={theme.palette.type === 'light' ? "Day" : "Night"}/></ListItem>
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
        transition={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
              <CloseIcon/>
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              Filter
            </Typography>
            <NavigationButton color="contrast" routeName={"Save"} routeCallback={this.handleRequestClose}
                              routeUrl={`/?years=${this.state.years}&salary=${this.state.salary * 10000}&tuition=${this.state.tuition * 5000}`}/>
          </Toolbar>
        </AppBar>
        <div className={classes.filterContainer}>
          <Typography className={classes.filterLabelTop}>Years of School</Typography>
          <MobileStepper
            type="progress"
            steps={4}
            position="static"
            activeStep={this.state.years}
            className={classes.filterSlider}
            nextButton={
              <Button dense onClick={this.handleNextYears} disabled={this.state.years === 4}>
                More
                <KeyboardArrowRight/>
              </Button>
            }
            backButton={
              <Button dense onClick={this.handleBackYears} disabled={this.state.years === 0}>
                <KeyboardArrowLeft/>
                Less
              </Button>
            }
          />
          <Typography type="display1" className={classes.filterLabelBottom}>{this.state.years}</Typography>
        </div>
        <Divider style={{marginTop: 10}}/>
        <div className={classes.filterContainer}>
          <Typography className={classes.filterLabelTop}>Minimum Salary</Typography>
          <MobileStepper
            type="progress"
            steps={10}
            position="static"
            activeStep={this.state.salary}
            className={classes.filterSlider}
            nextButton={
              <Button dense onClick={this.handleNextSalary} disabled={this.state.salary === 10}>
                More
                <KeyboardArrowRight/>
              </Button>
            }
            backButton={
              <Button dense onClick={this.handleBackSalary} disabled={this.state.salary === 0}>
                <KeyboardArrowLeft/>
                Less
              </Button>
            }
          />
          <Typography type="display1"
                      className={classes.filterLabelBottom}>{this.getSalary(this.state.salary)}</Typography>

        </div>
        <Divider style={{marginTop: 10}}/>
        <div className={classes.filterContainer}>
          <Typography className={classes.filterLabelTop}>Tuition</Typography>
          <MobileStepper
            type="progress"
            steps={5}
            position="static"
            activeStep={this.state.tuition}
            className={classes.filterSlider}
            nextButton={
              <Button dense onClick={this.handleNextTuition} disabled={this.state.tuition === 5}>
                More
                <KeyboardArrowRight/>
              </Button>
            }
            backButton={
              <Button dense onClick={this.handleBackTuition} disabled={this.state.tuition === 0}>
                <KeyboardArrowLeft/>
                Less
              </Button>
            }
          />
          <Typography type="display1"
                      className={classes.filterLabelBottom}>{this.getTuition(this.state.tuition)}</Typography>
        </div>
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
            role="button">
            {sideList}
          </div>
        </Drawer>
        <div>
          <Route exact path="/" render={(props) => (
            <LandingScreenComponent {...props} id={props.location.hash}/>
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

