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
    fetch(`/api/v1/schools/${this.props.match.params.school_id}`)
      .then(res => res.json())
      .then(sch => this.setState({school: sch[0]}));
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
              }).length > 0), isAuth: true
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
            subheader={`${this.state.school.city}, ${this.state.school.state_code}`}
          />
          <CardMedia
            className={classes.media}
            image={`/assets/${this.state.school.image_background_url}`}
            title={this.state.school.title}
          />
          <CardContent><SchoolsProgramComponent program_id={this.props.match.params.program_id}/></CardContent>
          <CardActions>
            <Button dense color="primary"
                    onClick={() => this.state.isAuth ? this.bookmarkProgram(this.props.match.params.program_id) : this.props.history.push("/user/signup")}>
              {this.state.isBookmarked && this.state.isAuth ? 'Remove Bookmark' : 'Bookmark'}
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

export default withStyles(styles)(SchoolsDetailComponent);
