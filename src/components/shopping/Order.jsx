import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import Cart from './Cart';
import Address from './Address';

const SUBMIT_ORDER = gql`
  mutation submitOrder($order: ORDER) {
    submitOrder(order: $order) {
      id
    }
  }
`;

class Order extends Component {
  constructor(props) {
    super(props);
    this.addressId = '';
    this.cartIds = [];
  }

  setAddress = (value) => {
    this.addressId = value;
  };

  setCartIds = (ids) => {
    this.cartIds = ids;
  };

  render() {
    return (
      <div>
        <Address setAddress={this.setAddress} />
        <Cart setCartIds={this.setCartIds} canModify={false} />
        <Mutation
          mutation={SUBMIT_ORDER}
          update={(cache) => {
            cache.reset();
          }}
        >
          {(submitOrder, { loading, error }) => (
            <Button
              loading={loading}
              onClick={() => {
                if (error) {
                  message.error('something wrong!');
                  return;
                }
                submitOrder({
                  variables: {
                    order: {
                      addressId: this.addressId,
                      cartIds: this.cartIds,
                    },
                  },
                }).then((data) => {
                  const { history } = this.props;
                  if (data.data.submitOrder.id) {
                    message.success('order success!');
                    history.push('/orderlist');
                  }
                });
              }}
            >
              Submit
            </Button>
          )}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Order);
