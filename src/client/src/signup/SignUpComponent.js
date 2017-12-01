import React from 'react';
import URLUtils from "../util/URLUtils";
import FacebookLogin from '../fb_login/facebook';
import {Paper, Typography, withStyles} from 'material-ui';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/Progress/CircularProgress';

const styles = theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    background: theme.palette.background.default,
    marginTop: theme.spacing.unit * 10,
  },
  signUp: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    justifyContent: 'center',
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
        <Paper className={classes.signUp}>
          <Typography type="headline" component="h3" elevation={4}>
            Welcome to Gilded!
          </Typography>
          <Typography type="body1" component="p" style={{padding: 5}}>
            Gilded is used to develop your career and find new opportunities
          </Typography>
          <FacebookLogin
            appId={this.FB_CURRENT}
            reRequest={true}
            onClick={() => this.setState({loading: true})}
            fields="name,email,picture"
            scope="public_profile,user_friends,email"
            callback={this.responseFacebook}
            redirectUri={`${window.location.origin}/user/signup`}
          /></Paper>}
    </div>
  }
}

SignUpComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(SignUpComponent);