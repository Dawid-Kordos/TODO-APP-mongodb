const { MongoClient } = require('mongodb');

// const client = new MongoClient('mongodb://localhost:27017');
const client = new MongoClient('mongodb+srv://DaKo:Nugyd0PeJwNuQzkl@cluster0.9vtrc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true });

client.connect();

const db = client.db('test');

const todos = db.collection('todos');

module.exports = {
  db,
  todos,
  client,
};
