const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const DB = require('./database.js');
const {WebSocketServer} = require('ws');

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

secureAPIRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({error: 'Not logged in'});
  }
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

// Return the application's index.html file
app.use((req, res) => {
  res.sendFile('index.html', {root: 'public'});
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

// keep track of all connections
let connections = [];

wss.on('connection', (ws) => {
  const connection = { 
    id: connections.length + 1,
    alive: true,
    ws: ws
  };
  connections.push(connection);

  //forward message to everyone except sender
  ws.on('message', function message(data) {
    // console.log('received: %s', data);
    connections.forEach((c) => {
      if (c.id !== connection.id) {
        c.ws.send(data);
      }
    });
  });

  //remove connection from list when closed
  ws.on('close', () => {
    connections.findIndex((o, i) => {
      if (o.id === connection.id) {
        connections.splice(i, 1);
        return true;
      }
    });
  });

  //ping pong to keep connection alive
  ws.on('pong', () => {
    connection.alive = true;
  });
});

//keep active connections alive
setInterval(() => {
  connections.forEach((c) => {
    if (!c.alive) {
      c.ws.terminate();
    }
    c.alive = false;
    c.ws.ping();
  });
}, 10000);