import React, {Component} from 'react';
import URLUtils from "../util/URLUtils";
import FacebookLogin from '../fb_login/facebook';
import {withStyles} from 'material-ui/styles';
import PropTypes from 'prop-types';
import {CircularProgress} from 'material-ui/Progress';

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    background: theme.palette.background.default,
    marginTop: theme.spacing.unit * 10,
  }
});

class SignUpComponent extends React.Component {
  FB_DEV = "278110495999806";
  FB_PROD = "124782244806218";
  FB_CURRENT = this.FB_DEV;

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
        window.location.replace("/");
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
      {this.state.loading ? <CircularProgress/> : <FacebookLogin
        appId={this.FB_CURRENT}
        reRequest={true}
        onClick={() => this.setState({loading: true})}
        fields="name,email,picture"
        scope="public_profile,user_friends,email"
        callback={this.responseFacebook}
        redirectUri={`${window.location.origin}/user/signup`}
      />}
    </div>
  }
}

SignUpComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(SignUpComponent);