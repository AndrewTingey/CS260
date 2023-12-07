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
  console.log(`Setting gameID ${gameID}: `, game);
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
    setGame(gameID, game);
    return game;
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
  setGame(gameID, game);
  return game;
}

async function removePlayerFromGame(gameID, user) {
  let existingGame = await getGame(gameID);
  // console.log("Existing game: ", existingGame);
  //no game, create one
  if (!existingGame) {
    console.log("ERROR: No game found with gameID: ", gameID);
    return null;
  } 
  //game exists, remove user from game
  let game = existingGame;
  if (game.playingAsX === user) {
    game.playingAsX = null;
  } else if (game.playingAsO === user) {
    game.playingAsO = null;
  }
  if (game.playingFirst === user) {
    game.playingFirst = null;
  }
  if (game.hostingUser === user) {
    game.hostingUser = null;
  }
  if (game.opponent === user) {
    game.opponent = null;
  }
  game.numberPlayers = 0;
  if (game.playingAsX != null) {
    game.numberPlayers++;
  }
  if (game.playingAsO != null) {
    game.numberPlayers++;
  }
  setGame(gameID, game);
  return game;
}

async function deleteGame(gameID) {
  let existingGame = await getGame(gameID);
  if (!existingGame) {
    console.log("ERROR: No game found with gameID: ", gameID);
    return null;
  } 
  const result = await liveGamesCollection.deleteOne({ gameID });
  return result;
}

async function clearLiveGames() {
  const result = await liveGamesCollection.deleteMany({});
  return result;
}

async function deleteUser(username) {
  const result = await userCollection.deleteOne({ email: username });
  return result;
}

async function getAllUsers() {
  const query = {};
  const options = { limit: 100 };
  const cursor = await userCollection.find(query, options);
  const users = await cursor.toArray();
  return users;
}

async function getAllUsernames() {
  const query = {};
  const options = { limit: 100 };
  const cursor = await userCollection.find(query, options);
  const users = await cursor.toArray();
  let usernames = [];
  users.forEach(user => {
    usernames.push(user.email);
  });
  return usernames;
}

async function getAllGames() {
  const query = {};
  const options = { limit: 100 };
  const cursor = await liveGamesCollection.find(query, options);
  const games = await cursor.toArray();
  let gamesList = [];
  games.forEach(game => {
    gamesList.push(game.gameID);
  });
  return gamesList;
}

module.exports = { 
  addToGameHistory, 
  getGameHistory, 
  getUser,
  getAllUsers,
  getAllUsernames,
  getUserByToken,
  createUser, 
  deleteUser,
  clearGameHistory,
  removePlayerFromGame,
  getGame,
  getAllGames,
  setGame,
  deleteGame,
  registerGame,
  clearLiveGames,
};