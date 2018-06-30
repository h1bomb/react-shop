import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Card, Collapse, Spin, message } from "antd";
import { CartList } from "./Cart";
const Panel = Collapse.Panel;

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

const OrderItems = ({ items }) => (
  <Collapse defaultActiveKey={items.map(item => item.id)}>
    {items.map(item => (
      <Panel header={`Order ID:${item.id}`} key={item.id}>
        <Card title="Address Detail">
          <p>receiver:{item.address.receiver}</p>
          <p>mobile:{item.address.mobile}</p>
          <p>address:{item.address.address}</p>
        </Card>
        {(() => {
          const data = item.items.map(val => ({
            item: val,
            itemId: val.id,
            count: val.count
          }));
          return <CartList data={data} canModify={false} />;
        })()}
      </Panel>
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
        message.error("Something Wrong!");
        return "";
      }
      return <OrderItems items={data.userOrders} />;
    }}
  </Query>
);

export default OrderList;
