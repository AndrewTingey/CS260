const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Third party middleware - Cookies
app.use(cookieParser());

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

// Built in middleware - Static file hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use('/api', apiRouter);

// Get game history log
apiRouter.get('/gameHistory', (req, res) => {
  res.send(gameHistory);
});

// Post game history log
apiRouter.post('/gameHistory', (req, res) => {
  //console.log("Game history saved body: \n\t" + req.body);
  gameHistory = addGameToHistory(req.body, gameHistory);
  res.send(gameHistory);
});

// Return the application's index.html file
app.use((req, res) => {
  res.sendFile('index.html', {root: 'public'});
});

// Listening to a network port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Error middleware
app.get('/error', (req, res, next) => {
  throw new Error('Trouble in river city');
});

app.use(function (err, req, res, next) {
  res.status(500).send({type: err.name, message: err.message});
});

// Data
let gameHistory = [];
function addGameToHistory(game, gameHistory) {
  gameHistory.push(game);
  return gameHistory;
}