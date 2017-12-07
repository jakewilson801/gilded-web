import React, {Component} from 'react';
import {CircularProgress, Paper, Typography, withStyles} from "material-ui";
import {GridList, GridListTile, GridListTileBar} from 'material-ui/GridList';
import PropTypes from 'prop-types';

const styles = theme => ({
  container: {
    // display: 'flex',
    // justifyContent: 'start',
    background: theme.palette.background.default,
  },
  programs: {
    margin: theme.spacing.unit * 7,
    padding: theme.spacing.unit * 3,
  }
});

class SchoolsProgramComponent extends Component {
  state = {programs: []};

  componentDidMount() {
    fetch(`/api/v1/programs/${this.props.soc_id}/${this.props.school_id}`)
      .then(res => res.json())
      .then(programs => {
        this.setState({programs})
      });
  }

  render() {
    const {classes} = this.props;
    if (this.state.programs) {
      let programs = this.state.programs.map(p =>
        <GridListTile className={classes.programs} key={this.state.programs.indexOf(p)}>
          <Typography>{p.title}</Typography>
          <Typography>Cost: ${parseInt(p.cost_in_state, 10)}</Typography>
          <Typography>Length: {p.length_months} Months</Typography>
          <Typography>{p.flexible_schedule ? "Flexible/Competency Based" : "Semester Based"}</Typography>
          <Typography>Credential {p.credential}</Typography>
        </GridListTile>);
      return <GridList className={classes.container}>{programs}</GridList>;
    } else {
      return <CircularProgress/>;
    }
  }
}


SchoolsProgramComponent.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(SchoolsProgramComponent);

