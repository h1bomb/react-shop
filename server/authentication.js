const { ObjectID } = require("mongodb");

/**
 * This is an extremely simple token. In real applications make
 * sure to use a better one, such as JWT (https://jwt.io/).
 */
module.exports.authenticate = async (req, Users) => {
  const token = req.cookies.get('token');
  return token && await Users.findOne({_id: ObjectID(token)});
}

