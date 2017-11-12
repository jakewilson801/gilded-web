import React, {Component} from 'react';
import {withStyles} from 'material-ui/styles';
import {CircularProgress} from 'material-ui/Progress';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Card, {CardActions, CardContent} from 'material-ui/Card';
import Button from "material-ui/es/Button/Button";
import CardMedia from "material-ui/es/Card/CardMedia";
import List from "material-ui/es/List/List";
import Grid from "material-ui/es/Grid/Grid";
import GridList from "material-ui/es/GridList/GridList";

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
  state = {bookmarks: null};

  componentDidMount() {
    fetch(`/api/v1/user/bookmarks?token=${localStorage.jwt}`)
      .then(res => res.json())
      .then(d => this.setState({bookmarks: d}));
  }

  render() {
    const {classes} = this.props;
    if (!this.state.bookmarks) {
      return <div className={classes.root}><CircularProgress/></div>
    } else {
      if (this.state.bookmarks.length > 0) {
        let bookmarks = this.state.bookmarks.map(bookmark =>
          <Card className={classes.card} key={bookmark.id}>
            <CardMedia
              className={classes.media}
              image={bookmark.image_avatar_url}
              title={bookmark.title}
            />
            <CardContent>
              <Typography type="headline" component="h2">
                {bookmark.title}
              </Typography>
            </CardContent>
            <CardActions>
              <Button dense
                      onClick={() => window.location.href = `/occupations/${bookmark.id}/details`}>View
                Occupation</Button>
            </CardActions>
          </Card>);
        return <div className={classes.gridContainer}><GridList className={classes.gridList}>{bookmarks}</GridList>;</div>
      } else {
        return <div className={classes.root}><Card className={classes.bookmarks} onClick={() => {
          window.location.href = "/";
        }}>
          <CardContent>
            <Typography type="headline" component="h2" className={classes.title}>
              No bookmarks go check out some occupations and bookmark them!
            </Typography></CardContent>
          <CardActions>
            <Button dense>Go to Occupations</Button>
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