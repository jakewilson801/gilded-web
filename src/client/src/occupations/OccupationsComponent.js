/**
 * Created by jakewilson on 6/29/17.
 */
import React, {Component} from 'react';
import {Redirect} from 'react-router';
import PropTypes from 'prop-types';
import '../util/MoneyUtils';
import MoneyUtils from "../util/MoneyUtils";
import {withStyles} from 'material-ui';
import GridList from 'material-ui/GridList';
import GridListTile from 'material-ui/GridList/GridListTile'
import GridListTileBar from 'material-ui/GridList/GridListTileBar'
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import CircularProgress from "material-ui/Progress/CircularProgress";

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 7,
  },
  gridList: {
    cellHeight: 'auto',
    width: 500,
  },
  progress: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    marginTop: theme.spacing.unit * 7,
  },
});


class OccupationsComponent extends Component {
  state = {occupations: [], title: "", error: "", redirect: -1};

  componentDidMount() {
    if (this.props.match) {
      fetch(`/api/v1/occupations/${this.props.match.params.id}`)
        .catch(error => this.setState({error}))
        .then(res => res.json())
        .then(occ => {
          this.setState({occupations: occ, title: occ.field.title})
        });
    }
  }

  //Needs to be refactored to redux this code sucks
  render() {
    const {classes} = this.props;
    if (this.state.redirect !== -1) {
      return <Redirect to={`/occupations/${this.state.redirect}/details`} push={true}/>;
    }

    let data = [];
    if (this.state.occupations.length > 0) {
      data = this.state.occupations;
    } else if (this.props.occupations) {
      data = this.props.occupations;
    }

    if (data.length > 0) {
      return (<div className={classes.container}>
        <GridList cols={1} className={classes.gridList}>
          {data.map(occupations => (
            <GridListTile key={occupations.image_avatar_url} onClick={() => this.setState({redirect: occupations.id})}>
              <img src={occupations.image_avatar_url} alt={occupations.title}/>
              <GridListTileBar
                title={occupations.title}
                subtitle={<span>Average Salary {MoneyUtils.thousands(parseInt(occupations.annual_mean))}</span>}
                actionIcon={
                  <IconButton>
                    <InfoIcon
                      color="rgba(255, 255, 255, 1)"
                      onClick={() => this.setState({redirect: occupations.id})}/>
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </div>);
    } else {
      return <div className={classes.progress}><CircularProgress/></div>;
    }
  }
}

OccupationsComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OccupationsComponent);

