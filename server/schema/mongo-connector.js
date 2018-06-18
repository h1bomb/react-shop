const {
    MongoClient,
    Logger
} = require('mongodb');

// 1
const MONGO_URL = 'mongodb://localhost:27017';
const dbName = 'reactshop';
// 2
module.exports = async () => {
    const client = await MongoClient.connect(MONGO_URL);

    let logCount = 0;
    Logger.setCurrentLogger((msg, state) => {
      console.log(`MONGO DB REQUEST ${++logCount}: ${msg}`);
    });
    Logger.setLevel('debug');
    Logger.filter('class', ['Cursor']);

    console.log("Connected successfully to server");
    const db = client.db(dbName);
    return {
        Users: db.collection('users'),
        Items: db.collection('items'),
        Orders: db.collection('orders'),
        Address: db.collection('address'),
        Carts: db.collection('cart')
    };
}