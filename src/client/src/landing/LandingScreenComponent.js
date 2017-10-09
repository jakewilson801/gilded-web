import React, {Component} from 'react';
import OccupationsComponent from '../occupations/OccupationsComponent.js';
import URLUtils from '../util/URLUtils'
import '../occupations/occupations.css'
import {Link} from 'react-router-dom';

class LandingScreenComponent extends Component {
  state = {feed: null};

  componentDidMount() {
    let t = URLUtils.getParameterByName('tuition');
    let y = URLUtils.getParameterByName('years');
    let s = URLUtils.getParameterByName('salary');

    localStorage.setItem('years', y);
    localStorage.setItem('salary', s);
    localStorage.setItem('tuition', t);

    fetch(`/api/v1/feed?tuition=${t}&years=${y}&salary=${s}`)
      .then(res => res.json())
      .then(feed => {
        let combinedResults = feed.fields.map(f => {
          let occupations = feed.occupations.filter(o => o.field_id === f.soc_major_id);
          return {title: f.title, occupations: occupations};
        }).filter(occ => occ.occupations.length > 0);
        this.setState({feed: combinedResults});
      });
  }

  render() {
    if (!this.state.feed) {
      return <div>Loading...</div>
    } else {
      if(this.state.feed.length > 0) {
        return <div>
          {this.state.feed.map((row, index) => <OccupationsComponent key={index} fieldId={row.id} fieldTitle={row.title}
                                                                     occupations={row.occupations}/>)}
        </div>
      } else {
        return <div style={{margin: '10px'}}>No results for given salary, time and tuition <Link to={"/"}>Try again?</Link></div>
      }
    }
  }
}

export default LandingScreenComponent;