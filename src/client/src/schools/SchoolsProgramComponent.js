import React, {Component} from 'react';

class SchoolsProgramComponent extends Component {
  state = {programs: []};

  componentDidMount() {
    fetch(`/api/v1/programs/${this.props.soc_id}/${this.props.school_id}`)
      .then(res => res.json())
      .then(programs => {
        this.setState({programs})
      });
  }

  render() {
    if (this.state.programs) {
      let programs = this.state.programs.map(p =>
        <div key={this.state.programs.indexOf(p)}><h1>{p.title}</h1>
          <div>Cost: ${parseInt(p.cost_in_state)}</div>
          <br/>
          <div>Length: {p.length_months} Months</div>
          <br/>
          <div>{p.flexible_schedule ? "Flexible/Competency Based" : "Semester Based"}</div>
          <br/>
          <div>Credential {p.credential}</div>
        </div>);
      return <div>{programs}</div>;
    } else {
      return <div>Loading</div>;
    }
  }
}

export default SchoolsProgramComponent

