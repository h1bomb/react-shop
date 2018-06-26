import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { List, Avatar, Button } from "antd";
import { Link } from "react-router-dom";
import Loading from "../base/Loading";
import Cart from "../shopping/Cart";
import Address from "../shopping/Address";

const Order = ()=> {
    return (<div>
        <Address />
        <Cart showDelete = {false}/>
        <Button>Submit</Button>
    </div>)
}

export default Order;
