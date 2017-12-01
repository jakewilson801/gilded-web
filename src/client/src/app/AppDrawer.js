import React, {Component} from 'react';
import {Avatar, Divider, List, ListItem, ListItemText} from "material-ui";
import DrawerNavigationButton from "../util/DrawerNavigationButton";

class AppDrawer extends Component {
  render() {
    return this.props.isAuth ? <div className={this.props.classes.list}><List>
        <ListItem key={JSON.parse(localStorage.fb_info).id} dense button
                  onClick={() => {
                    this.props.setShouldOpenDrawer(false);
                    this.props.appHistory.push("/");
                  }}>
          <Avatar alt="Avatar"
                  src={`http://graph.facebook.com/v2.10/${JSON.parse(localStorage.fb_info).id}/picture?width=170&height=170`}/>
          <ListItemText primary={`${JSON.parse(localStorage.fb_info).name}`}/>
        </ListItem>
        <DrawerNavigationButton routeUrl={"/user/bookmarks"} routeName={"Bookmarks"}
                                routeCallback={() => this.props.setShouldOpenDrawer(false)}/>
        <Divider/>
        <ListItem button component="a" primary={(this.props.theme.palette.type === 'light' ? "Day" : "Night")}
                  onClick={() => {
                    this.props.setShouldOpenDrawer(true);
                    let type = (this.props.theme.palette.type === 'light' ? "dark" : "light");
                    localStorage.setItem("theme", type);
                    this.props.updateTheme(type);
                  }}><ListItemText primary={this.props.theme.palette.type === 'light' ? "Day" : "Night"}/></ListItem>
        <Divider/>
        <DrawerNavigationButton routeUrl={"/"} routeName={"Logout"} routeCallback={() => {
          this.props.setShouldOpenDrawer(false);
          localStorage.clear();
          this.props.setAuth(false);
        }}/>

      </List></div> :
      <div className={this.props.classes.list}><DrawerNavigationButton routeName={"Login"} routeUrl={"/user/signup"}
                                                                       routeCallback={() => this.props.setShouldOpenDrawer(false)}/>
      </div>

  }
}

export default AppDrawer;


