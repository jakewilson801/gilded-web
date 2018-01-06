import React, {Component} from 'react';
import OccupationsComponent from '../occupations/OccupationsComponent.js';
import '../occupations/occupations.css'
import {Button, CircularProgress, Paper, Typography, withStyles} from "material-ui";
import PropTypes from "prop-types";

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
  handleFilter = () => {
    this.props.open();
  };

  render() {
    const {classes} = this.props;
    if (!this.props.occupations) {
      return <div className={classes.container}><CircularProgress/></div>;
    } else {
      if (this.props.occupations.length > 0) {
        return <OccupationsComponent id={this.props.id} occupations={this.props.occupations}/>;
      } else {
        return <Paper className={classes.container}><Typography>No results for given salary, time and
          tuition </Typography><Button onClick={this.handleFilter}>Filter</Button></Paper>;
      }
    }
  }
}

LandingScreenComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LandingScreenComponent);