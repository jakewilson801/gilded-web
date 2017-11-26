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
import DrawerNavigationButton from './util/DrawerNavigationButton';
import Avatar from "material-ui/Avatar/Avatar";
import Dialog from "material-ui/Dialog";
import Slide from 'material-ui/transitions/Slide';
import CloseIcon from 'material-ui-icons/Close';
import MobileStepper from 'material-ui/MobileStepper';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import Drawer from "material-ui/Drawer";
import {withRouter} from 'react-router'

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
    this.getOccupations();
  }

  getTitle() {
    return window.location.href.includes("bookmark") ? "Bookmarks" : "Gilded";
  }

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleRequestClose = () => {
    this.getOccupations();
    this.setState({open: false});
  };

  handleRequestCancel = () => {
    this.setState({open: false});
  };

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
    this.setState({left: isTheme});
  }

  getOccupations() {
    fetch(this.getRequestUrl())
      .then(res => res.json())
      .then(data => {
        this.setState({occupations: data.occupations});
      });
  }

  getRequestUrl() {
    let y = this.state.years;
    let s = this.state.salary * 10000;
    let t = this.state.tuition * 5000;
    let request;
    if (t || y || s) {
      request = `/api/v1/feed?tuition=${t}&years=${y}&salary=${s}`;
    } else {
      request = `/api/v1/feed`;
    }
    return request;
  }

  render() {
    const {classes, theme} = this.props;
    const sideBar = (this.state.isAuth ? <List>
        <ListItem key={JSON.parse(localStorage.fb_info).id} dense button
                  onClick={() => {
                    this.setShouldOpenDrawer(false)
                    this.props.history.push("/")
                  }}>
          <Avatar alt="Avatar"
                  src={`http://graph.facebook.com/v2.10/${JSON.parse(localStorage.fb_info).id}/picture?width=170&height=170`}/>
          <ListItemText primary={`${JSON.parse(localStorage.fb_info).name}`}/>
        </ListItem>
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
          this.setShouldOpenDrawer(false);
          localStorage.clear();
          this.setState({isAuth: false});
        }}/>

      </List> : <DrawerNavigationButton routeName={"Login"} routeUrl={"/user/signup"}
                                        routeCallback={() => this.setShouldOpenDrawer(false)}/>
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
            <IconButton color="contrast" onClick={this.handleRequestCancel} aria-label="Close">
              <CloseIcon/>
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              Filter
            </Typography>
            <Button type="title" color="inherit" onClick={this.handleRequestClose}>Save</Button>
          </Toolbar>
        </AppBar>
        <div className={classes.filterContainer}>
          <Typography className={classes.filterLabelTop}>Years of School</Typography>
          <MobileStepper
            type="progress"
            steps={4}
            position="static"
            activeStep={this.state.years || 0}
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
          <Typography type="display1" className={classes.filterLabelBottom}>{this.state.years || 0}</Typography>
        </div>
        <Divider style={{marginTop: 10}}/>
        <div className={classes.filterContainer}>
          <Typography className={classes.filterLabelTop}>Minimum Salary</Typography>
          <MobileStepper
            type="progress"
            steps={10}
            position="static"
            activeStep={this.state.salary || 0}
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
            activeStep={this.state.tuition || 0}
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
            {this.state.isAuth ? <Button color="contrast" onClick={this.handleClickOpen}>Filter</Button> :
              <Button color="contrast" onClick={() => this.props.history.push("/user/signup")}>Login</Button>}
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

