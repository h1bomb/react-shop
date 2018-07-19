import React, { Component } from 'react';
import {
  Form, Icon, Input, Button, message,
} from 'antd';
import { Redirect, Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import './index.css';
import { connect } from 'react-redux';
import { SET_AUTHSATAE } from '../../actions';

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
    redirectToReferrer: false,
  };

  handleSubmit = (e, signIn) => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        signIn({ variables: { email: values } }).then(({ data }) => {
          if (data.signinUser.user) {
            message.info('Sign in!');
            dispatch({ type: SET_AUTHSATAE });
            this.setState({ redirectToReferrer: true });
          } else {
            message.error('Sign fail!');
          }
        });
      }
    });
  };

  render() {
    const { form, location } = this.props;
    const { getFieldDecorator } = form;
    const { from } = location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <Mutation mutation={SIGNIN_USER}>
        {(signinUser, { loading }) => (
          <Form
            onSubmit={(e) => {
              this.handleSubmit(e, signinUser);
            }}
            className="login-form"
          >
            <FormItem>
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'Please input your username!' },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Email"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="Password"
                />,
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
              Or
              {' '}
              <Link to="/register">
register now!
              </Link>
            </FormItem>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default connect()(Form.create()(NormalLoginForm));
