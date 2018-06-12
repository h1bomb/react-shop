import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import client from "../../util/client";
import Logout from "../passport/Logout";
import gql from "graphql-tag";

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
        fetchPolicy: 'no-cache'
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
          <Logout {...this.props} curUser={this.state.curUser} />
          {this.props.children}
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
