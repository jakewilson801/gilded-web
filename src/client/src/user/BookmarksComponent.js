import React, {Component} from 'react';
import {Button, CardActions, CardContent, IconButton, withStyles} from 'material-ui';
import GridList from 'material-ui/GridList';
import GridListTile from 'material-ui/GridList/GridListTile'
import GridListTileBar from 'material-ui/GridList/GridListTileBar'
import CircularProgress from 'material-ui/Progress/CircularProgress';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Card from 'material-ui/Card';
import MoneyUtils from "../util/MoneyUtils";
import InfoIcon from 'material-ui-icons/Info';
import Subheader from 'material-ui/List/ListSubheader';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 7,
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
  gridList: {
    cellHeight: 'auto',
    width: 500,
  },
  programImage: {
    width: '100%',
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
      return <div className={classes.container}><CircularProgress/></div>
    } else {
      if (this.state.bookmarks.occupations.length > 0) {
        return (<div className={classes.container}>
          <GridList cols={1} className={classes.gridList}>
            {this.state.bookmarks.occupations.length > 0 ?
              <GridListTile key="occupations" style={{height: 50}}>
                <Subheader component="div">Occupations</Subheader>
              </GridListTile> : null}

            {this.state.bookmarks.occupations.map(occupations => (
              <GridListTile style={{cellHeight: 'auto'}} key={occupations.image_avatar_url} id={occupations.id}
                            onClick={() => this.props.history.push(`/occupations/${occupations.id}/details`)}>
                <img src={occupations.image_avatar_url} alt={occupations.title}/>
                <GridListTileBar
                  title={occupations.title}
                  subtitle={<span>Average Salary {MoneyUtils.thousands(parseInt(occupations.annual_mean, 10))}</span>}
                  actionIcon={
                    <IconButton>
                      <InfoIcon
                        color="rgba(255, 255, 255, 1)"
                        onClick={() => this.props.history.push(`/occupations/${occupations.id}/details`)}/>
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
            {this.state.bookmarks.programs.length > 0 ?
              <GridListTile key="programs" style={{height: 50}}>
                <Subheader component="div">Programs</Subheader>
              </GridListTile> : null}

            {this.state.bookmarks.programs.length > 0 ? this.state.bookmarks.programs.map(program => (
              <GridListTile key={program.program_id + program.title} onClick={() => this.props.history.push(`/`)}>
                <img className={classes.programImage} src={`/assets/${program.image_background_url}`}
                     alt={program.title}/>
                <GridListTileBar
                  title={program.school_title}
                  subtitle={<div>
                    <span>{`${MoneyUtils.thousands(parseInt(program.cost_in_state, 10))}`} {`${program.length_months} `}
                      Months</span><br/><span style={{marginTop: 5}}>{program.title}</span></div>}
                  actionIcon={
                    <IconButton>
                      <InfoIcon
                        color="rgba(255, 255, 255, 1)"
                        onClick={() => this.props.history.push("/")}/>
                    </IconButton>
                  }
                />
              </GridListTile>
            )) : null}

            {this.state.bookmarks.employers.length > 0 ? <GridListTile key="employers" style={{height: 50}}>
              <Subheader component="div">Employers</Subheader>
            </GridListTile> : null}

            {this.state.bookmarks.employers.length > 0 ? this.state.bookmarks.employers.map(employer => (
              <GridListTile key={employer.id + employer.title}>
                {employer.image_avatar_url &&
                <img className={classes.programImage} src={`/assets/${employer.image_avatar_url}`}
                     alt={employer.title}/>}
                <GridListTileBar
                  title={employer.title}
                  subtitle={<span>{employer.city}</span>}
                  actionIcon={
                    <IconButton>
                      <InfoIcon
                        color="rgba(255, 255, 255, 1)"
                        onClick={() => this.props.history.push("/")}/>
                    </IconButton>
                  }
                />
              </GridListTile>
            )) : null}

          </GridList>
        </div>);
      } else {
        return <div className={classes.container}><Card className={classes.bookmarks}>
          <CardContent>
            <Typography type="headline" component="h2" className={classes.title}>
              No bookmarks go check out some occupations and bookmark them!
            </Typography></CardContent>
          <CardActions>
            <Button onClick={() => this.props.history.push("/")}>Go to Occupations</Button>
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