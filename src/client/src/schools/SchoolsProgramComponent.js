import React, {Component} from 'react';

class SchoolsProgramComponent extends Component {
  state = {programs: []};

  componentDidMount() {
    let schoolLocationIds = this.props.school_locations.map(location => location.id);
    fetch(`/api/v1/programs?school_location_ids=${schoolLocationIds.join(',')}`)
      .then(res => res.json())
      .then(programs => {
        console.log(programs);
        this.setState({programs})
      });

  }

  render() {
    if (this.state.programs) {
      let programs = this.state.programs.map(p =>
        <div key={this.state.programs.indexOf(p)}><h1>{p.school_name}</h1>
          <div>{p.program_list.map(po => <div key={po.id}>
            <h2>{po.title}</h2>
            <div>Cost: ${po.cost_in_state}</div>
            <br/>
            <div>Length: {po.length} Months</div>
          </div>)}</div>
        </div>);
      return <div>{programs}</div>;
    } else {
      return <div>Loading</div>;
    }
  }
}

export default SchoolsProgramComponent

