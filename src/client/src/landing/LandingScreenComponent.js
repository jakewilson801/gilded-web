import React, {Component} from 'react';
import OccupationsComponent from '../occupations/OccupationsComponent.js';
import URLUtils from '../util/URLUtils'
import '../occupations/occupations.css'
import {CircularProgress, Paper, Typography} from "material-ui";
import {withStyles} from 'material-ui'
import PropTypes from "prop-types";
import NavigationButton from "../util/NavigationButton";

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    background: theme.palette.background.paper,
    margin: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 8,
    padding: theme.spacing.unit * 2,
  },
});

class LandingScreenComponent extends Component {
  state = {feed: null};

  componentDidMount() {
    fetch(this.getRequestUrl())
      .then(res => res.json())
      .then(data => {
        this.setState({feed: data.occupations});
      });
  }

  getRequestUrl() {
    let t = URLUtils.getParameterByName("tuition");
    let y = URLUtils.getParameterByName("years");
    let s = URLUtils.getParameterByName("salary");
    let request;
    if (t !== null && y !== null && s !== null) {
      request = `/api/v1/feed?tuition=${t}&years=${y}&salary=${s}`;
    } else {
      request = `/api/v1/feed`;
    }
    return request;
  }

  handleFilter = () => {
    window.location.href = '/?search=true';
  };

  render() {
    const {classes} = this.props;
    if (!this.state.feed) {
      return <div className={classes.container}><CircularProgress/></div>;
    } else {
      if (this.state.feed.length > 0) {
        return <OccupationsComponent id={this.props.id} occupations={this.state.feed}/>;
      } else {
        return <Paper className={classes.container}><Typography>No results for given salary, time and
          tuition </Typography><NavigationButton routeUrl={"/?search=true"} routeName={"Filter"} routeCallback={this.handleFilter}/></Paper>;
      }
    }
  }
}

LandingScreenComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LandingScreenComponent);