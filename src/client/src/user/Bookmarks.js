import React, {Component} from 'react';
import OccupationsComponent from '../occupations/OccupationsComponent';

class BookmarksComponent extends Component {
  state = {bookmarks: null};

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
        return <OccupationsComponent fieldTitle={"Bookmarks"}
                                     occupations={this.state.bookmarks}/>;
      } else {
        return <div style={{margin: 20}}><h2>No bookmarks go check out some occupations and bookmark them!</h2></div>
      }
    }
  }
}

export default BookmarksComponent;