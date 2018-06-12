// src/App.js
import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
const ALLUSERS = gql`
  {
    allUsers {
      email
      password
      id
    }
  }
`;
class App extends Component {
  render() {
    return (
      <div className="App">
        <Query query={ALLUSERS}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            return (
              <ul>
                {data.allUsers.map(user => (
                  <li key={user.id}>
                    {user.email}
                  </li>
                ))}
              </ul>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default App;
