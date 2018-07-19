import React from 'react';
import { Card } from 'antd';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const CURUSER = gql`
  {
    curUser {
      email
      password
      id
    }
  }
`;
export default () => (
  <Card title="User Profile" style={{ width: 300 }}>
    <Query query={CURUSER}>
      {({ loading, error, data }) => {
        if (loading) return '';
        if (error) return `Error! ${error.message}`;
        return (
          <div>
            <p>
              {data.curUser.email}
            </p>
            <p>
              {data.curUser.password}
            </p>
          </div>
        );
      }}
    </Query>
  </Card>
);
