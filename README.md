# Ultimate Tic Tac Toe

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
