const { ObjectID } = require("mongodb");

module.exports = {
  Query: {
    itemList: async (root, data, { mongo: { Items } }) => {
      let query = {};
      data.id && (query._id = ObjectID(data.id));
      data.name && (query.name = ObjectID(data.name));

      return await Items.find(query).toArray();
    }
  },
  Mutation: {
    saveItem: async (root, data, { mongo: { Items } }) => {
      let response;
      if (!data.id) {
        response = await Items.insert(data.item);
        return Object.assign(
          {
            id: response.insertedIds[0]
          },
          data.item
        );
      } else {
        response = await Items.update({
          name: item.name,
          cover: item.cover,
          description: item.description,
          stock: item.stock
        }, { _id: item.id });
        console.log(response);
        return data.item;
      }

    },
    deleteItem: async (root, data, { req, mongo: { Items } }) => {
      const response = await Items.deleteOne({
        _id: ObjectID(data.id)
      });
      if (response.deletedCount === 1) {
        return data.id;
      } else {
        return response.deletedCount;
      }
    }
  },
  Item: {
    id: root => root._id || root.id
  }
};
