/**
 * Created by jakewilson on 7/2/17.
 */

import React, {Component} from 'react';
import './occupations_details.css';
import {Link} from 'react-router-dom';
import YouTube from 'react-youtube';
import MediaQuery from 'react-responsive';

class OccupationsDetailComponent extends Component {
  desktopVideo = {
    height: '390',
    width: '640',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 0
    }
  };

  mobileVideo = {
    height: '200',
    width: '300',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 0
    }
  };

  state = {
    details: null,
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
    return <div>
      {this.state.details ?
        <div className="occupation-detail-container">
          <div className="occupation-header">
            <Link
              to={`/feed?years=${localStorage.getItem('years')}&salary=${localStorage.getItem('salary')}&tuition=${localStorage.getItem('tuition')}`}>
              <MediaQuery minWidth={1224}>
                <h2
                  className="occupation-nav-link">{`< ${this.state.details.title}`}</h2>
              </MediaQuery>
              <MediaQuery maxWidth={1224}>
                <h2
                  className="occupation-nav-link">{`< Back`}</h2>
              </MediaQuery>
            </Link>

            <div className="occupation-option-container">
              <MediaQuery maxWidth={1224}>
                {this.state.showProviders ?
                  <Link to={`/schools/occupations/${this.state.details.field_id}-${this.state.details.soc_detailed_id}`}
                        className="occupation-provider-mobile">
                    <div className="occupation-find-providers-mobile">Schools</div>
                  </Link> : null}
              </MediaQuery>
              <MediaQuery minWidth={1224}>
                {this.state.showProviders ?
                  <Link to={`/schools/occupations/${this.state.details.field_id}-${this.state.details.soc_detailed_id}`}
                        className="occupation-provider">
                    <div className="occupation-find-providers">Find Schools</div>
                  </Link> : null}
              </MediaQuery>
              <MediaQuery maxWidth={1224}>
                {this.state.showEmployers ?
                  <Link
                    to={`/employers/occupations/${this.state.details.field_id}-${this.state.details.soc_detailed_id}`}
                    className="occupation-employer-mobile">
                    <div className="occupation-find-employers-mobile">Employers</div>
                  </Link> : null}
              </MediaQuery>
              <MediaQuery minWidth={1224}>
                {this.state.showEmployers ?
                  <Link
                    to={`/employers/occupations/${this.state.details.field_id}-${this.state.details.soc_detailed_id}`}
                    className="occupation-employer">
                    <div className="occupation-find-employers">Find Employers</div>
                  </Link> : null}
              </MediaQuery>
            </div>
          </div>
          <MediaQuery minWidth={1224}>
            <img className="imageBanner" src={this.state.details.image_avatar_url}/>
            <p className="description">{this.state.details.description}</p>
          </MediaQuery>
          <MediaQuery maxWidth={1224}>
            <div className="imageBanner-mobile-container">
              <h2 className="imageBanner-mobile-title">{this.state.details.title}</h2>
              <img className="imageBanner-mobile" src={this.state.details.image_avatar_url}/>
            </div>
          </MediaQuery>
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
              Ten year growth
            </div>
            <div className="meta-value">
              {`${parseInt(this.state.details.project_growth_2024)}%`}
            </div>
          </div>
          <div className="odd-row">
            <div className="meta-label">
              Average Yearly Salary
            </div>
            <div className="meta-value">
              {`$${parseInt(this.state.details.annual_mean)}`}
            </div>
          </div>
          <br/>
          <MediaQuery maxWidth={1224}>
            <div className="occupation-video-mobile">
              <YouTube
                videoId={this.state.details.video_url}
                opts={this.mobileVideo}
                onReady={this._onReady}
              />
            </div>
          </MediaQuery>
          <MediaQuery minWidth={1224}>
            <div className="occupation-video">
              <YouTube
                videoId={this.state.details.video_url}
                opts={this.desktopVideo}
                onReady={this._onReady}
              />
            </div>
          </MediaQuery>
          <br/>
        </div> : <div>Loading...</div>}
    </div>
  }
}

export default OccupationsDetailComponent