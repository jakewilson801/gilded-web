/**
 * Created by jakewilson on 7/10/17.
 */
import React, {Component} from 'react';
import SchoolsProgramComponent from './SchoolsProgramComponent'
import {Avatar, Card, CardHeader, CardMedia, CircularProgress, Typography, withStyles} from "material-ui";
import PropTypes from 'prop-types';

const styles = theme => ({
    container: {
      display: 'flex',
      justifyContent: 'center',
      background: theme.palette.background.default,
      padding: theme.spacing.unit * 2,
    },
    card: {

      marginTop: theme.spacing.unit * 7,
      maxWidth: 600,
    },
    media: {
      height: 194,
    },
  }
);

class SchoolsDetailComponent extends Component {
  state = {school: null, programs: null};

  componentDidMount() {
    fetch(`/api/v1/schools/${this.props.match.params.id}/details/${this.props.match.params.school_id}`)
      .then(res => res.json())
      .then(sch => this.setState({school: sch}));
  }

  render() {
    const {classes} = this.props;
    return <div className={classes.container}>
      {this.state.school ?
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar src={`/assets/${this.state.school.image_avatar_url}`}/>
            }
            title={this.state.school.title}
            subheader="September 14, 2016"
          />
          <CardMedia
            className={classes.media}
            image={`/assets/${this.state.school.image_background_url}`}
            title={this.state.school.title}
          />
          {/*<Typography type="display1">{this.state.school.title}</Typography>*/}

          {/*<div className="schools-address">*/}
          {/*<div>{this.state.school.address}</div>*/}
          {/*<div>{this.state.school.city + ", " + this.state.school.state_code}</div>*/}
          {/*<div>{this.state.school.zipcode}</div>*/}
          {/*</div>*/}


          {/*<h2>About</h2>*/}
          {/*<h3>Find your next career in today!</h3>*/}
          {/*{this.state.school.phone}*/}
          {/*<br/>*/}
          {/*{this.state.school.website_url}*/}
          <SchoolsProgramComponent soc_id={this.props.match.params.id} school_id={this.props.match.params.school_id}/>
        </Card>
        : <CircularProgress/>}
      <br/>
    </div>;
  }
}

SchoolsDetailComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SchoolsDetailComponent);
