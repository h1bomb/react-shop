import React from "react";
import { Card, Button, message } from "antd";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import Loading from "../base/Loading";
const { Meta } = Card;

const ITEM_LIST = gql`
  query itemList($id: ID) {
    itemList(id: $id) {
      id
      name
      cover
      price
      description
    }
  }
`;

const SAVE_CART_ITEM = gql`
  mutation saveCartItem($cartItem: CARTITEM) {
    saveCartItem(cartItem: $cartItem) {
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

const AddToCart = ({ id }) => {
  return (
    <Mutation mutation={SAVE_CART_ITEM}>
      {(saveCartItem, { loading, error }) => (
        <div>
          <Button
            onClick={() => {
              const savePr = saveCartItem({
                variables: { cartItem: { itemId: id, count: 1 } }
              });
              savePr.then(data => {
                message.success("add success!");
              });
            }}
          >
            Add To Cart
          </Button>
          <Loading loading={loading} error={error} />
        </div>
      )}
    </Mutation>
  );
};

const Detail = ({ detail }) => (
  <Card
    style={{ width: 320, margin: "0 auto" }}
    hoverable
    cover={<img alt={detail.name} src={detail.cover} />}
  >
    <Meta title={detail.name} description={`￥${detail.price}.00`} />
    <p>{detail.description} </p>
    <AddToCart id={detail.id} />
  </Card>
);

const DetailPanel = ({ computedMatch }) => (
  <Query query={ITEM_LIST} variables={{ id: computedMatch.params.id }}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      return <Detail detail={data.itemList[0]} />;
    }}
  </Query>
);

export default DetailPanel;
