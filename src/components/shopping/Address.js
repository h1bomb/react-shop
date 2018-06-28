import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { List, Button, Radio, Card } from "antd";
import Popform from "../base/PopForm";
import Loading from "../base/Loading";
const RadioGroup = Radio.Group;
const { Meta } = Card;

const USER_ADDRESSES = gql`
  query userAddresses {
    userAddresses {
      id
      mobile
      receiver
      address
    }
  }
`;

const SAVE_ADDRESS = gql`
  mutation saveAddress($address: ADDR) {
    saveAddress(address: $address) {
      id
      mobile
      receiver
      address
    }
  }
`;

const DELETE_ADDRESS = gql`
  mutation deleteAddress($id: ID!) {
    deleteAddress(addressId: $id)
  }
`;

const AddressForm = ({ submit, item, action }) => {
  const formSet = [
    {
      key: "mobile",
      label: "Mobile",
      required: true,
      message: "Please input the mobile!"
    },
    {
      key: "address",
      label: "Address",
      required: true,
      message: "Please input the address!"
    },
    {
      key: "receiver",
      label: "Receiver",
      required: true,
      message: "Please input the receiver!"
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
    submit({ variables: { address: itemData } });
  };
  return (
    <Popform
      formSet={formSet}
      buttonText={action}
      modalTitle="Address"
      okText="OK"
      dataProc={dataProc}
      data={item}
    />
  );
};

const SaveAddress = ({ record }) => {
  const actionName = record ? "update" : "add address";
  return (
    <Mutation
      mutation={SAVE_ADDRESS}
      update={(cache, { data: { saveAddress } }) => {
        const { userAddresses } = cache.readQuery({ query: USER_ADDRESSES });
        let newUserAddresses = userAddresses.map(val => {
          if (val.id === saveAddress.id) {
            return saveAddress;
          } else {
            return val;
          }
        });
        if (!record) {
          newUserAddresses = [...userAddresses, saveAddress];
        }
        cache.writeQuery({
          query: USER_ADDRESSES,
          data: { userAddresses: newUserAddresses }
        });
      }}
    >
      {(saveAddress, { loading, error }) => (
        <div style={{ display: "inline" }}>
          <AddressForm submit={saveAddress} item={record} action={actionName} />
          <Loading loading={loading} error={error} />
        </div>
      )}
    </Mutation>
  );
};

const DeleteAddress = prams => (
  <Mutation
    mutation={DELETE_ADDRESS}
    update={cache => {
      const { userAddresses } = cache.readQuery({ query: USER_ADDRESSES });
      cache.writeQuery({
        query: USER_ADDRESSES,
        data: {
          userAddresses: userAddresses.filter(val => val.id !== prams.id)
        }
      });
    }}
  >
    {(deleteAddress, { loading, error }) => (
      <div style={{ display: "inline" }}>
        <Button
          style={{ display: "inline" }}
          type="danger"
          onClick={() => deleteAddress({ variables: prams })}
        >
          Delete
        </Button>
        <Loading loading={loading} error={error} />
      </div>
    )}
  </Mutation>
);

const AddressList = ({ data, defaultValue, setAddress }) => (
  <RadioGroup 
    name="addressId" 
    defaultValue={defaultValue}
    onChange={(e)=>{
      setAddress(e.target.value);
    }}
    >
    <List
      dataSource={data}
      renderItem={item => (
        <List.Item
          style={{ width: 250,float:"left",margin:5 }}
        >
          <Card
            style={{ width: 250}}
            actions={[
              <DeleteAddress id={item.id} />,
              <SaveAddress record={item} />
            ]}
          >
            <Meta
              title={
                <Radio value={item.id}>
                  {item.address}&nbsp;{item.receiver}
                </Radio>
              }
              description={item.mobile}
            />
          </Card>
        </List.Item>
      )}
    />
  </RadioGroup>
);

const Address = ({setAddress}) => (
  <Query query={USER_ADDRESSES}>
    {({ loading, error, data }) => {
      return (
        <div>
          <Loading loading={loading} error={error} />
          <SaveAddress />
          {(()=>{
            if(!loading) {
              const addrs = data.userAddresses;
              const defaultValue = addrs&&addrs.length>0&&addrs[0].id;
              setAddress(defaultValue);
              return (<AddressList setAddress={setAddress} data={data.userAddresses} defaultValue={defaultValue} />) 
            } else {
              return '';
            }
            
          })()}
        </div>
      );
    }}
  </Query>
);

export default Address;
