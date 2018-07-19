import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import {
  Card, Collapse, Spin, message, Button,
} from 'antd';
import { CartList } from './Cart';

const ORDER_LIST = gql`
  query userOrders {
    userOrders {
      id
      address {
        receiver
        mobile
        address
      }
      description
      items {
        id
        name
        cover
        price
        count
      }
      total
    }
  }
`;

const CANCEL_ORDER = gql`
  mutation cancelOrder($orderId: ID) {
    cancelOrder(orderId: $orderId)
  }
`;

const OrderItems = ({ items }) => (
  <Collapse defaultActiveKey={items.map(item => item.id)}>
    {items.map(item => (
      <Collapse.Panel
        header={(
          <span>
Order ID:
            {item.id}
            <CancelOrder orderId={item.id} />
          </span>
)}
        key={item.id}
      >
        <Card title="Address Detail">
          <p>
receiver:
            {item.address.receiver}
          </p>
          <p>
mobile:
            {item.address.mobile}
          </p>
          <p>
address:
            {item.address.address}
          </p>
        </Card>
        {(() => {
          const data = item.items.map(val => ({
            item: val,
            itemId: val.id,
            count: val.count,
          }));
          return <CartList data={data} canModify={false} />;
        })()}
      </Collapse.Panel>
    ))}
  </Collapse>
);

const OrderList = () => (
  <Query query={ORDER_LIST} fetchPolicy="network-only">
    {({ loading, error, data }) => {
      if (loading) {
        return <Spin />;
      }
      if (error) {
        message.error('Something Wrong!');
        return '';
      }
      return <OrderItems items={data.userOrders} />;
    }}
  </Query>
);

const CancelOrder = ({ orderId }) => (
  <Mutation
    mutation={CANCEL_ORDER}
    update={
        (cache) => {
          const { userOrders } = cache.readQuery({ query: ORDER_LIST });
          cache.writeQuery({
            query: ORDER_LIST,
            data: {
              userOrders: userOrders.filter(val => val.id !== orderId),
            },
          });
        }
     }
  >
    {(submitOrder, { loading, error }) => (
      <Button
        style={{ float: 'right', margin: '-5px 5px 0 0' }}
        type="danger"
        loading={loading}
        onClick={() => {
          if (error) {
            message.error('something wrong!');
          }
          submitOrder({
            variables: {
              orderId,
            },
          }).then((data) => {
            if (data.cancelOrder) {
              message.success('cancel order success!');
            }
          });
        }}
      >
Cancel Order

      </Button>
    )}
  </Mutation>
);

export default OrderList;
