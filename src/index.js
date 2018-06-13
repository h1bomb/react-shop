import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import App from "./components/App";
import Passport from "./components/passport";
import Profile from "./components/passport/Profile";
import Register from "./components/passport/Register";
import AuthCompont from "./components/base/AuthCompont";
import registerServiceWorker from "./registerServiceWorker";
import { Layout, Menu } from "antd";
import { ApolloProvider } from "react-apollo";
import client from "./util/client";
const { Header, Content, Footer } = Layout;

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <Layout className="layout" style={{ height: "100%" }}>
        <Header>
          <img
            alt="logo"
            style={{ width: 31, height: 31, float: "left",margin: "16px 24px 16px 0" }}
            src="img/shop.png"
          />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="1"><Link to="/">index</Link></Menu.Item>
            <Menu.Item key="2"><Link to="/profile">profile</Link></Menu.Item>
          </Menu>
        </Header>
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
        <Footer style={{ textAlign: "center" }}>
          React Shop ©2016 Created by Hbomb
        </Footer>
      </Layout>
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
registerServiceWorker();
