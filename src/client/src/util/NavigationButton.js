import React, {Component} from 'react';
import PropTypes from "prop-types";
import {withRouter} from 'react-router-dom'
import Button from "material-ui/Button/Button";

class NavigationButton extends Component {
  render() {
    return <Button color="contrast" onClick={() => {
      if (this.props.routeCallback) {
        this.props.routeCallback();
      }
      this.props.history.push(this.props.routeUrl);
    }}>{this.props.routeName}</Button>
  }
}


NavigationButton.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(NavigationButton)