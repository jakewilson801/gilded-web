import React, {Component} from 'react';
import './employers_card.css';
import {Link} from 'react-router-dom';

class EmployersComponent extends Component {
  state = {employers: []};

  componentDidMount() {
    fetch(`/api/v1/employers?socCode=${this.props.match.params.id}`)
      .then(res => res.json())
      .then(employers => this.setState({employers}));
  }

  render() {
    return <div className="employer-container">
      <h2 className="employer-title">Employers</h2>
      <div className="employer-slider">
        <div className="employer-card-list">
          {this.state.employers.map(e => <div key={e.id}
                                              className="employer-card">
            <div className="employer-banner"/>
            <div className="employer-card-inner">
              <img className="employer-avatar" src={`/assets/${e.image_avatar_url}`}/>
              <div className="employer-outer">
                <div className="employer-name">{e.title}</div>
                <Link className="employer-view-more" to={`/employers/${e.id}/details`}>View More</Link>
              </div>
            </div>
          </div>)}
        </div>
      </div>
    </div>;
  }
}

export default EmployersComponent;