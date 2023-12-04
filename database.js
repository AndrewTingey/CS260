const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('gameLog');
const userCollection = db.collection('users');
const gameCollection = db.collection('gameLog');
const liveGamesCollection = db.collection('liveGames');

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
  return userCollection.findOne();
  //TODO - ADD COOKIES TO A USER COLLECTION AND CHECK FOR TOKEN
  //return userCollection.findOne({ token: token });
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

async function getGame(gameID) {
  const query = { gameID };
  const options = { limit: 1 };
  const cursor = await liveGamesCollection.find(query, options);
  const matchingGames = await cursor.toArray();
  if (matchingGames.length === 0) {
    return null;
  } else if (matchingGames.length === 1) {
    return matchingGames[0];
  } else {
    console.log("ERROR: Multiple games found with gameID: ", gameID);
    return null;
  }
}

async function setGame(gameID, game) {
  console.log("Game: ", game);
  console.log("Gameclass: ", game.constructor.name);
  const result = await liveGamesCollection.updateOne({ gameID }, { $set: game }, { upsert: true });
  return result;
}

async function registerGame(gameID, user) {
  let existingGame = await getGame(gameID);
  // console.log("Existing game: ", existingGame);
  console.log("Existing game: ", existingGame);
  //no game, create one
  if (!existingGame) {
    //random chance of playing first and playing as X
    let playingFirst = Math.random() < 0.5;
    let playingAsX = Math.random() < 0.5;
    let game = {
      gameID: gameID,
      hostingUser: user,
      opponent: null,
      playingAsX: playingAsX ? user : null,
      playingAsO: playingAsX ? null : user,
      playingFirst: playingFirst ? user : null,
      numberPlayers: 1,
    }
    return await setGame(gameID, game);
  } 
  //game exists, add user to game
  let game = existingGame;
  game.opponent = user;
  game.numberPlayers = 2;
  if (game.playingAsX === null) {
    game.playingAsX = user;
  } else if (game.playingAsO === null) {
    game.playingAsO = user;
  }
  if(game.playingFirst === null) {
    game.playingFirst = user;
  }
  return await setGame(gameID, game);
  //WORKING HERE - NEVER UPDATES TO 2 PLAYERS
}

module.exports = { 
  addToGameHistory, 
  getGameHistory, 
  getUser,
  getUserByToken,
  createUser, 
  clearGameHistory,
  getGame,
  setGame,
  registerGame,
};