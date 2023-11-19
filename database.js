const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('gameLog');
const userCollection = db.collection('users');
const gameCollection = db.collection('gameLog');

// test connection
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}

async function addToGameHistory(user, game) {
  // console.log(`Adding game to history for ${user}`);
  const result = await gameCollection.insertOne({ user: user, game: game });
  //const result = await gameCollection.insertOne(game);
  return result;
}
async function getGameHistory(user) {
  //TODO - filter by user
  const query = { user };
  const options = { limit: 100 };
  const cursor = await gameCollection.find(query, options);
  // console.log(`Getting game history for ${user}`);
  const gameHistory = await cursor.toArray();
  // console.log(`Game history:\n\t`, gameHistory);
  return gameHistory;
}

//TODO - this doesnt have functionality yet
async function clearGameHistory(user) {
  // console.log(`Clearing game history for ${user}`);
  const result = await gameCollection.deleteMany({ user });
  return result;
}

module.exports = { 
  addToGameHistory, 
  getGameHistory, 
  getUser,
  getUserByToken,
  createUser, 
  clearGameHistory,
};