import React, {Component} from 'react';
import InputRange from 'react-input-range';
import './search.css';
import {Link} from 'react-router-dom';

class SearchComponent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {years: 0, salary: 10000, tuition: 1000};
  }

  render() {
    return <div style={{backgroundColor: '#FFFFFF', margin: '10px'}}>
      <h2 style={{margin: '10px', paddingTop: '10px'}}>Find the program that fits your goals</h2>
      <div style={{marginLeft: '10px'}}>What's the most amount of school you could do?(years)</div>
      <br/>
      <InputRange
        step={.5}
        maxValue={4}
        minValue={0}
        value={this.state.years}
        onChange={value => this.setState({years: value})}/>
      <br/>
      <div style={{margin: '10px'}}>What's the minimum salary you'd be happy with?</div>
      <br/>
      <InputRange
        formatLabel={value => value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        })}
        step={1000}
        maxValue={100000}
        minValue={10000}
        value={this.state.salary}
        onChange={value => this.setState({salary: value})}/>
      <br/>
      <div style={{margin: '10px'}}>What's the most money you'd want to spend on school?</div>
      <br/>
      <InputRange
        formatLabel={value => value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        })}
        step={100}
        maxValue={25000}
        minValue={1000}
        value={this.state.tuition}
        onChange={value => this.setState({tuition: value})}/>
      <br/>
      <br/>
      <Link to={`/feed?years=${this.state.years}&salary=${this.state.salary}&tuition=${this.state.tuition}`}
            className="search-provider">
        <div className="search-find-providers">Find Schools</div>
      </Link>
      <br/>
    </div>
  }
}

export default SearchComponent;