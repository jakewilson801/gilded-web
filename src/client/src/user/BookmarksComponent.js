import React, {Component} from 'react';
import {CardActions, CardContent, withStyles} from 'material-ui';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import OccupationsComponent from '../occupations/OccupationsComponent';
import NavigationButton from "../util/NavigationButton";

const styles = theme => ({
  root: {
    width: '100%',
    background: theme.palette.background.default,
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    justifyContent: 'center'
  },
  grid: {
    cellHeight: 'auto'
  },
  bookmarks: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
  },
  title: {
    color: theme.palette.text.secondary,
  },
  media: {
    height: 200,
  },
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: 450,
  },
  card: {
    height: 400
  }
});

class BookmarksComponent extends Component {
  state = {bookmarks: null, isLoading: true};

  componentDidMount() {
    fetch(`/api/v1/user/bookmarks?token=${localStorage.jwt}`)
      .then(res => res.json())
      .then(d => this.setState({bookmarks: d, loading: false}));
  }

  render() {
    const {classes} = this.props;
    if (!this.state.bookmarks && this.state.isLoading) {
      return <div className={classes.root}><CircularProgress/></div>
    } else {
      if (this.state.bookmarks.length > 0) {
        return <OccupationsComponent occupations={this.state.bookmarks}/>
      } else {
        return <div className={classes.root}><Card className={classes.bookmarks}>
          <CardContent>
            <Typography type="headline" component="h2" className={classes.title}>
              No bookmarks go check out some occupations and bookmark them!
            </Typography></CardContent>
          <CardActions>
            <NavigationButton routeName={"Go to Occupations"} routeUrl={"/"}/>
          </CardActions>
        </Card></div>;
      }
    }
  }
}

BookmarksComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BookmarksComponent);