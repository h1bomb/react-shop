import React, { Component } from "react";
import { Button, message } from "antd";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const SIGNOUT = gql`
  mutation signoutUser {
    signoutUser(input: "")
  }
`;

class Logout extends Component {
  render() {
    const { curUser } = this.props;

    return (
      <Mutation mutation={SIGNOUT}>
        {(signoutUser, { loading, error }) => {
          if (error) {
            message.error(`Error! ${error.message}`);
          }

          if (!curUser.email) {
            return "";
          }
          return (
            <div>
              {curUser.email}
              <Button
                type="primary"
                loading={loading}
                onClick={e => {
                  signoutUser().then(() => {
                    window.location.reload();
                  });
                }}
              >
                Log out
              </Button>
            </div>
          );
        }}
      </Mutation>
    );
  }
}
export default Logout;
