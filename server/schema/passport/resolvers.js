module.exports = {
  Query: {
    allUsers: async (root, data, { mongo: { Users } }) => {
      const users = await Users.find({}).toArray();
      return users;
    },
    curUser: async (root, data, { user }) => {
      if (user) {
        return user;
      }
      return {
        password: '',
        id: '',
        email: '',
      };
    },
  },
  Mutation: {
    createUser: async (root, data, { req, mongo: { Users } }) => {
      const newUser = {
        email: data.email.email,
        password: data.email.password,
      };
      const response = await Users.insert(newUser);
      req.cookies.set('token', response.insertedIds[0]);
      return Object.assign(
        {
          id: response.insertedIds[0],
        },
        newUser,
      );
    },
    signinUser: async (root, data, { req, mongo: { Users } }) => {
      const user = await Users.findOne({
        email: data.email.email,
      });
      if (user && data.email.password === user.password) {
        req.cookies.set('token', user._id);// eslint-disable-line
        return {
          token: `token-${user._id}`,// eslint-disable-line
          user,
        };
      }
      return {
        token: '',
      };
    },
    signoutUser: (root, data, { req, user }) => {
      if (user) {
        req.cookies.set('token', null);
      }
      return '';
    },
  },
  User: {
    // Convert the "_id" field from MongoDB to "id" from the schema.
    id: root => root._id || root.id,// eslint-disable-line
  },
};
