import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Button } from "antd";
import Loading from "../base/Loading";
import Cart from "../shopping/Cart";
import Address from "../shopping/Address";

const SUBMIT_ORDER = gql`
  mutation submitOrder($order: ORDER) {
    submitOrder(order: $order) {
      id
    }
  }
`;


class Order extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addressId:0,
            cartIds:[]
        }
        this.lala = '';
    }

    setAddress = (value) => {
        // this.setState({
        //     addressId: value
        // });
        this.lala = value;
        console.log("lala:"+this.lala);
    }

    setCartIds = (ids)=>{
        this.setState({
            cartIds: ids
        });
    }

    render() {
    return (<div>
        <Address setAddress={this.setAddress}  />
        <Cart setCartIds={this.setCartIds} canModify = {false}/>
        <Button onClick={()=>{console.log(this.lala)}}>Submit</Button>
    </div>)
    }
}

export default Order;
