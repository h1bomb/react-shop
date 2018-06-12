module.exports = {
  Query: {
    allUsers: async (root, data, { mongo: { Users } }) => {
      return await Users.find({}).toArray();
    },
    curUser: async (root, data, { user }) => {
      if (user) {
        return user;
      } else {
        return {
          password: "",
          id: "",
          email: ""
        };
      }
    }
  },
  Mutation: {
    createUser: async (root, data, { mongo: { Users } }) => {
      console.log(data);
      const newUser = {
        email: data.email.email,
        password: data.email.password
      };
      const response = await Users.insert(newUser);
      return Object.assign(
        {
          id: response.insertedIds[0]
        },
        newUser
      );
    },
    signinUser: async (root, data, { req, mongo: { Users } }) => {
      let user = await Users.findOne({
        email: data.email.email
      });
      if (user && data.email.password === user.password) {
        req.cookies.set("token", user._id);
        return {
          token: `token-${user._id}`,
          user
        };
      } else {
        return {
          token: ""
        };
      }
    },
    signoutUser: (root, data, { req, user }) => {
      if (user) {
        req.cookies.set("token", null);
      }
      return "";
    }
  },
  User: {
    // Convert the "_id" field from MongoDB to "id" from the schema.
    id: root => root._id || root.id
  }
};
