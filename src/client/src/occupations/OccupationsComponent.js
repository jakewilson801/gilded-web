/**
 * Created by jakewilson on 6/29/17.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './occupations.css'

class OccupationsComponent extends Component {
  state = {occupations: [], title: "", error: ""};

  componentDidMount() {
    if (this.props.match) {
      fetch(`/api/v1/occupations/${this.props.match.params.id}`)
        .catch(error => this.setState({error}))
        .then(res => res.json())
        .then(occ => {
          this.setState({occupations: occ.occupations, title: occ.field.title})
        });
    }
  }


  render() {
    let title;
    let occupationsFromServerOrProps = [];
    if (this.state.title !== "") {
      title = this.state.title;
    } else {
      title = this.props.fieldTitle;
    }

    if (this.state.occupations.length > 0) {
      occupationsFromServerOrProps = this.state.occupations;
    } else if (this.props.occupations) {
      occupationsFromServerOrProps = this.props.occupations;
    }


    if (this.state.error === "") {
      return <div className="container-occupations">
        <h2 className="field-title">{title}</h2>
        <div className="slider">
          <div className="cardsList">{occupationsFromServerOrProps.map((f) => <div key={f.id} className="card">
            <img className="cardImage" src={f.image_avatar_url}/>
            <div className="occupation-title">{f.title}</div>
            <Link to={`/occupations/${f.id}/details`}>View More</Link>
          </div>)}</div>
        </div>
      </div>;
    } else {
      return <div className="container"><h2>Couldn't find this Occupation</h2></div>;
    }
  }
}

export default OccupationsComponent