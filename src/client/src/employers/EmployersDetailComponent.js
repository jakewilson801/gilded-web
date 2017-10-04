import React, {Component} from 'react';
import './employers_detail.css';
import '../occupations/OccupationsComponent';
import OccupationsComponent from "../occupations/OccupationsComponent";

class EmployersDetailComponent extends Component {
  state = {employer: null, showModal: false, occupations: [], summary: null};

  componentDidMount() {
    fetch(`/api/v1/employers/${this.props.match.params.id}/details`)
      .then(res => res.json())
      .then(data => {
        this.setState({employer: data.employer, occupations: data.occupations});
        fetch(`/api/v1/mercury?url=${data.employer.overview_link}`).then(res => res.json()).then(json => this.setState({summary: JSON.parse(json.body).content}));
      });
  }

  render() {
    return <div>
      {this.state.employer ?
        <div>
          <div className="employers-detail-container">
            <div className="employers-detail-banner-holder">
              <img className="employers-detail-banner" src='/assets/employer_banner.jpg'/>
              <div className="employers-name">{this.state.employer.title}</div>
              <img className="employers-detail-avatar" src={`/assets/${this.state.employer.image_avatar_url}`}/>
            </div>
            <div className="employers-header-container">
              <div className="employers-address">
                {this.state.employer.address}
                <br/>
                {this.state.employer.city}, {this.state.employer.state} {this.state.employer.zipcode}
              </div>
            </div>
          </div>
          <div className="employers-about">
            <h2>About</h2>
            {this.state.summary ? <div dangerouslySetInnerHTML={{__html: this.state.summary}}/> : null}
            <a target={'blank'} href={this.state.employer.overview_link}>Overview</a>
            {this.state.occupations.length > 0 ? <OccupationsComponent occupations={this.state.occupations}
                                                                       fieldTitle={"employs these types of careers"}/> : null}
          </div>
        </div> : <div>Loading...</div>}
    </div>
  }
}

export default EmployersDetailComponent