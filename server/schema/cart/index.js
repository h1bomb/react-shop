const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./resolvers");

// The GraphQL schema in string form
const typeDefs = `
    type Query {
        userCartList: [CartItem]
    }
    type Mutation {
        saveCartItem(cartItem: CARTITEM): SaveRet
        deleteCartItem(id: ID!): String
    }

    type SaveRet {
        cartItem: CartItem
        message: String
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
