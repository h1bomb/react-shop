const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./resolvers");

const typeDefs = `
    type Query {
        itemList(id: ID,name: String): [Item!]!
    }
    type Mutation {
        saveItem(item: ITEM): Item!
        deleteItem(id: ID!): String
    }
   
    input ITEM {
        id: ID
        name: String!
        cover: String!
        description: String!
        stock: Int
        price: Int
    }

    type Item {
        id: ID!
        name: String!
        cover: String!
        description: String!
        stock: Int
        price: Int
    }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;
