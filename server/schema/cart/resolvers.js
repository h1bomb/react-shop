const { ObjectID } = require("mongodb");

module.exports = {
  Query: {
    userCartList: async (root, data, { user, mongo: { Carts } }) => {
      if (!user) {
        return [];
      }
      const cartItems = await Carts.find({ uid: user._id }).toArray();
      return cartItems;
    }
  },
  Mutation: {
    saveCartItem: async (root, data, { user, mongo: { Carts, Items } }) => {
      let { cartItem } = data;
      const errorObj = { id: 0, itemId: "", uid: "", count: 0 };

      if (!user || !Number(cartItem.count)) {
        return errorObj;
      }
      const item = await Items.findOne({
        _id: ObjectID(cartItem.itemId)
      });

      if (!item) {
        return errorObj;
      }

      let count = cartItem.count;

      const existCartItem = await Carts.findOne({
        uid: user._id,
        itemId: cartItem.itemId
      });
      if (existCartItem && existCartItem.count) {
        if (item.stock < existCartItem.count + cartItem.count) {
          return {
            message: "stock not enough!"
          };
        }
        count += existCartItem.count;
      }

      const cartItemObj = {
        uid: user._id,
        count,
        itemId: cartItem.itemId,
        item: {
          id: item._id,
          name: item.name,
          cover: item.cover,
          price: item.price
        }
      };
      const ret = await Carts.update(
        { uid: user._id, itemId: cartItem.itemId },
        cartItemObj,
        { upsert: true }
      );
      if (ret.result.nModified > 0) {
        return { cartItem: cartItemObj };
      } else {
        return { message: 'add to cart fail!'}
      }
    },
    deleteCartItem: async (root, data, { mongo: { Carts } }) => {
      const response = await Carts.deleteOne({
        itemId: data.id
      });
      if (response.deletedCount === 1) {
        return data.id;
      } else {
        return response.deletedCount;
      }
    }
  },
  LessItem: {
    id: root => root._id || root.id
  },
  CartItem: {
    id: root => root._id || root.id
  }
};
