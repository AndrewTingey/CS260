const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const DB = require('./database.js');
const {WebSocketServer} = require('ws');
const path = require('path');

const authCookieName = 'token';

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.json());

// Third party middleware - Cookies
app.use(cookieParser());

// Built in middleware - Static file hosting
app.use(express.static('public'));

app.set('trust proxy', true);

// Router for service endpoints
var apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.email)) {
    res.status(409).send({error: 'User already exists'});
  } else {
    const user = await DB.createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);

    res.send({
      id: user.id, //simon/index.js uses ._id
    });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({
        id: user.id, //simon/index.js uses ._id
      });
      return;
    }
  }
  res.status(401).send({error: 'Incorrect email and/or password'});
});

apiRouter.delete('/auth/logout', (req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.get('/user/:email', async (req, res) => {
  const user = await DB.getUser(req.params.email);
  if (user) {
    const token = req?.cookies.token;
    res.send({
      email: user.email,
      authenticated: token && token === user.token,
    });
    return;
  }
  res.status(404).send({error: 'User not found'});
});

//secureAPIRouter verifies credentials for endpoints
var secureAPIRouter = express.Router();
apiRouter.use(secureAPIRouter);

//TODO fix this, getUserByToken doesn't return a user by their authToken
secureAPIRouter.use(async (req, res, next) => {
  next();
  // authToken = req.cookies[authCookieName];
  // const user = await DB.getUserByToken(authToken);
  // if (user) {
  //   next();
  // } else {
  //   res.status(401).send({error: 'Not logged in'});
  // }
});

app.post('/cookie/:name/:value', (req, res, next) => {
  res.cookie(req.params.name, req.params.value);
  res.send({cookie: `${req.params.name}:${req.params.value}`});
});

app.get('/cookie', (req, res, next) => {
  res.send({cookie: req.cookies});
});

// Creating your own middleware - logging
app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
});

// GetGameHistory
secureAPIRouter.get('/gameHistory', async (req, res) => {
  const dbGameHistory = await DB.getGameHistory(req.cookies);
  res.send(dbGameHistory);
});

// SubmitGameHistory
secureAPIRouter.post('/gameHistory', async (req, res) => {
  const dbGameHistory = await DB.addToGameHistory(req.cookies, req.body);
  res.send(dbGameHistory);
});

//clear game history log for all users -- should be restricted to admin
secureAPIRouter.delete('/gameHistory', async (req, res) => {
  const dbGameHistory = await DB.clearGameHistory(req.cookies);
  res.send(dbGameHistory);
});

//regsiterGame
apiRouter.post('/game/:gameID', async (req, res) => {
  const gameID = req.params.gameID;
  const username = req.body.username;
  const data = await DB.registerGame(gameID, username);
  
  res.send({ message: 'game registered successfully!', data: data });
});

//getGameState
apiRouter.get('/game/:gameID', async (req, res) => {
  const gameID = req.params.gameID;
  const result = await DB.getGame(gameID);
  if (result === null) {
    res.status(204).send({error: 'Game not found'});
  } else {
    res.send(result);
  }
});

//delete game
apiRouter.delete('/game/:gameID', async (req, res) => {
  const gameID = req.params.gameID;
  const result = await DB.deleteGame(gameID);
  res.send(result);
});

// Return the application's index.html file
app.use((req, res) => {
  console.log("Sending index.html");
  res.sendFile(path.join(__dirname, '../index.html'));
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Error middleware
app.get('/error', (req, res, next) => {
  throw new Error('Trouble in river city');
});

app.use(function (err, req, res, next) {
  res.status(500).send({type: err.name, message: err.message});
});

// Listening to a network port
server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Websocket server
const wss = new WebSocketServer({ noServer: true });

// Handle websocket connections
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request);
  });
});

//keep track of gameConnections instead
//<gameID, [connection1, connection2]>
let gameConnections = new Map();

wss.on('connection', (ws) => {
  //connections saved on joinGame connection
  const connection = {
    ws: ws,
    alive: true,
    username: null,
    gameID: null,
  };

  ws.on('message', function message(data) {
    //one for game move, chat message, and join game
    const message = JSON.parse(data);
    if (message.type === 'gameMove') {
      console.log("sending game move: ", message.data, " to game: ", message.gameID);
      handleGameMove(message.gameID, data, ws);
    } else if (message.type === 'chatMessage') {
      if (message.data.username === "master") {
        handleMasterCommands(message.gameID, message.data.message, ws);
      } else {
        handleChatMessage(message.gameID, data, ws);
      }
    } else if (message.type === 'joinGame') {
      handleJoinGame(message.gameID, ws);
      connection.username = message.data.username;
      connection.gameID = message.gameID;
      // console.log("user: ", message.data.username, " joined game: ", message.gameID);
    } else {
      console.log("ERROR: Unknown message type: ", message.type);
    }
  });

  //remove connection from list when closed
  ws.on('close', () => {
    console.log("Connection closed");
    removePlayerFromConnections(ws);
    removePlayerFromGame(connection.gameID, connection.username);
  });

  //ping pong to keep connection alive
  ws.on('pong', () => {
    connection.alive = true;
    gameConnections.forEach((game) => {
      game.forEach((c) => {
        if (c.ws === ws) {
          c.alive = true;
        }
      });
    });
  });
});

