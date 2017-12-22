import React, {Component} from 'react';
import {CircularProgress, Typography, withStyles} from "material-ui";
import PropTypes from 'prop-types';
import withData from '../client/withData';

const styles = theme => ({
  container: {
    // display: 'flex',
    // justifyContent: 'start',
    background: theme.palette.background.paper
    // background: theme.palette.background.default,
  },
  programs: {
    margin: theme.spacing.unit * 7,
    padding: theme.spacing.unit * 3,
  }
});

class SchoolsProgramComponent extends Component {
  render() {
    if (this.props.programs) {
      return this.props.programs.map(p =>
        <div key={this.props.programs.indexOf(p)}>
          <Typography type={"display1"}>{p.title}</Typography>
          <Typography>Cost: ${parseInt(p.cost_in_state, 10)}</Typography>
          <Typography>Length: {p.length_months} Months</Typography>
          <Typography>Schedule: {p.flexible_schedule ? "Flexible/Competency Based" : "Semester Based"}</Typography>
          <Typography>Credential: {p.credential}</Typography>
        </div>);
    } else {
      return <CircularProgress/>;
    }
  }
}


SchoolsProgramComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

const styledComponent = withStyles(styles)(SchoolsProgramComponent);

export default withData((props) => ({
  programs: `/api/v1/programs/${props.program_id}`
}))(styledComponent);

