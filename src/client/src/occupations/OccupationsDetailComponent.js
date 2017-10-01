/**
 * Created by jakewilson on 7/2/17.
 */

import React, {Component} from 'react';
import './occupations_details.css'
import {Link} from 'react-router-dom';
import YouTube from 'react-youtube'

class OccupationsDetailComponent extends Component {
  state = {
    details: {},
    opts: {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    },
    showProviders: false,
    showEmployers: false,
    socCode: ""
  };

  componentDidMount() {
    fetch(`/api/v1/occupations/${this.props.match.params.id}/details`)
      .then(res => res.json())
      .then(results => {
        results.video_url = new URL(results.video_url).searchParams.get("v");
        this.setState({details: results, socCode: `${results.field_id}-${results.soc_detailed_id}`});
        fetch(`/api/v1/programs?socCode=${this.state.socCode}`)
          .then(res => res.json())
          .then(results => {
            if (results.length > 0)
              this.setState({showProviders: true});
          }).catch(error => console.log(error));

        fetch(`/api/v1/employers?socCode=${this.state.socCode}`)
          .then(res => res.json())
          .then(results => {
            if (results.length > 0)
              this.setState({showEmployers: true});
          }).catch(error => console.log(error));
      });
  }

  render() {
    return <div className="occupation-detail-container">
      <div className="occupation-header">
        <Link to={`/`}><h2
          className="occupation-nav-link">{`< ${this.state.details.title}`}</h2></Link>
        <div className="occupation-option-container">
          {this.state.showProviders ?
            <Link to={`/schools/occupations/${this.state.details.field_id}-${this.state.details.soc_detailed_id}`}
                  className="occupation-provider">
              <div className="occupation-find-providers">Find Providers</div>
            </Link> : null}
          {this.state.showEmployers ?
            <Link to={`/employers/occupations/${this.state.details.field_id}-${this.state.details.soc_detailed_id}`} className="occupation-employer">
              <div className="occupation-find-employers">Find Employers</div>
            </Link> : null}
        </div>
      </div>
      <img className="imageBanner" src={this.state.details.image_avatar_url}/>
      <p className="description">{this.state.details.description}</p>
      <div className="odd-row">
        <div className="meta-label">
          Median Hourly Wage
        </div>
        <div className="meta-value">
          {`$${this.state.details.hourly_median}`}
        </div>
      </div>
      <div className="even-row">
        <div className="meta-label">
          Projected Growth by 2024
        </div>
        <div className="meta-value">
          {`${this.state.details.project_growth_2024}%`}
        </div>
      </div>
      <div className="odd-row">
        <div className="meta-label">
          Average Yearly Salary
        </div>
        <div className="meta-value">
          {`$${this.state.details.annual_mean}`}
        </div>
      </div>
      <br/>
      <div className="occupation-video">
        <YouTube
          videoId={this.state.details.video_url}
          opts={this.state.opts}
          onReady={this._onReady}
        />
      </div>
    </div>
  }
}

export default OccupationsDetailComponent