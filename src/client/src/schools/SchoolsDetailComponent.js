/**
 * Created by jakewilson on 7/10/17.
 */
import React, {Component} from 'react';
import './schools_detail.css'
import {Link} from 'react-router-dom';
import ReactModal from 'react-modal';
import FacebookLogin from 'react-facebook-login';
import SchoolsProgramComponent from './SchoolsProgramComponent'

class SchoolsDetailComponent extends Component {
  state = {school: {}, showModal: false};

  FB_DEV = "278110495999806";
  FB_PROD = "124782244806218";

  constructor() {
    super();
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleOpenModal() {
    this.setState({showModal: true});
  }

  handleCloseModal() {
    this.setState({showModal: false});
    window.location.replace("/messages/1");
  }


  closeModal() {
    this.setState({showModal: false});
  }

  responseFacebook(response) {
    localStorage.setItem("fb_info", JSON.stringify(response));
    fetch('/api/v1/accounts/facebook', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response)
    });

    this.handleCloseModal(response);
  }

  componentDidMount() {
    fetch(`/api/v1/schools/${this.props.match.params.id}/details`)
      .then(res => res.json())
      .then(sch => this.setState({school: sch}));
  }

  render() {
    return <div>
      <ReactModal
        isOpen={this.state.showModal}
        contentLabel="Login with Facebook"
        className="Modal"
        overlayClassName="Overlay">
        <div className="signup-dialog">
          <div className="signup-header"><h1>Welcome to Gilded!</h1>
            <div onClick={this.closeModal}>X</div>
          </div>
          <h2>To connect with Schools and Employers please make an account.</h2>
          <FacebookLogin
            appId={this.FB_PROD}
            fields="name,email,picture"
            scope="public_profile,user_friends"
            callback={this.responseFacebook}
          />
        </div>
      </ReactModal>
      <div className="schools-detail-container">
        <div className="schools-detail-banner-holder">
          <img className="schools-detail-banner" src={this.state.school.image_background_url}/>
          <div className="schools-name">{this.state.school.title}</div>
          <img className="schools-detail-avatar" src={this.state.school.image_avatar_url}/>
        </div>
        <div className="schools-header-container">
          <div className="schools-address">
            Kaysville Utah
          </div>
          {localStorage.getItem('fb_info') && localStorage.getItem('fb_info') !== '{}' ?
            <Link to="/messages/1">
              <div className="schools-message-container">
                <div className="schools-message-text">
                  Message
                </div>
              </div>
            </Link> : <div onClick={this.handleOpenModal} className="schools-message-container">
              <div className="schools-message-text">
                Message
              </div>
            </div>
          }
        </div>
      </div>
      <div className="schools-about">
        <h2>About</h2>
        <h3>Find your next career in today!</h3>
        {this.state.school.phone}
        <br/>
        {this.state.school.website_url}
        {this.state.school.school_locations &&
        <SchoolsProgramComponent school_locations={this.state.school.school_locations}/>}
      </div>
    </div>;
  }
}

//
// {
//   "id": 1,
//   "title": "Davis Applied Technology College",
//   "image_avatar_url": "/assets/datc.jpg",
//   "image_background_url": "/assets/datc_rotunda.png",
//   "phone": "(801) 593-2500",
//   "website_url": "www.datc.edu",
//   "school_type": 1,
//   "school_campus_setting": 1,
//   "ipeds_id": 230162,
//   "ope_id": 2156600,
//   "campus_housing": false,
//   "address": null,
//   "student_population": null,
//   "student_faculty_ratio": null
// }

export default SchoolsDetailComponent
