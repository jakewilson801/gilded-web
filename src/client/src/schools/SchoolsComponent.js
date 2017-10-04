/**
 * Created by jakewilson on 7/10/17.
 */

import React, {Component} from 'react';
import './schools.css'
import {Link} from 'react-router-dom';

class SchoolsComponent extends Component {
  state = {schools: []};

  componentDidMount() {
    fetch(`/api/v1/schools?socCode=${this.props.match.params.id}`)
      .then(res => res.json())
      .then(result => {this.setState({schools: result})})
      .catch(error => console.log("ERRRoR"));
  }

  render() {
    return <div className="school-container">
      <h2 className="school-title">Schools</h2>
      <div className="school-slider">
        <div className="school-card-list">
          {this.state.schools.map(e => <div key={e.id}
                                            className="school-card">
            <img className="school-banner" src={`/assets/${e.image_background_url}`}/>
            <div className="school-card-inner">
              <img className="school-avatar" src={`/assets/${e.image_avatar_url}`}/>
              <div className="school-outer">
                <div className="school-name">{e.title}</div>
                <Link className="school-view-more" to={`/schools/${this.props.match.params.id}/details/${e.id}`}>View More</Link>
              </div>
            </div>
          </div>)}
        </div>
      </div>
    </div>;
  }
}


export default SchoolsComponent