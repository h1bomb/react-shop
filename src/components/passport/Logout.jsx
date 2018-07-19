import React, { Component } from 'react';
import { Button, message } from 'antd';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

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
            return '';
          }
          return (
            <div style={{ float: 'right', color: '#fff' }}>
              {curUser.email}
              <Link to="/cart">
                <Button
                  style={{ marginLeft: 10 }}
                  type="primary"
                  icon="shopping-cart"
                >
                  Cart
                </Button>
              </Link>
              <Button
                style={{ marginLeft: 10 }}
                type="primary"
                icon="logout"
                loading={loading}
                onClick={() => {
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
