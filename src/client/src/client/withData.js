import React, {Component} from 'react';
import cache from './Cache';
import {CircularProgress} from "material-ui";

const FAILED = Symbol.for('FAILED');
export default function withData(methodMapping) {
  return function (Komponent) {
    class WithDataComponent extends Component {
      constructor(props, ...args) {
        super(props, ...args);
        const mapping = this.getMethodMapping(this.props);
        const keys = Object.keys(mapping);
        this.state = keys.reduce((state, key) => {
          const endPoint = mapping[key];
          if (cache.get(endPoint)) {
            state[key] = cache.get(endPoint);
          }
          return state;
        }, {});
      }

      getMethodMapping(realProps) {
        return methodMapping(realProps);
      }

      componentDidMount() {
        const mapping = this.getMethodMapping(this.props);
        const keys = Object.keys(mapping);
        const newState = keys.reduce((state, key) => {
          const endPoint = mapping[key];
          if (!this.state[endPoint]) {
            state[key] = Symbol.for('LOADING');
            fetch(endPoint, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('jwt')
              }
            })
              .then(res => res.json())
              .then(data => {
                cache.set(endPoint, data);
                this.setState({[key]: data});
              })
              .catch(() => {
                this.setState({[key]: FAILED});
              });
          }
          return state;
        }, {});
        this.setState(newState);
      }

      render() {
        if (Object.keys(this.state).every((d) => this.state[d] !== Symbol.for('LOADING'))) {
          return <Komponent {...this.props} {...this.state}/>;
        } else {
          return <CircularProgress/>;
        }
      }
    }

    return WithDataComponent;
  };
}

