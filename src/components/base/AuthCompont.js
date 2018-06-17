import React, { Component } from "react";
import { Route, Redirect, Link } from "react-router-dom";
import client from "../../util/client";
import { menu } from "../../util/config";
import Logout from "../passport/Logout";
import gql from "graphql-tag";
import { Layout, Menu } from "antd";
const { Header, Content } = Layout;

const CURUSER = gql`
  {
    curUser {
      email
      id
    }
  }
`;
export const auth = {
  authenticate() {
    return client
      .query({
        query: CURUSER,
        fetchPolicy: "no-cache"
      })
      .then(({ data }) => {
        if (data.curUser.email) {
          return data.curUser;
        }
        return false;
      })
      .catch(error => {
        return false;
      });
  }
};

const AuthCompont = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => (
        <RenderCompont {...rest}>
          <Component {...rest} />
        </RenderCompont>
      )}
    />
  );
};

const MainMenu = ({ menus, curMenus }) => (
  <Menu
    theme="dark"
    mode="horizontal"
    defaultSelectedKeys={[curMenus]}
    style={{ lineHeight: "64px", float: "left" }}
  >
    {menus.map(menu => (
      <Menu.Item key={menu.path}>
        <Link to={menu.path}>{menu.title}</Link>
      </Menu.Item>
    ))}
  </Menu>
);

class RenderCompont extends Component {
  state = {
    authState: 0,
    curUser: {}
  };
  componentDidMount() {
    auth.authenticate().then(data => {
      if (data && data.email) {
        this.setState({
          authState: 1,
          curUser: data
        });
      } else {
        this.setState({
          authState: -1,
          curUser: {}
        });
      }
    });
  }
  render() {
    if (this.props.isPublic || this.state.authState === 1) {
      return (
        <div>
          <Header>
            <img
              alt="logo"
              style={{
                width: 31,
                height: 31,
                float: "left",
                margin: "16px 24px 16px 0"
              }}
              src="img/shop.png"
            />
            <MainMenu menus={menu} curMenus={this.props.path} />
            <Logout {...this.props} curUser={this.state.curUser} />
          </Header>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              margin: 50
            }}
          >
            {this.props.children}
          </Content>
        </div>
      );
    } else if (this.state.authState === -1) {
      return (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: this.props.location }
          }}
        />
      );
    } else {
      return <p>Loading...</p>;
    }
  }
}

export default AuthCompont;
