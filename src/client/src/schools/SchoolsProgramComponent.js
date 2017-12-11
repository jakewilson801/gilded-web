import React, {Component} from 'react';
import {CircularProgress, Typography, withStyles} from "material-ui";
import PropTypes from 'prop-types';

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
  state = {programs: []};

  componentDidMount() {
    fetch(`/api/v1/programs/${this.props.program_id}`)
      .then(res => res.json())
      .then(programs => {
        this.setState({programs})
      });
  }

  render() {
    if (this.state.programs) {
      return this.state.programs.map(p =>
        <div key={this.state.programs.indexOf(p)}>
          <Typography type={"display1"}>{p.title}</Typography>
          <Typography>Cost: ${parseInt(p.cost_in_state, 10)}</Typography>
          <Typography>Length: {p.length_months} Months</Typography>
          <Typography>{p.flexible_schedule ? "Flexible/Competency Based" : "Semester Based"}</Typography>
          <Typography>Credential {p.credential}</Typography>
        </div>);
    } else {
      return <CircularProgress/>;
    }
  }
}


SchoolsProgramComponent.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(SchoolsProgramComponent);

