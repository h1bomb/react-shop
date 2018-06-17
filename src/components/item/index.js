import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Table, Button, Spin, message } from "antd";
import Popform from "../base/PopForm";

const ITEM_LIST = gql`
  query itemList {
    itemList {
      id
      name
      description
      cover
      stock
      price
    }
  }
`;

const DELETE_ITEM = gql`
  mutation deleteItem($id: ID!) {
    deleteItem(id: $id)
  }
`;

const SAVE_ITEM = gql`
  mutation saveItem($item: ITEM) {
    saveItem(item: $item) {
      id
      name
      description
      cover
      stock
      price
    }
  }
`;

const Loading = ({ loading, error }) => (
  <div>
    {loading && <Spin />}
    {error && message.error(":( Please try again")}
  </div>
);

const ItemForm = ({ submit, item, action }) => {
  const formSet = [
    {
      key: "name",
      label: "Name",
      required: true,
      message: "Please input the name!"
    },
    {
      key: "cover",
      label: "Cover",
      required: true,
      message: "Please input the cover!"
    },
    {
      key: "description",
      label: "Description",
      required: true,
      message: "Please input the description!"
    },
    {
        key: "price",
        label: "Price",
        required: true,
        type: "number",
        message: "Please input the price!"
      },
    {
      key: "stock",
      label: "Stock",
      required: true,
      type: "number",
      message: "Please input the stock!"
    }
  ];

  const dataProc = data => {
    let itemData = data;
    if (item) {
      itemData = {
        ...item,
        ...data
      };
    }
    delete itemData.__typename;
    submit({ variables: { item: itemData } });
  };
  return (
    <Popform
      formSet={formSet}
      buttonText={action}
      modalTitle="Item"
      okText="OK"
      dataProc={dataProc}
      data={item}
    />
  );
};

const SaveItem = ({ record }) => {
  const actionName = record ? "update" : "add item";
  return (
    <Mutation
      mutation={SAVE_ITEM}
      update={(cache, { data: { saveItem } }) => {
        const { itemList } = cache.readQuery({ query: ITEM_LIST });
        let newItemList = itemList.map(val => {
          if (val.id === saveItem.id) {
            return saveItem;
          } else {
            return val;
          }
        });
        if (!record) {
          newItemList = [...itemList, saveItem];
        }
        cache.writeQuery({
          query: ITEM_LIST,
          data: { itemList: newItemList }
        });
      }}
    >
      {(saveItem, { loading, error }) => (
        <div style={{ display: "inline" }}>
          <ItemForm submit={saveItem} item={record} action={actionName} />
          <Loading loading={loading} error={error} />
        </div>
      )}
    </Mutation>
  );
};

const DeleteItem = prams => (
  <Mutation
    mutation={DELETE_ITEM}
    update={cache => {
      const { itemList } = cache.readQuery({ query: ITEM_LIST });
      cache.writeQuery({
        query: ITEM_LIST,
        data: { itemList: itemList.filter(val => val.id !== prams.id) }
      });
    }}
  >
    {(deleteItem, { loading, error }) => (
      <div style={{ display: "inline" }}>
        <Button
          style={{ display: "inline" }}
          type="danger"
          onClick={() => deleteItem({ variables: prams })}
        >
          Delete
        </Button>
        <Loading loading={loading} error={error} />
      </div>
    )}
  </Mutation>
);

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "cover",
    dataIndex: "cover",
    key: "cover",
    render: text => <img width="50" height="50" alt={text} src={text} />
  },
  {
    title: "description",
    dataIndex: "description",
    key: "description"
  },
  {
    title: "price",
    dataIndex: "price",
    key: "price",
    width:80
  },
  {
    title: "stock",
    dataIndex: "stock",
    key: "stock",
    width:80
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <span>
        <DeleteItem id={record.id} />
        <SaveItem record={record} />
      </span>
    )
  }
];

const Items = () => (
  <Query query={ITEM_LIST}>
    {({ loading, error, data }) => {
      return (
        <div>
          <Loading loading={loading} error={error} />
          <Table
            columns={columns}
            rowKey="id"
            dataSource={data && data.itemList}
          />
        </div>
      );
    }}
  </Query>
);

const ItemsPanel = () => {
  return (
    <div>
      <SaveItem />
      <Items />
    </div>
  );
};
export default ItemsPanel;
