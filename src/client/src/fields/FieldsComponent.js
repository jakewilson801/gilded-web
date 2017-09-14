/**
 * Created by jakewilson on 6/8/17.
 */

import React, {Component} from 'react';
import './fields.css';
import {Link} from 'react-router-dom'

class FieldsComponent extends Component {
  state = {fields_list: []}

  componentDidMount() {
    fetch('api/v1/fields')
      .then(res => res.json())
      .then(fields_list => this.setState({fields_list}))
  }

  render() {
    return <div className="container">
      <h2 className="cards-title">Fields</h2>
      <div className="slider">
        <div className="cardsList">{this.state.fields_list.map((f) => <div key={f.id} className="card">
          <img className="cardImage" src={f.image_url}/>
          <div className="cardTitle">{f.title}</div>
          <br/>
          <Link to={{pathname: `/occupations/${f.soc_major_id}`, state: {title: f.title}}}>View More</Link>
        </div>)}</div>
      </div>
    </div>;
  }
}

export default FieldsComponent