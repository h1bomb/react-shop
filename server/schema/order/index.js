const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./resolvers");

// The GraphQL schema in string form
const typeDefs = `
    type Query {
        userOrders: [Order!]!
        userAddresses(uid: ID): [Address!]!
    }
    type Mutation {
        submitOrder(order: ORDER): Order
        saveAddress(address: ADDR): Address
        deleteAddress(addressId: ID!): ID!
    }

    input ADDR {
        id: ID
        mobile: String!
        receiver: String!
        address: String!
    }
   
    input ORDER {
        id: ID
        addressId: ID!
        description: String
        cartIds: [ID!]! 
    }

    type Address {
        id: ID!
        mobile: String!
        receiver: String!
        address: String!
    }

    type Order {
        id: ID!
        address: Address!
        description: String
        items: [OrderItem!]!
        total: Int!
    }

    type OrderItem {
        id: ID!
        name: String!
        cover: String!
        price: Int!
        count: Int!
    }
`;

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// 根据所有类型来生成模式对象
module.exports = schema;
