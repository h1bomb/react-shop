const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./resolvers");

// The GraphQL schema in string form
const typeDefs = `
    type Query {
        cartList: [CartItem]
    }
    type Mutation {
        saveCartItem(cartItem: CARTITEM): CartItem!
        deleteCartItem(id: ID!): String
    }
   
    input CARTITEM {
        itemId: ID
        count: Int
    }

    type CartItem {
        id: ID
        uid: ID!
        itemId: ID!
        item: LessItem!
        count: Int!
    }

    type LessItem {
        id: ID!
        name: String!
        cover: String!
        price: Int
    }
`;

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// 根据所有类型来生成模式对象
module.exports = schema;
