import React, {Component} from 'react';
import {AppBar, Button, Dialog, Divider, IconButton, Toolbar, Typography} from "material-ui";
import MobileStepper from 'material-ui/MobileStepper';
import CloseIcon from 'material-ui-icons/Close';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import Slide from 'material-ui/transitions/Slide';
import Select from 'material-ui/Select';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Filter extends Component {
  componentDidMount() {
    this.getOccupations(this.props.years, this.props.salary, this.props.tuition, this.props.interest);
  }

  getOccupations(years, salary, tuition, interest) {
    let y = years ? years : 0;
    let s = salary ? salary * 10000 : 0;
    let t = tuition ? tuition * 5000 : 0;
    let i = interest ? interest : -1;
    let request;

    if (t || y || s || i) {
      request = `/api/v1/feed?tuition=${t}&years=${y}&salary=${s}&interest=${i}`;
    } else {
      request = `/api/v1/feed`;
    }
    console.log(request);
    fetch(request)
      .then(res => res.json())
      .then(data => {
        this.props.setAppState({occupations: data.occupations});
      });
  };

  handleRequestClose = () => {
    this.getOccupations(this.props.years, this.props.salary, this.props.tuition, this.props.interest);
    this.props.setAppState({open: false});
  };

  handleRequestCancel = () => {
    this.props.setAppState({open: false});
  };

  handleNextYears = () => {
    this.props.setAppState({
      years: this.props.years + 1,
    });
  };

  handleBackYears = () => {
    this.props.setAppState({
      years: this.props.years - 1,
    });
  };

  handleNextSalary = () => {
    this.props.setAppState({
      salary: this.props.salary + 1,
    });
  };

  handleBackSalary = () => {
    this.props.setAppState({
      salary: this.props.salary - 1,
    });
  };

  handleNextTuition = () => {
    this.props.setAppState({
      tuition: this.props.tuition + 1,
    });
  };

  handleBackTuition = () => {
    this.props.setAppState({
      tuition: this.props.tuition - 1,
    });
  };

  getSalary(salary) {
    return (salary * 10000).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })
  }

  getTuition(tuition) {
    return (tuition * 5000).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })
  }

  handleChange = name => event => {
    console.log(event.target.value);
    this.props.setAppState({interest: event.target.value});
  };

  render() {
    return <div>
      <Dialog
        fullScreen
        open={this.props.open}
        onRequestClose={this.handleRequestClose}
        transition={Transition}>
        <AppBar className={this.props.classes.appBar}>
          <Toolbar>
            <IconButton color="contrast" onClick={this.handleRequestCancel} aria-label="Close">
              <CloseIcon/>
            </IconButton>
            <Typography type="title" color="inherit" className={this.props.classes.flex}>
              Filter
            </Typography>
            <Button type="title" color="inherit" onClick={this.handleRequestClose}>Save</Button>
          </Toolbar>
        </AppBar>
        <div className={this.props.classes.filterContainer}>
          <Typography className={this.props.classes.filterLabelTop}>Years of School</Typography>
          <MobileStepper
            type="progress"
            steps={4}
            position="static"
            activeStep={this.props.years || 0}
            className={this.props.classes.filterSlider}
            nextButton={
              <Button dense onClick={this.handleNextYears} disabled={this.props.years === 4}>
                More
                <KeyboardArrowRight/>
              </Button>
            }
            backButton={
              <Button dense onClick={this.handleBackYears} disabled={this.props.years === 0}>
                <KeyboardArrowLeft/>
                Less
              </Button>
            }
          />
          <Typography type="display1"
                      className={this.props.classes.filterLabelBottom}>{this.props.years || 0}</Typography>
        </div>
        <Divider style={{marginTop: 10}}/>
        <div className={this.props.classes.filterContainer}>
          <Typography className={this.props.classes.filterLabelTop}>Minimum Salary</Typography>
          <MobileStepper
            type="progress"
            steps={10}
            position="static"
            activeStep={this.props.salary || 0}
            className={this.props.classes.filterSlider}
            nextButton={
              <Button dense onClick={this.handleNextSalary} disabled={this.props.salary === 10}>
                More
                <KeyboardArrowRight/>
              </Button>
            }
            backButton={
              <Button dense onClick={this.handleBackSalary} disabled={this.props.salary === 0}>
                <KeyboardArrowLeft/>
                Less
              </Button>
            }
          />
          <Typography type="display1"
                      className={this.props.classes.filterLabelBottom}>{this.getSalary(this.props.salary)}</Typography>

        </div>
        <Divider style={{marginTop: 10}}/>
        <div className={this.props.classes.filterContainer}>
          <Typography className={this.props.classes.filterLabelTop}>Tuition</Typography>
          <MobileStepper
            type="progress"
            steps={5}
            position="static"
            activeStep={this.props.tuition || 0}
            className={this.props.classes.filterSlider}
            nextButton={
              <Button dense onClick={this.handleNextTuition} disabled={this.props.tuition === 5}>
                More
                <KeyboardArrowRight/>
              </Button>
            }
            backButton={
              <Button dense onClick={this.handleBackTuition} disabled={this.props.tuition === 0}>
                <KeyboardArrowLeft/>
                Less
              </Button>
            }
          />
          <Typography type="display1"
                      className={this.props.classes.filterLabelBottom}>{this.getTuition(this.props.tuition)}</Typography>
        </div>
        <Divider style={{marginTop: 10}}/>
        <div className={this.props.classes.filterContainer}>
          <Select
            native
            value={this.props.interest || -1}
            onChange={this.handleChange('interest')}
            className={this.props.classes.selectEmpty}>
            <option value={-1}>Tell us what kind of work you like...</option>
            <option value={0}>I like working with my hands</option>
            <option value={1}>I like to think about abstract ideas</option>
            <option value={2}>I like to express myself through different forms</option>
            <option value={3}>I like to work with and help other people</option>
            <option value={4}>I like to lead people and make decisions</option>
            <option value={5}>I like to follow procedures</option>
          </Select>
        </div>
      </Dialog>
    </div>;
  }
}

export default Filter;
