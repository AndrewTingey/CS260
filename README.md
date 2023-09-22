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


this is a new change to readme.md

