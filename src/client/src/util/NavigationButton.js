import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import Button from "material-ui/es/Button/Button";

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
  history: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(NavigationButton)