import React, {Component} from 'react';
import OccupationsComponent from '../occupations/OccupationsComponent';

class BookmarksComponent extends Component {
  state = {bookmarks: null};

  constructor() {
    super();
    this.logout = this.logout.bind(this);
  }

  logout() {
    localStorage.clear();
    window.location.replace("/");
  }

  componentDidMount() {
    fetch('/api/v1/user/bookmarks', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('jwt')
      }
    }).then(res => res.json()).then(d => this.setState({bookmarks: d}));
  }

  render() {
    if (!this.state.bookmarks) {
      return <div>Loading...</div>
    } else {
      if (this.state.bookmarks.length > 0) {
        return <div><OccupationsComponent fieldTitle={"Bookmarks"}
                                          occupations={this.state.bookmarks}/>
          <div style={{margin: 20}}>
            <div onClick={this.logout} className="logout-message-container">
              <div className="logout-message-text">
                Log Out
              </div>
            </div>
          </div>
        </div>;
      } else {
        return <div style={{margin: 20}}>
          <h2>No bookmarks go check out some occupations and bookmark them!</h2>
          <div style={{margin: 20}}>
            <div onClick={this.logout} className="logout-message-container">
              <div className="logout-message-text">
                Log Out
              </div>
            </div>
          </div>
        </div>
      }
    }
  }
}

export default BookmarksComponent;