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
      let { item } = data;
      if (!item.id) {
        response = await Items.insert(item);
        return Object.assign(
          {
            id: response.insertedIds[0]
          },
          item
        );
      } else {
        response = await Items.updateOne(
          { _id: ObjectID(item.id) },
          {
            $set: {
              name: item.name,
              cover: item.cover,
              description: item.description,
              stock: item.stock,
              price: item.price
            }
          }
        );
        if (response.modifiedCount === 0) {
          return { id: 0, cover: "", description: "", stock: 0, price:0 };
        }
        return data.item;
      }
    },
    deleteItem: async (root, data, { mongo: { Items } }) => {
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
