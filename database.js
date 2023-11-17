const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('gameLog');
const gameCollection = db.collection('gameLog');

// test connection
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

async function addToGameHistory(user, game) {
  console.log(`Adding game to history for ${user}`);
  const result = await gameCollection.insertOne({ user, game });
  //const result = await gameCollection.insertOne(game);
  return result;
}
function getGameHistory(user) {
  //TODO - filter by user
  const query = {  };
  const options = { limit: 100 };
  const cursor = gameCollection.find(query, options);
  return cursor.toArray();
}

module.exports = { addToGameHistory, getGameHistory };