const { ObjectID } = require("mongodb");

module.exports = {
  Query: {
    userOrders: async (root, data, { user, mongo: { Orders } }) => {
      if (!user) {
        return [];
      }
      return await Orders.find({ uid: ObjectID(user._id) }).toArray();
    },
    addresses: async (root, data, { user,mongo: { Address } }) => {
      if (!user) {
        return [];
      }
      return await Address.find({ uid: user._id }).toArray();
    }
  },
  Mutation: {
    submitOrder: async (root, data, { user, mongo: { Orders, Carts, Address } }) => {
      if (!user) {
        return 0;
      }
      const {order} = data;
      const cartIds = order.cartIds.map(val => ObjectID(val));
      const cartItems = await Carts.find({ _id: { $in: cartIds } }).toArray();
      const address = await Address.findOne({ _id: ObjectID(order.addressId) });
      let total = 0;
      let orderItems = [];
      cartItems.forEach(v => {
        total += v.item.price * v.count;
        orderItems.push({
          id: v.item.id,
          name: v.item.name,
          cover: v.item.cover,
          price: v.item.price,
          count: v.count
        });
      });

      let orderObj = {
        uid: user._id,
        address,
        items: orderItems,
        description: order.description,
        total
      };
      const response = await Orders.insert(orderObj);
      return Object.assign(
        {
          id: response.insertedIds[0]
        },
        orderObj
      );

    },
    saveAddress: async (root, data, { user, mongo: { Address } }) => {
      if (!user) {
        return null;
      }
      
      const { address } = data;
      addressId = (address.id ? address.id : ObjectID());
      const condition = { _id: addressId, uid: user._id };
      await Address.update(
        condition,
        {...address, uid: user._id},
        { upsert: true }
      );

      return await Address.findOne(condition);
    },
    deleteAddress: async (root, data, {user, mongo: { Address } }) => {
      if(!user) {
        return 0;
      }
      const response = await Address.deleteOne({
        _id: ObjectID(data.addressId),
        uid: user._id
      });
      
      if (response.deletedCount === 1) {
        return data.addressId;
      } else {
        return response.deletedCount;
      }
    }
  },
  Address: {
    id: root => root._id || root.id
  },
  Order: {
    id: root => root._id || root.id
  }
};
