/**
 * Created by jakewilson on 6/29/17.
 */
import React, {Component} from 'react';
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
import {withRouter} from 'react-router'

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
  state = {occupations: [], title: "", error: ""};

  componentDidMount() {
    this.scroll();
  }

  componentDidUpdate() {
    this.scroll();
  }

  scroll() {
    const {id, theme} = this.props;

    if (!id) {
      return;
    }

    let parsedId = id.substring(1, id.indexOf("-"));
    let offset = id.substring(id.indexOf("-") + 1, id.length) * theme.spacing.unit * 7;
    const element = document.getElementById(parsedId);
    if (element) {
      if (element.scrollTop) {
        element.scrollTop = offset;
      }
      element.scrollIntoView(true);
    }
  }

  handleNavigation = (occupations) => {
    const element = document.getElementById(occupations.id);
    let top = element.getBoundingClientRect().top;
    this.props.history.push(`/#${occupations.id}-${top}`);
    this.props.history.push(`/occupations/${occupations.id}/details`);
  };

  render() {
    const {classes, occupations} = this.props;
    if (occupations.length > 0) {
      return (<div className={classes.container}>
        <GridList cols={1} className={classes.gridList}>
          {occupations.map(occupations => (
            <GridListTile key={occupations.image_avatar_url} id={occupations.id}
                          onClick={() => this.handleNavigation(occupations)}>
              <img src={occupations.image_avatar_url} alt={occupations.title}/>
              <GridListTileBar
                title={occupations.title}
                subtitle={<span>Average Salary {MoneyUtils.thousands(parseInt(occupations.annual_mean, 10))}</span>}
                actionIcon={
                  <IconButton>
                    <InfoIcon
                      color="rgba(255, 255, 255, 1)"
                      onClick={() => this.handleNavigation(occupations)}/>
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
  theme: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles, {withTheme: true})(OccupationsComponent));

