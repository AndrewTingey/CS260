# Ultimate Tic Tac Toe

The most recent working model of this app will be published to https://startup.andrewt.click

## Elevator Pitch

I've always loved playing a pass-n-play scratch game like tic-tac-toe on a peice of paper, but the simple 3x3 grid was always too simple. There are only around 126 unique boards that can be played. My friends and I decided to add another layer to the game to make it more complex. a 3x3x3 board is much more intricate and allows for much more thinking when deciding where to go. We called it ultimate tic-tac-toe. But now nobody uses paper because in 2023 everything is online. I want to make a website that i can still play my friends this simple game either online or sitting next to them as local multiplayer. I also want to implement the classic mini-max algorithm that is used in a classic AI CPU tic-tac-toe game and see if I can beat it. 

## Design Images

[StartupSpecificationUTTT.pdf](https://github.com/AndrewTingey/CS260/files/12642078/StartupSpecificationUTTT.pdf)

## Key features

- User login
- Online matchmaking multiplayer
- Online friend invite multiplayer
- Local pass-n-play multiplayer
- Local CPU single player
- Recent games page that shows all time record W-L
- User profile page views friendships and edits profile

## Technologies

- **HTML** - use HTML structure for application. 4 main html pages. one for login, one for profile and friendships, one for recent games page, and one for actual gameplay (online/local/vs cpu)
- **DB** - Stores username/login, and user's record and recent games, as well as friendships between users
- **Authenication/Login** - Register and login users. credentials stored in database. Can still play games as guest, but records are not stored
- **WebSocket** - user's taking turns in real time to know who goes when

## HTML Deliverable

For this delliverable I built out the structure of my app using only HTML

- **HTML Pages** - 4 html pages represent the ability to login, play the game, view previous games and an about page. Only missing a profile page to show own profile, but this will be the same as home page/login screen
- **Links** - The header of each html file brings you to each other file in html, as a menu to view all files
- **Tables** - The gameboard of ultimate tic tac toe is 3x3 within a 3x3 board this was represented by literally putting 9 tables as the data entries of a 3x3 table.
- **Images** - I added a game like royalty free image of chess to the about section to make the page look prettier
- **Login** - theres a input box and submit button for logging in
- **Database** - Theoretically, the game history of each user will be drawn from the database of past games
- **WebSocket** - I added a chat box to the bottom of the play screen that would allow the user to communicate with their opponent from the game

## CSS Deliverable

For this delliverable I made my website prettier with CSS and added bootstrap

- **Header, Footer, Main content bodies** 
- **Navigation** - The active screen shows up in bold and in a different color, as well as when you hover over the tab it underlines it as well.
- **Responsive windo design** - The website changes fills to fit all sized screens
- **Themed colors** - I added a colors to the page so that each one follows similar color schemes
- **Bootstrap** - I mostly used bootstrap in the login screen, however admittedly all the links are fake links and do anything yet
- **Tables** - I made the table on the game history such that when you hover over a element it highlights the whole row
- **CSS** - On the play screen i added horizontal and vertical line elements in css to be able to use them on every other box and create what looks like a tic tac toe grid.

## JavaScript Deliverable

For this deliverable I implemented by JavaScript so that the application works for a single user. I also added placeholders for future technology.

- **Login** - Instead of username/password, I chose just a username because there's not really senstiive information to protect from one user to another.
- **Database** - Displayed the game history log. Right now, this is retrieved from local storage, but it will be replaced with the database data later.
- **WebSocket** - I added a chat box and history. Right now its lame because nobody would use it in pass-n-play mode, but in the future it will only be visible when playing online and connect via websocket to the other user. 
- **Application Logic** - The ultimate tic-tac-toe game works for a single screen, if one person were to pass-n-play with a friend. In the future, I plan to keep this capability, but add an option to play a computer and play against friends online.

## Service Deliverable

For this deliverable I added backend endpoints that recieve game winner and displays it on the game log.

- **Node.js/Express HTTP service** - done!
- **Static middleware for frontend** - done!
- **Calls to third party endpoints** - The about page gets a chuck norris joke on click using a third party api call
- **Backend service endpoints** - Get and Post services were created for when games end, to 
- **Frontend calls service endpoints** - I did this using the fetch function.

## DB deliverable

For this deliverable I stored the game history in the database.

- **MongoDB Atlas database created** - done!
- **Endpoints for data** - My stubbed out endpoints now process the data and send it to Mongo.
- **Stores data in MongoDB** - done!