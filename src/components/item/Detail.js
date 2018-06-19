import React from "react";
import { Card, Button } from "antd";
import { Query } from "react-apollo";
import gql from "graphql-tag";
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

const Detail = ({ detail }) => (
  <Card
    style={{width: 320, margin:"0 auto"}}
    hoverable
    cover={<img alt={detail.name} src={detail.cover} />}
  >
    <Meta title={detail.name} description={`￥${detail.price}.00`} />
    <p>{detail.description} </p>
    <Button>Add To Cart</Button>
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
