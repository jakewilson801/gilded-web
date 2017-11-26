import React, {Component} from 'react';
import {AppBar, Button, Dialog, Divider, IconButton, Toolbar, Typography} from "material-ui";
import MobileStepper from 'material-ui/MobileStepper';
import CloseIcon from 'material-ui-icons/Close';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import Slide from 'material-ui/transitions/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Filter extends Component {
  componentDidMount() {
    this.getOccupations(this.props.years, this.props.salary, this.props.tuition);
  }

  getOccupations(years, salary, tuition) {
    let y = years;
    let s = salary * 10000;
    let t = tuition * 5000;
    let request;
    if (t || y || s) {
      request = `/api/v1/feed?tuition=${t}&years=${y}&salary=${s}`;
    } else {
      request = `/api/v1/feed`;
    }

    fetch(request)
      .then(res => res.json())
      .then(data => {
        this.props.setAppState({occupations: data.occupations});
      });
  };

  handleRequestClose = () => {
    this.getOccupations(this.props.years, this.props.salary, this.props.tuition);
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

  render() {
    return <div>
      <Dialog
        fullScreen
        open={this.props.open}
        onRequestClose={this.props.handleRequestClose}
        transition={Transition}
      >
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
      </Dialog>
    </div>;
  }
}

export default Filter;
