const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./resolvers");

// The GraphQL schema in string form
const typeDefs = `
    type Query {
        allUsers: [User!]!
    }
    type Mutation {
        createUser(email: AUTH_PROVIDER_EMAIL!): User
        signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
    }
  
    type User {
        id: ID!
        email: String
        password: String!
    }

    type SigninPayload {
        token: String
        user: User
    }

    input AUTH_PROVIDER_EMAIL {
        email: String!
        password: String!
    }
`;

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// 根据所有类型来生成模式对象
module.exports = schema;
