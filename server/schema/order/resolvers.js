const { ObjectID } = require('mongodb');

const checkAndUpdateStock = async (Items, cartItems) => {
  const itemIds = [];
  const itemStock = {};

  cartItems.forEach((cartItem) => {
    itemStock[cartItem.item.id] = cartItem.count;
    itemIds.push(cartItem.item.id);
  });
  const items = await Items.find({ _id: { $in: itemIds } }).toArray();
  const rets = {};

  items.forEach(async (val) => {
    const count = itemStock[val._id];// eslint-disable-line
    if (val.stock > count) {
      const ret = await Items.update({ _id: val._id }, { $set: { stock: (val.stock - count) } });// eslint-disable-line
      rets[val._id] = ret.result;// eslint-disable-line
    } else {
      rets[val._id] = false;// eslint-disable-line
    }
  });

  return rets;
};

module.exports = {
  Query: {
    userOrders: async (root, data, { user, mongo: { Orders } }) => {
      if (!user) {
        return [];
      }
      const orderRet = await Orders.find({ uid: ObjectID(user._id), state: { $ne: 'caneled' } }).toArray();// eslint-disable-line
      return orderRet;
    },
    userAddresses: async (root, data, { user, mongo: { Address } }) => {
      if (!user) {
        return [];
      }
      const userAddressList = await Address.find({ uid: user._id }).toArray();// eslint-disable-line
      return userAddressList;
    },
  },
  Mutation: {
    submitOrder: async (root, data, {
      user, mongo: {
        Orders, Carts, Address, Items,
      },
    }) => {
      if (!user) {
        return 0;
      }
      const { order } = data;
      const cartIds = order.cartIds.map(val => ObjectID(val));
      const cartItems = await Carts.find({ _id: { $in: cartIds } }).toArray();
      const address = await Address.findOne({ _id: ObjectID(order.addressId) });
      let total = 0;
      const orderItems = [];
      cartItems.forEach((v) => {
        total += v.item.price * v.count;
        orderItems.push({
          id: v.item.id,
          name: v.item.name,
          cover: v.item.cover,
          price: v.item.price,
          count: v.count,
        });
      });

      const orderObj = {
        uid: user._id,// eslint-disable-line
        address,
        items: orderItems,
        description: order.description,
        total,
      };
      const response = await Orders.insert(orderObj);
      if (response.insertedIds[0]) {
        const ret = await Carts.deleteMany({ uid: user._id });// eslint-disable-line
        checkAndUpdateStock(Items, cartItems);
      }

      return Object.assign(
        {
          id: response.insertedIds[0],
        },
        orderObj,
      );
    },
    cancelOrder: async (root, data, { user, mongo: { Orders } }) => {
      if (!user) {
        return '';
      }
      const ret = await Orders.update(
        { uid: user._id, _id: ObjectID(data.orderId) },// eslint-disable-line
        { $set: { state: 'caneled' } },
      );
      if (ret.result.nModified > 0) {
        return data.orderId;
      }
      return '';
    },
    saveAddress: async (root, data, { user, mongo: { Address } }) => {
      if (!user) {
        return null;
      }

      const { address } = data;
      const addressId = (address.id ? ObjectID(address.id) : ObjectID());
      const condition = { _id: addressId, uid: user._id };// eslint-disable-line
      delete address.id;
      await Address.update(
        condition,
        { ...address, uid: user._id },// eslint-disable-line
        { upsert: true },
      );
      const addressObj = await Address.findOne(condition);
      return addressObj;
    },
    deleteAddress: async (root, data, { user, mongo: { Address } }) => {
      if (!user) {
        return 0;
      }
      const response = await Address.deleteOne({
        _id: ObjectID(data.addressId),
        uid: user._id,// eslint-disable-line
      });

      if (response.deletedCount === 1) {
        return data.addressId;
      }
      return response.deletedCount;
    },
  },
  Address: {
    id: root => root._id || root.id,// eslint-disable-line
  },
  Order: {
    id: root => root._id || root.id,// eslint-disable-line
  },
};
