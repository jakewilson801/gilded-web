import React from 'react';
import URLUtils from "../util/URLUtils";
import FacebookLogin from '../fb_login/facebook';
import {Paper, Typography, withStyles} from 'material-ui';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import SwipeableViews from 'react-swipeable-views';

const styles = theme => ({
  container: {
    //margin: 5,
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'column',
    background: theme.palette.background.default,
    marginTop: theme.spacing.unit * 10,
  },
  signUp: {
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
    padding: 10,
    margin: 5,
    // justifyContent: 'center',
  },

});

class SignUpComponent extends React.Component {
  FB_DEV = "278110495999806";
  FB_PROD = "124782244806218";
  FB_CURRENT = window.location.origin.includes("localhost") ? this.FB_DEV : this.FB_PROD;

  state = {
    loading: false
  };

  responseFacebook(response) {
    if (response.email) {
      localStorage.setItem("fb_info", JSON.stringify(response));
      fetch('/api/v1/accounts/facebook', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response)
      }).then(r => r.json()).then(d => {
        localStorage.setItem('jwt', d.token);
        this.props.history.push("/?hasAuth=true");
      });
    } else {
      this.setState({loading: false});
    }
  }

  componentDidMount() {
    let codeParam = URLUtils.getParameterByName("code");
    let stateParam = URLUtils.getParameterByName("state");
    if (codeParam && stateParam) {
      this.setState({loading: true});
    }
  }

  constructor() {
    super();
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  render() {
    const {classes} = this.props;
    return <div className={classes.container}>
      {this.state.loading ? <CircularProgress/> :
        <SwipeableViews>
          <div>
            <Paper className={classes.signUp}>
              <Typography type="headline" component="h3" elevation={4}>
                Welcome to Neek!
              </Typography>
              <FacebookLogin
                appId={this.FB_CURRENT}
                reRequest={true}
                onClick={() => this.setState({loading: true})}
                fields="name,email,picture"
                scope="public_profile,user_friends,email"
                callback={this.responseFacebook}
                redirectUri={`${window.location.origin}/user/signup`}
              /></Paper>
          </div>
          <div>
            <Paper className={classes.signUp}>
              <Typography type="headline" component="h3" elevation={4}>
                Credentials
              </Typography>
              <Typography type="body1" component="p" style={{padding: 5}}>
                Input your credentials if applicable
              </Typography>
            </Paper>
          </div>
          <div>
            <Paper className={classes.signUp}>
              <Typography type="headline" component="h3" elevation={4}>
                Industry Certifications
              </Typography>
              <Typography type="body1" component="p" style={{padding: 5}}>
                Input your certifications
              </Typography>
            </Paper>
          </div>
          <div>
            <Paper className={classes.signUp}>
              <Typography type="headline" component="h3" elevation={4}>
                Skills
              </Typography>
              <Typography type="body1" component="p" style={{padding: 5}}>
                Input your skills
              </Typography>
            </Paper>
          </div>
          <div>
            <Paper className={classes.signUp}>
              <Typography type="headline" component="h3" elevation={4}>
                Projects
              </Typography>
              <Typography type="body1" component="p" style={{padding: 5}}>
                Input your projects
              </Typography>
            </Paper>
          </div>
        </SwipeableViews>}
    </div>
  }
}

SignUpComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(SignUpComponent);