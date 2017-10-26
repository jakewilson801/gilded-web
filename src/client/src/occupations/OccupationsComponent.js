/**
 * Created by jakewilson on 6/29/17.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './occupations.css';
import {Redirect} from 'react-router';


class OccupationsComponent extends Component {
  state = {occupations: [], title: "", error: "", redirect: -1};

  constructor() {
    super();
    this.handleCardClick = this.handleCardClick.bind(this);
  }

  handleCardClick(id) {
    this.props.history.push(`/occupations/${id}/details`)
  }

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

  //Needs to be refactored to redux this code sucks
  render() {
    if (this.state.redirect !== -1) {
      return <Redirect to={`/occupations/${this.state.redirect}/details`} push={true}/>;
    }

    let title;
    let occupationsFromServerOrProps = [];
    if (this.state.title !== "") {
      title = this.state.title;
    } else {
      if (this.props.fieldTitle) {
        title = this.props.fieldTitle;
      } else {
        title = "";
      }
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
          <div className="cardsList">{occupationsFromServerOrProps.map((f) => <div key={f.id} onClick={() => {
            this.setState({redirect: f.id})
          }} className="card">
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