import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./components/App";
import Passport from "./components/passport";
import Profile from "./components/passport/Profile";
import PrivateRoute from "./components/base/PrivateRoute";
import registerServiceWorker from "./registerServiceWorker";
import { Layout } from "antd";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
const { Content } = Layout;

const client = new ApolloClient({
    uri: "http://localhost:3001/graphql"
});



ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <Layout className="layout" style={{ height: "100%" }}>
        <Content
          style={{
            background: "#fff",
            padding: 24,
            margin: 50,
            minHeight: 280
          }}
        >
          <Switch>
            <Route path="/login" component={Passport} />
            <Route exact path="/" component={App} />
            <PrivateRoute exact path="/profile" component={Profile} />
          </Switch>
        </Content>
      </Layout>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
registerServiceWorker();
