import React, {Component} from 'react';
import OccupationsComponent from '../occupations/OccupationsComponent.js';

class LandingScreenComponent extends Component {
  state = {feed: []};

  componentDidMount() {
    fetch(`/api/v1/feed`)
      .then(res => res.json())
      .then(feed => {
        let combinedResults = feed.fields.map(f => {
          let occupations = feed.occupations.filter(o => o.field_id === f.soc_major_id);
          return {title: f.title, occupations: occupations};
        });
        this.setState({feed: combinedResults});
      });
  }

  render() {
    if (this.state.feed.length > 0) {
      return <div>
        {this.state.feed.map( (row, index) => <OccupationsComponent key={index} fieldId={row.id} fieldTitle={row.title} occupations={row.occupations} />)}
      </div>
    } else {
      return <div>Loading...</div>
    }
  }
}

export default LandingScreenComponent;