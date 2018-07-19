import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import {
  List, Avatar, Button, Row, Col,
} from 'antd';
import { Link } from 'react-router-dom';
import Loading from '../base/Loading';

const USER_CART_LIST = gql`
  query userCartList {
    userCartList {
      id
      itemId
      item {
        name
        cover
        price
      }
      count
    }
  }
`;

const DELETE_CART_ITEM = gql`
  mutation deleteCartItem($id: ID!) {
    deleteCartItem(id: $id)
  }
`;

export const CartList = ({ data, canModify }) => (
  <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={item => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={item.item.cover} />}
          title={(
            <Link to={`/item/${item.itemId}`}>
              {item.item.name}
            </Link>
)}
          description={`￥${item.item.price}.00`}
        />
        <p style={{ lineHeight: '32px', marginRight: '10px' }}>
          {item.count}
        </p>
        {(() => {
          if (canModify) {
            return <DeleteCartItem id={item.itemId} />;
          }
          return null;
        })()}
      </List.Item>
    )}
  />
);

const Cart = ({ canModify = true, setCartIds }) => (
  <Query query={USER_CART_LIST} fetchPolicy="network-only">
    {({ loading, error, data }) => {
      if (setCartIds && data.userCartList) {
        setCartIds(data.userCartList.map(val => val.id));
      }
      return (
        <div>
          <Loading loading={loading} error={error} />
          <CartList data={data.userCartList} canModify={canModify} />
          {(() => {
            if (canModify && data.userCartList && data.userCartList.length > 0) {
              return (
                <Row>
                  <Col span={2} offset={22}>
                    <Link to="/order">
                      <Button>
Order
                      </Button>
                    </Link>
                  </Col>
                </Row>
              );
            }
            return null;
          })()}
        </div>
      );
    }}
  </Query>
);

const DeleteCartItem = prams => (
  <Mutation
    mutation={DELETE_CART_ITEM}
    update={(cache) => {
      const { userCartList } = cache.readQuery({ query: USER_CART_LIST });
      cache.writeQuery({
        query: USER_CART_LIST,
        data: {
          userCartList: userCartList.filter(val => val.itemId !== prams.id),
        },
      });
    }}
  >
    {(deleteCartItem, { loading, error }) => (
      <div style={{ display: 'inline' }}>
        <Button
          style={{ display: 'inline' }}
          type="danger"
          onClick={() => deleteCartItem({ variables: prams })}
        >
          Delete
        </Button>
        <Loading loading={loading} error={error} />
      </div>
    )}
  </Mutation>
);

export default Cart;
