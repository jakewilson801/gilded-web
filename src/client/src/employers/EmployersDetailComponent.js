import React, {Component} from 'react';
import './employers_detail.css'
import {Link} from 'react-router-dom';
import ReactModal from 'react-modal';
import FacebookLogin from '../fb_login/facebook';

class EmployersDetailComponent extends Component {
  state = {employer: {}, showModal: false};
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
    window.location.replace("/messages/2");
  }


  closeModal() {
    this.setState({showModal: false});
  }


  componentDidMount() {
    fetch(`/api/v1/employers/${this.props.match.params.id}/details`)
      .then(res => res.json())
      .then(employer => this.setState({employer}));
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
      <div className="employers-detail-container">
        <div className="employers-detail-banner-holder">
          <img className="employers-detail-banner" src={this.state.employer.image_background_url}/>
          <div className="employers-name">{this.state.employer.title}</div>
          <img className="employers-detail-avatar" src={this.state.employer.image_avatar_url}/>
        </div>
        <div className="employers-header-container">
          <div className="employers-address">
            {this.state.employer.address}
          </div>
          {localStorage.getItem('fb_info') && localStorage.getItem('fb_info') !== '{}' ?
            (<Link to="/messages/2">
              <div className="employers-message-container">
                <div className="employers-message-text">
                  Message
                </div>
              </div>
            </Link>) : <div onClick={this.handleOpenModal} className="employers-message-container">
              <div className="employers-message-text">
                Message
              </div>
            </div>}
        </div>
      </div>
      <div className="employers-about">
        <h2>About</h2>
        {this.state.employer.about}
      </div>
    </div>
  }
}


// {
//   "id": 1,
//   "title": "Orbital ATK",
//   "image_avatar_url": "https://www.orbitalatk.com/images/logo.png",
//   "image_background_url": "https://www.orbitalatk.com/flight-systems/aerospace-structures/commercial-aircraft-structures/images/banner_commercialair.jpg",
//   "phone": "435-863-3511",
//   "about": "As a global leader in aerospace and defense technologies, Orbital ATK designs, builds and delivers space, defense and aviation-related systems to customers around the world both as a prime contractor and as a merchant supplier. Our main products include launch vehicles and related propulsion systems; satellites and associated components and services; composite aerospace structures; tactical missiles, subsystems and defense electronics; and precision weapons, armament systems and ammunition.",
//   "address": "Freeport Center Building H-8 Clearfield UT 84016"
// }
export default EmployersDetailComponent