//keep active gameConnections alive
setInterval(() => {
  gameConnections.forEach((connections) => {
    connections.forEach((c) => {
      if (!c.alive) {
        c.ws.terminate();
      }
      c.alive = false;
      c.ws.ping();
    });
  });
}, 10000);

function broadcastToGame(gameID, data, ws) {
  //send data to all connections with gameID
  if (gameConnections.has(gameID)) {
    const playerConnections = gameConnections.get(gameID);
    playerConnections.forEach((c) => {
      try {
        //send data to all connections except sender
        if (c.ws !== ws) {
          c.ws.send(data);
        }
      } catch (e) {
        console.log("ERROR: Failed to send message to connection: ", c);
        console.log("ERROR: ", e);
      }
    });
  } else {
    console.log("ERROR: No connections found for gameID: ", gameID);
  }
}

function handleJoinGame(gameID, ws) {
  const connection = {
    ws: ws,
    alive: true,
  };
  if (!gameConnections.has(gameID)) {
    gameConnections.set(gameID, new Set());
  }
  let connected = gameConnections.get(gameID).add(connection);

  if (connected.length > 2) {
    console.log("ERROR: More than 2 players connected to game: ", gameID);
  } 
  const message = {
    type: 'joinGame',
    gameID: gameID,
    data: {
      username: "SERVER"
    }
  }

  broadcastToGame(gameID, JSON.stringify(message), ws);
}

function handleChatMessage(gameID, messageData, ws) {
  broadcastToGame(gameID, messageData, ws);
}

function handleGameMove(gameID, gameMove, ws) {
  broadcastToGame(gameID, gameMove, ws);
}

function removePlayerFromConnections(ws) {
  gameConnections.forEach((connections, gameID) => {
    connections.forEach((c) => {
      if (c.ws === ws) {
        connections.delete(c);
      }
    });
  });
}

async function removePlayerFromGame(gameID, username) {
  const gameDetails = await DB.removePlayerFromGame(gameID, username);
  if (gameDetails.numberPlayers === 0) {
    await DB.deleteGame(gameID);
  }
}

async function handleMasterCommands(gameID, message, ws) {
  let response = "";
  if (message === "Hi") {
    console.log("Hello");
    response = "Hello, master";
  } else if (message === "HELP") {
    response = "Commands: HELP, LIST ALL GAMES, LIST ALL USERNAMES, LIST ALL USER DETAILS, DELETE ALL LIVE GAMES, DELETE GAME [gameID], DELETE GAME HISTORY [username], DELETE ALL CONNECTIONS, DELETE USER [username]";
  } else if (message === "DELETE ALL LIVE GAMES") {
    console.log("Deleting all live games...");
    response = "Deleted all live games";
    DB.clearLiveGames();
  } else if (message === "LIST ALL GAMES") {
    console.log("Listing all games...");
    const games = await DB.getAllGames();
    response = "All games: " + JSON.stringify(games);
  } else if (message === "LIST ALL USERNAMES") {
    console.log("Listing all usernames...");
    const usernames = await DB.getAllUsernames();
    response = "All usernames: \n\t";
    for (let i = 0; i < usernames.length; i++) {
      response += usernames[i];
      if (i < usernames.length - 1) {
        response += "\n\t";
      }
    }
  } else if (message === "LIST ALL USER DETAILS") {
    console.log("Listing all users...");
    const users = await DB.getAllUsers();
    response = "All users: " + JSON.stringify(users);
  } else if (message.startsWith("DELETE GAME")) {
    const gameID = message.split(" ")[2];
    console.log("Deleting game: ", gameID);
    result = await DB.deleteGame(gameID);
    if (result === null) {
      console.log("ERROR: No game found with gameID: ", gameID);
      response = "ERROR: No game found with gameID: " + gameID;
    } else {
      response = "Deleted game: " + gameID;
    }
  } else if (message.startsWith("DELETE GAME HISTORY")) {
    const username = message.split(" ")[3];
    console.log("Deleting game history for: ", username);
    response = "Deleted game history for: " + username;
    DB.clearGameHistory(username);
  } else if (message === "DELETE ALL CONNECTIONS") {
    console.log("Deleting all connections...");
    response = "Deleted all connections";
    //delete all except for self
    gameConnections.forEach((connections, gameID) => {
      connections.forEach((c) => {
        if (c.ws !== ws) {
          c.ws.terminate();
          connections.delete(c);
        }
      });
    });
  } else if (message.startsWith("DELETE USER")) {
    const username = message.split(" ")[2];
    console.log("Deleting user: ", username);
    const result = await DB.deleteUser(username);
    if (result === null) {
      response = "ERROR: No user found with username: " + username;
    } else {
      response = "Deleted user: " + username;
    }
  } else  {
    response = "Unknown command: \'" + message + "\'\n\tType HELP for a list of commands";
  }
  messageData = {
    type: 'chatMessage',
    data: {
      username: "SERVER",
      message: response,
    }
  }
  
  const buffer = Buffer.from(JSON.stringify(messageData));
  handleChatMessage(gameID, buffer, null);
}