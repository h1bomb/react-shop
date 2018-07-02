const { ObjectID } = require("mongodb");

const checkAndUpdateStock = async (Items,cartItems) =>{
  const itemIds = [];
  const itemStock = {};

  cartItems.forEach(cartItem=>{
    itemStock[cartItem.item.id] = cartItem.item.count;
    itemIds.push(cartItem.item.id);
  });

  const items =  await Items.find({ _id: {$in: itemIds}});
  const rets = {};

  items.forEach(val => {
    const count = itemStock[val._id];
    if(val.stock > stock) {
      const ret = await Items.update({_id: val._id},{$set: {stock:(val.stock - count)}});
      rets[val._id] = ret.result;
    }
  });

  return rets;
}

module.exports = {
  Query: {
    userOrders: async (root, data, { user, mongo: { Orders } }) => {
      if (!user) {
        return [];
      }
      return await Orders.find({ uid: ObjectID(user._id),state : { $ne : 'caneled' }  }).toArray();
    },
    userAddresses: async (root, data, { user,mongo: { Address } }) => {
      if (!user) {
        return [];
      }
      return await Address.find({ uid: user._id }).toArray();
    }
  },
  Mutation: {
    submitOrder: async (root, data, { user, mongo: { Orders, Carts, Address, Items } }) => {
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
      if(response.insertedIds[0]) {
        Carts.delete({uid: user._id});
        checkAndUpdateStock(Items, cartItems);
      }

      return Object.assign(
        {
          id: response.insertedIds[0]
        },
        orderObj
      );

    },
    cancelOrder: async (root, data, { user, mongo: { Orders } }) => {
      if(!user) {
        return '';
      }
      const ret = await Orders.update(
        { uid: user._id, _id: ObjectID(data.orderId)},
        { $set: { state: 'caneled' }}
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
      addressId = (address.id ? ObjectID(address.id) : ObjectID());
      const condition = { _id: addressId, uid: user._id };
      delete address.id;
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
