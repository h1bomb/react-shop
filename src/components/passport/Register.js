import React, { Component } from "react";
import { Form, Input, Button, message } from "antd";
import { Redirect } from "react-router-dom";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const FormItem = Form.Item;

const REGISTER = gql`
  mutation createUser($email: AUTH_PROVIDER_EMAIL!) {
    createUser(email: $email) {
      id
      email
    }
  }
`;

class NormalRegisterForm extends Component {
  state = {
    redirectToReferrer: false
  };

  handleSubmit = (e, register) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const email = {
          email: values.email,
          password: values.password
        };
        register({ variables: { email } }).then(({ data }) => {
          if (data.createUser.email) {
            message.info("Register Success!");
            this.setState({ redirectToReferrer: true });
          } else {
            message.error("Register fail!");
          }
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { from } = { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <Mutation mutation={REGISTER}>
        {(createUser, { loading, error }) => (
          <Form
            style={{ maxWidth: 500, margin: "0 auto" }}
            onSubmit={e => {
              this.handleSubmit(e, createUser);
            }}
          >
            <FormItem {...formItemLayout} label="E-mail">
              {getFieldDecorator("email", {
                rules: [
                  {
                    type: "email",
                    message: "The input is not valid E-mail!"
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!"
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Password">
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: "Please input your password!"
                  },
                  {
                    validator: this.validateToNextPassword
                  }
                ]
              })(<Input type="password" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Confirm Password">
              {getFieldDecorator("confirm", {
                rules: [
                  {
                    required: true,
                    message: "Please confirm your password!"
                  },
                  {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </FormItem>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Form.create()(NormalRegisterForm);
