/**
 * Created by jakewilson on 7/2/17.
 */

import React, {Component} from 'react';
import './occupations_details.css';
import '../util/MoneyUtils'
import MoneyUtils from "../util/MoneyUtils";
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui';
import Card, {CardActions, CardContent, CardMedia} from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import BottomNavigation from 'material-ui/BottomNavigation';
import BottomNavigationButton from 'material-ui/BottomNavigation/BottomNavigationButton';
import AccountBalance from 'material-ui-icons/AccountBalance';
import Business from 'material-ui-icons/Business';
import AccountCircle from 'material-ui-icons/AccountCircle';
import {GridList, GridListTile, GridListTileBar} from 'material-ui/GridList';


const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    background: theme.palette.background.default,
    marginTop: theme.spacing.unit * 7,
    padding: theme.spacing.unit * 2,
  },
  card: {
    maxWidth: 400,
    minWidth: 300,
    marginBottom: 50
  },
  media: {
    height: 200,
  },
  progress: {
    margin: `0 ${theme.spacing.unit * 2}px`,
  },
  root: {
    width: '100%',
    position: 'fixed',
    left: 0,
    bottom: 0,
  },
  listItem: {
    height: 120,
    background: theme.palette.background.paper
  },
  programContainer: {
    display: 'flex',
    marginBottom: 50,
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
  },
  programList: {
    // width: '100%',
  },
  programImage: {
    width: '100%',
  }
});

class OccupationsDetailComponent extends Component {
  desktopVideo = {
    height: '390',
    width: '640',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 0
    }
  };

  mobileVideo = {
    height: '200',
    width: '300',
    playerVars: {
      autoplay: 0
    }
  };

  state = {
    details: null,
    socCode: "",
    isBookmarked: false,
    isAuth: false,
    providers: [],
    employers: [],
    page: 0,
  };

  constructor() {
    super();
    this.bookmarkOccupation = this.bookmarkOccupation.bind(this);
  }

  componentDidMount() {
    fetch(`/api/v1/occupations/${this.props.match.params.id}/details`)
      .then(res => res.json())
      .then(results => {
        results.video_url = new URL(results.video_url).searchParams.get("v");
        this.setState({details: results, socCode: `${results.field_id}-${results.soc_detailed_id}`});
        fetch(`/api/v1/programs?socCode=${this.state.socCode}`)
          .then(res => res.json())
          .then(results => {
            if (results.length > 0)
              this.setState({providers: results});

          }).catch(error => console.log(error));

        fetch(`/api/v1/employers?socCode=${this.state.socCode}`)
          .then(res => res.json())
          .then(results => {
            if (results.length > 0)
              this.setState({employers: results});
          }).catch(error => console.log(error));

        fetch('/api/v1/user/bookmarks', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('jwt')
          }
        }).then(res => {
            res.json().then(json => {
              if (res.status === 200) {
                this.setState({
                  isBookmarked: (json.filter(occupation => {
                    return occupation.id === this.state.details.id;
                  }).length > 0), isAuth: true
                });
              } else {
                this.setState({isAuth: false});
              }
            });
          }
        );
      });
  }

  bookmarkOccupation() {
    this.setState({isBookmarked: !this.state.isBookmarked});
    fetch('/api/v1/user/bookmarks', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('jwt')
      },
      body: JSON.stringify({occupation_id: this.state.details.id})
    }).then(res => res.json());
  }

  handleChange = (event, value) => {
    this.setState({page: value});
  };

  getCurrentPage(classes) {
    switch (this.state.page) {
      case 0:
        return <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={this.state.details.image_avatar_url}
            title={this.state.details.title}
          />
          <CardContent>
            <Typography type="headline" component="h2">
              {this.state.details.title}
            </Typography>
            <Typography type="display1">{`$${this.state.details.hourly_median}`}/hr</Typography>
            <Typography type="subheading">{`${parseInt(this.state.details.project_growth_2024, 10)}%`} growth in
              Utah</Typography>
            <Typography type="subheading">{`${MoneyUtils.thousands(parseInt(this.state.details.annual_pct10, 10))} `}
              starting salary</Typography>
          </CardContent>
          {this.state.isAuth && <CardActions>
            <Button dense color="primary" onClick={() => this.bookmarkOccupation()}>
              {this.state.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
            </Button>
          </CardActions>}
        </Card>;
      case 1:
        return <div className={classes.programContainer}>
          <GridList cellHeight={150} cols={1} className={classes.programList}>
            {this.state.providers.length > 0 ? this.state.providers.map(provider => (
              <GridListTile key={provider.program_id}>
                <img className={classes.programImage} src={`/assets/${provider.image_background_url}`}
                     alt={provider.title}/>
                <GridListTileBar
                  title={provider.title}
                  subtitle={<div>
                    <span>{`${MoneyUtils.thousands(parseInt(provider.cost_in_state, 10))}`} {`${provider.length_months} `}
                      Months</span><br/><span style={{marginTop: 5}}>{provider.program_title}</span></div>}
                />
              </GridListTile>
            )) : <CircularProgress/>}
          </GridList>
        </div>;
      case 2:
        return <div className={classes.programContainer}>
          <GridList cellHeight={150} cols={1} className={classes.programList}>
            {this.state.employers.length > 0 ? this.state.employers.map(employer => (
              <GridListTile key={employer.id}>
                {employer.image_avatar_url &&
                <img className={classes.programImage} src={`/assets/${employer.image_avatar_url}`}
                     alt={employer.title}/>}
                <GridListTileBar
                  title={employer.title}
                  subtitle={<span>{employer.city}</span>}
                />
              </GridListTile>
            )) : <CircularProgress/>}
          </GridList>
        </div>;
      default:
        return <CircularProgress/>;
    }
  }

  render() {
    const {classes} = this.props;
    const {page} = this.state;
    return <div className={classes.container}>
      {this.state.details ?
        <div>
          {this.getCurrentPage(classes)}
          <BottomNavigation
            value={page}
            onChange={this.handleChange}
            showLabels
            className={classes.root}
          >
            <BottomNavigationButton label="Details" icon={<AccountCircle/>}/>
            <BottomNavigationButton label="Programs" icon={<AccountBalance/>}/>
            <BottomNavigationButton label="Employers" icon={<Business/>}/>
          </BottomNavigation>
        </div>
        : <CircularProgress className={classes.progress}/>}
    </div>
  }
}

OccupationsDetailComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OccupationsDetailComponent);