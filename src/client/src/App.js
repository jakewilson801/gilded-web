import React, {Component} from 'react';
import './App.css';
import OccupationsComponent from './occupations/OccupationsComponent';
import OccupationsDetailComponent from './occupations/OccupationsDetailComponent';
import LandingScreenComponent from './landing/LandingScreenComponent';
import SchoolsDetailComponent from "./schools/SchoolsDetailComponent";
import EmployersDetailComponent from "./employers/EmployersDetailComponent";
import SchoolsComponent from "./schools/SchoolsComponent";
import MessagesComponent from "./messages/MessagesComponent";
import {Route, Link, withRouter, Redirect} from 'react-router-dom';
import EmployersComponent from "./employers/EmployersComponent";
import ReactModal from 'react-modal';
import FacebookLogin from './fb_login/facebook';
import SearchComponent from "./landing/SearchComponent";
import MediaQuery from 'react-responsive';
// const PrivateRoute = ({component: Component, ...rest}) => (
//   <Route {...rest} render={props => (
//     localStorage.getItem('fb_info') || localStorage.getItem('fb_info') !== "{}" ? (
//       <Component {...props}/>
//     ) : (
//       <Redirect to={{
//         pathname: '/',
//         state: {from: props.location}
//       }}/>
//     )
//   )}/>
// );

class App extends Component {
  FB_DEV = "278110495999806";
  FB_PROD = "124782244806218";

  state = {
    showModal: false,
    userData: !!localStorage.getItem("fb_info") ? JSON.parse(localStorage.getItem("fb_info")) : ""
  };

  constructor() {
    super();
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleOpenModal() {
    this.setState({showModal: true});
  }

  handleCloseModal(response) {
    this.setState({showModal: false, userData: response});
  }

  responseFacebook(response) {
    if (response.email) {
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
    } else {
      this.setState({showModal: true});
    }
  }

  logout() {
    localStorage.clear();
    window.location.replace("/");
    this.setState({userData: null});
  }

  closeModal() {
    this.setState({showModal: false});
  }

  //TODO https://reacttraining.com/react-router/web/example/auth-workflow
  //https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
  render() {
    return (
      <div>
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
              appId={this.FB_DEV}
              reRequest={true}
              fields="name,email,picture"
              scope="public_profile,user_friends,email"
              callback={this.responseFacebook}
            />
          </div>
        </ReactModal>
        <div className="App">
          <div className="header">
            <div className="nav">
              <Link className="logo" to="/"><img src="/logo.svg"/></Link>
              {this.state.userData && localStorage.getItem('fb_info') !== "{}" ?
                <div className="user-container">
                  <img className="avatar" src={this.state.userData.picture.data.url}/>
                  <div className="name">{this.state.userData.name}</div>
                </div> :
                <div className="signUp" onClick={this.handleOpenModal}>Sign Up</div>}
            </div>
          </div>
          <div className="nav-container">
            <div className="nav-sidebar"
                 style={{display: this.state.userData && localStorage.getItem('fb_info') !== "{}" ? 'inline' : 'none'}}>
              <img
                src={this.state.userData && localStorage.getItem('fb_info') !== "{}" ? `http://graph.facebook.com/v2.10/${this.state.userData.id}/picture?width=170&height=170` : ''}
                className="avatar-large"/>
              <Link to="/" className="nav-link">
                <div className="nav-item">Home</div>
              </Link>
              <Link to="/messages" className="nav-link">
                <div className="nav-item">Messages</div>
              </Link>
              <div onClick={this.logout} className="logout-message-container">
                <div className="logout-message-text">
                  Log Out
                </div>
              </div>
            </div>
            <div className="nav-content">
              <div>
                <Route exact path="/" component={SearchComponent}/>
              </div>
              <div>
                <Route exact path="/feed" component={LandingScreenComponent}/>
              </div>
              <div>
                <Route exact path="/occupations/:id" component={OccupationsComponent}/>
              </div>
              <div>
                <Route exact path="/occupations/:id/details" component={OccupationsDetailComponent}/>
              </div>
              <div>
                <Route exact path="/schools/:id/details/:school_id" component={SchoolsDetailComponent}/>
              </div>
              <div>
                <Route exact path="/employers/:id/details" component={EmployersDetailComponent}/>
              </div>
              <div>
                <Route exact path="/employers/occupations/:id" component={EmployersComponent}/>
              </div>
              <div>
                <Route exact path="/schools/occupations/:id" component={SchoolsComponent}/>
              </div>
              <div>
                <Route exact path="/messages" component={MessagesComponent}/>
              </div>
              <div>
                <Route exact path="/messages/:id" component={MessagesComponent}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
