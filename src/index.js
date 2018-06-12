import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./components/App";
import Passport from "./components/passport";
import Profile from "./components/passport/Profile";
import Register from "./components/passport/Register";
import AuthCompont from "./components/base/AuthCompont";
import registerServiceWorker from "./registerServiceWorker";
import { Layout } from "antd";
import { ApolloProvider } from "react-apollo";
import client from "./util/client";

const { Content } = Layout;

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
            <Route path="/register" component={Register} />
            <Route path="/login" component={Passport} />
            <AuthCompont exact isPublic="true" path="/" component={App} />
            <AuthCompont exact path="/profile" component={Profile} />
          </Switch>
        </Content>
      </Layout>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
registerServiceWorker();
