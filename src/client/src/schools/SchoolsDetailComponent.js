/**
 * Created by jakewilson on 7/10/17.
 */
import React, {Component} from 'react';
import SchoolsProgramComponent from './SchoolsProgramComponent'
import {
  Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress,
  withStyles
} from "material-ui";
import PropTypes from 'prop-types';
import withData from "../client/withData";

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
  state = {school: null, programs: null, isAuth: false, isBookmarked: false};

  componentDidMount() {
    this.fetchProgramBookmark();
  }

  fetchProgramBookmark() {
    fetch('/api/v1/user/bookmarks', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('jwt')
      }
    }).then(res => {
        res.json().then(json => {
          if (res.status === 200) {
            this.setState({
              isBookmarked: (json.programs.filter(program => {
                return program.id === parseInt(this.props.match.params.program_id, 10)
              }).length > 0),
              isAuth: true
            });
          } else {
            this.setState({isAuth: false});
          }
        });
      }
    );
  }

  bookmarkProgram(id) {
    this.setState({isBookmarked: !this.state.isBookmarked});
    fetch('/api/v1/user/bookmarks/program', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('jwt')
      },
      body: JSON.stringify({program_id: id})
    }).then(res => res.json());
  }

  isBookmarked() {
    return this.props.programs && this.props.programs.filter(program => {
      return program.id === parseInt(this.props.match.params.program_id, 10)
    }).length > 0;
  }

  render() {
    const {classes} = this.props;
    const school = this.props.school ? this.props.school[0] : null;
    return <div className={classes.container}>
      {school ?
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar src={`/assets/${school.image_avatar_url}`}/>
            }
            title={school.title}
            subheader={`${school.city}, ${school.state_code}`}
          />
          <CardMedia
            className={classes.media}
            image={`/assets/${school.image_background_url}`}
            title={school.title}
          />
          <CardContent><SchoolsProgramComponent program_id={this.props.match.params.program_id}/></CardContent>
          <CardActions>
            <Button dense color="primary"
                    onClick={() => {
                      this.props.isAuth ? this.bookmarkProgram(this.props.match.params.program_id) : this.props.history.push("/user/signup")
                    }}>
              {this.state.isBookmarked && this.props.isAuth ? 'Remove Bookmark' : 'Bookmark'}
            </Button>
          </CardActions>
        </Card>
        : <CircularProgress/>}
      <br/>
    </div>;
  }
}

SchoolsDetailComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styledComponent = withStyles(styles)(SchoolsDetailComponent);

export default withData((props) => {
  return {
    school: `/api/v1/schools/${props.match.params.school_id}`,
    bookmarks: '/api/v1/user/bookmarks',
  };
})(styledComponent);
