import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Bookmarks extends Component {
  componentDidMount() {
    fetch('/api/v1/user/bookmarks', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('jwt')
      }
    }).then(res => res.json()).then(d => console.log(d));
  }

  render() {
    return <div>Bookmarks coming soon</div>;
  }
}

export default Bookmarks;