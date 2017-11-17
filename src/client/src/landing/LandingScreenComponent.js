import React, {Component} from 'react';
import OccupationsComponent from '../occupations/OccupationsComponent.js';
import URLUtils from '../util/URLUtils'
import '../occupations/occupations.css'
import {Link} from 'react-router-dom';
import {CircularProgress, Paper} from "material-ui";

class LandingScreenComponent extends Component {
  state = {feed: null};

  componentDidMount() {
    let t = URLUtils.getParameterByName('tuition');
    let y = URLUtils.getParameterByName('years');
    let s = URLUtils.getParameterByName('salary');
    let request;

    if (t !== 'null' && y !== 'null' && s !== 'null') {
      localStorage.setItem('years', y);
      localStorage.setItem('salary', s);
      localStorage.setItem('tuition', t);
      request = `/api/v1/feed?tuition=${t}&years=${y}&salary=${s}`;
    } else {
      request = `/api/v1/feed`;
    }

    fetch(request)
      .then(res => res.json())
      .then(data => {
        this.setState({feed: data.occupations});
      });
  }

  render() {
    if (!this.state.feed) {
      return <CircularProgress/>;
    } else {
      if (this.state.feed.length > 0) {
        return <OccupationsComponent occupations={this.state.feed}/>;
      } else {
        return <Paper style={{margin: 10}}>No results for given salary, time and tuition <Link to={"/search"}>Try
          again?</Link></Paper>;
      }
    }
  }
}

export default LandingScreenComponent;