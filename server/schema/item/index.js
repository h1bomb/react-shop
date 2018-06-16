const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./resolvers");

// The GraphQL schema in string form
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
    }

    type Item {
        id: ID!
        name: String!
        cover: String!
        description: String!
        stock: Int
    }
`;

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// 根据所有类型来生成模式对象
module.exports = schema;
