import React, { Component } from "react";
import { Form, Icon, Input, Button, message } from "antd";
import { Redirect } from "react-router-dom";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import "./index.css";
import {fakeAuth} from "../base/PrivateRoute";

const FormItem = Form.Item;

const SIGNIN_USER = gql`
  mutation siginUser($email: AUTH_PROVIDER_EMAIL!) {
    signinUser(email: $email) {
      user {
        id
        email
      }
      token
    }
  }
`;

class NormalLoginForm extends Component {
  state = {
    redirectToReferrer: false
  };

  handleSubmit = (e, signIn) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        signIn({ variables: { email: values } }).then(({data}) => {
          if(data.signinUser.user) {
            message.info('Sign in!');
            fakeAuth.authenticate(() => {
              this.setState({ redirectToReferrer: true });
            });
          } else {
            message.error('Sign fail!');
          }
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <Mutation mutation={SIGNIN_USER}>
        {(signinUser, { data, loading, error }) => (
          <Form
            onSubmit={e => {
              this.handleSubmit(e, signinUser);
            }}
            className="login-form"
          >
            <FormItem>
              {getFieldDecorator("email", {
                rules: [
                  { required: true, message: "Please input your username!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Email"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: "Please input your Password!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
              >
                Log in
              </Button>
              Or <a href="">register now!</a>
            </FormItem>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Form.create()(NormalLoginForm);
