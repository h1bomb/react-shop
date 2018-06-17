import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import AuthCompont from "./AuthCompont";
import { Layout } from "antd";
import { ApolloProvider } from "react-apollo";
import client from "../../util/client";
const { Footer } = Layout;

export default ({ routes }) => (
  <ApolloProvider client={client}>
    <Router>
      <Layout className="layout">
        <Switch>
          {routes.map(route => (
            <AuthCompont
              key = {route.path}
              isPublic={route.isPublic}
              path={route.path}
              component={route.component}
            />
          ))}
        </Switch>
        <Footer style={{ textAlign: "center" }}>
          React Shop ©2016 Created by Hbomb
        </Footer>
      </Layout>
    </Router>
  </ApolloProvider>
);
