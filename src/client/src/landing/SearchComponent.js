import React, {Component} from 'react';
import Slider from 'react-rangeslider';

class SearchComponent extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {years: 0};
  }


  handleOnChange = (value) => {
    this.setState({
      years: value
    })
  };


  render() {
    let {years} = this.state;
    return <div style={color: '#FFFFFF'}>
      <div>Search here...</div>
      <br/>
      <div>How many years do you want to go to school?</div>
      <Slider
        value={years}
        orientation="horizontal"
        onChange={this.handleOnChange}
      />
    </div>
  }
}

export default SearchComponent;