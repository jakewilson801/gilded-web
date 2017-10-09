/**
 * Created by jakewilson on 7/10/17.
 */
import React, {Component} from 'react';
import './schools_detail.css'
import SchoolsProgramComponent from './SchoolsProgramComponent'

class SchoolsDetailComponent extends Component {
  state = {school: null, programs: null};

  componentDidMount() {
    fetch(`/api/v1/schools/${this.props.match.params.id}/details/${this.props.match.params.school_id}`)
      .then(res => res.json())
      .then(sch => this.setState({school: sch}));
  }

  render() {
    return <div>
      {this.state.school ?
        <div>
          <div className="schools-detail-container">
            <div className="schools-detail-banner-holder">
              <img className="schools-detail-banner" src={`/assets/${this.state.school.image_background_url}`}/>
              <div className="schools-name">{this.state.school.title}</div>
              <img className="schools-detail-avatar" src={`/assets/${this.state.school.image_avatar_url}`}/>
            </div>
            <div className="schools-header-container">
              <div className="schools-address">
                <div>{this.state.school.address}</div>
                <div>{this.state.school.city + ", " + this.state.school.state_code}</div>
                <div>{this.state.school.zipcode}</div>
              </div>
            </div>
          </div>
          <div className="schools-about">

            <h2>About</h2>
            <h3>Find your next career in today!</h3>
            {this.state.school.phone}
            <br/>
            {this.state.school.website_url}
            <SchoolsProgramComponent soc_id={this.props.match.params.id} school_id={this.props.match.params.school_id}/>
          </div>
        </div>
        : <div>Loading...</div>}
        <br/>
    </div>;
  }
}

export default SchoolsDetailComponent
