import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Card } from 'antd';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const ITEM_LIST = gql`
  query itemList {
    itemList {
      id
      name
      cover
      price
    }
  }
`;

class App extends Component {
  render() {
    return (
      <div className="App" style={{ display: 'inline-block' }}>
        <Query query={ITEM_LIST}>
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;

            return <Items items={data.itemList} />;
          }}
        </Query>
      </div>
    );
  }
}

const Items = ({ items }) => items.map(item => (
  <Link to={`/item/${item.id}`} key={item.id}>
    <Card
      hoverable
      style={{ width: 240, margin: 20, float: 'left' }}
      cover={<img alt={item.name} title={item.name} src={item.cover} />}
    >
      <Meta title={item.name} description={`￥${item.price}.00`} />
    </Card>
  </Link>
));

export default App;
