(async () => {
  const username = localStorage.getItem('username');
  console.log("Username: \n\t", username);
  if (username) {
    document.querySelector('#playerName').textContent = username;
    setDisplay('loginControls', 'none');
    setDisplay('playControls', 'flex', 'column');
  } else {
    setDisplay('loginControls', 'block');
    setDisplay('playControls', 'none');
  }
})();


async function login() {
  loginOrRegister("/api/auth/login");
}

function register() {
  loginOrRegister("/api/auth/create");
}

async function loginOrRegister(endpoint) {
  const username = document.querySelector("#username")?.value;
  const password = document.querySelector("#password")?.value;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: username,
      password: password,
    }),
  });
  const data = await response.json();
  if (data.error) {
    alert(data.error);
    //This sections is different in simon/login.js
  } else {
    localStorage.setItem("username", username);

    document.querySelector('#playerName').textContent = username;
    setDisplay('loginControls', 'none');
    setDisplay('playControls', 'flex', 'column');
    // window.location.href = "play.html";
  }
}

function playLocal() {
  localStorage.setItem("opponent", "player");
  window.location.href = 'play.html';
}

function playAI() {
  localStorage.setItem("opponent", "cpu");
  window.location.href = 'play.html';
}

function playOnline() {
  //shows dropdown menu for gameID host, and join buttons
  var moreOnlineIdElements = document.getElementsByClassName('more-online-id');
  for (var i = 0; i < moreOnlineIdElements.length; i++) {
    moreOnlineIdElements[i].style.display = 'block';
    moreOnlineIdElements[i].classList.add('dropdown');
  }
  localStorage.setItem("opponent", "online");//WORKING HERE Do you have to clear localstorage? playVs: "ai", change this to opponent username <-
}

document.querySelector("#gameID").addEventListener("input", async (event) => {
  const gameID = event.target.value;
  const hostGameButton = document.querySelector("#hostGameButton");
  const joinGameButton = document.querySelector("#joinGameButton");

  if (gameID.length > 0) {
    hostGameButton.disabled = false;
    hostGameButton.classList.add("btn-primary");

    joinGameButton.disabled = true;
    joinGameButton.classList.remove("btn-primary");

    let gameExists = false;
    const response = await fetch(`/api/game/${gameID}`);

    if (response.status === 200) {
      gameExists = true;
    } else {
      displayInfoMessage("Game does not exist", "grey");
    }
    

    if (gameExists) {
      const gameDetails = await response.json();
      console.log("Game details: ", gameDetails);

      if (gameDetails.numberPlayers === 2) {
        displayInfoMessage("Game is full", "red");
        hostGameButton.disabled = true;
        hostGameButton.classList.remove("btn-primary");
        joinGameButton.disabled = true;
        joinGameButton.classList.remove("btn-primary");
      } else if (gameDetails.numberPlayers === 1) {
        let host = gameDetails.hostingUser;
        displayInfoMessage(`Play against ${host}`, "orange");
        hostGameButton.disabled = true;
        hostGameButton.classList.remove("btn-primary");
        joinGameButton.disabled = false;
        joinGameButton.classList.add("btn-primary");
      } else {
        displayInfoMessage("Game is available", "green");
        hostGameButton.disabled = false;
        hostGameButton.classList.add("btn-primary");
        joinGameButton.disabled = true;
        joinGameButton.classList.add("btn-primary");
      }
    }
  } else {
    displayInfoMessage("Game does not exist", "grey");

    hostGameButton.disabled = true;
    hostGameButton.classList.remove("btn-primary");
    joinGameButton.disabled = true;
    joinGameButton.classList.remove("btn-primary");
  }
});

async function joinGame() {
  console.log("Host game:\n\t");
  gameID = document.querySelector("#gameID").value;
  const username = localStorage.getItem("username");
  localStorage.setItem("gameID", gameID);
  
  const response = await fetch(`/api/game/${gameID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gameID: gameID,
      username: username,
    }),
  });

  const result = await response.json();

  if (response.status === 200) {
    console.log(result.message);
    const gameDetails = result.data;
    if (gameDetails.playingAsX === username) {
      localStorage.setItem("playingAs", "X");
    } else if (gameDetails.playingAsO === username) {
      localStorage.setItem("playingAs", "O");
    } else {
      console.log("ERROR: User is not playing as X or O");
    }
    localStorage.setItem("playingFirst", gameDetails.playingFirst);
  } else {
    console.log("Game registration failed");
  }
  

  window.location.href = 'play.html';
}

function logout() {
  localStorage.removeItem("username");
  fetch("/api/auth/logout", {
    method: "DELETE",
  }).then(() => (window.location.href = "/"));
}

async function getUser(email) {
  const response = await fetch(`/api/user/${email}`);
  if (response.status === 200) {
    return await response.json();
  }
  return null;
}

function setDisplay(controlId, display, flexDirection = 'row') {
  const playControlEl = document.querySelector(`#${controlId}`);
  if (playControlEl) {
    playControlEl.style.display = display;
    playControlEl.style.flexDirection = flexDirection;
  }
}

function displayInfoMessage(message, color) {
  const gameInfo = document.querySelector('#infoMessage');
  gameInfo.textContent = message;
  gameInfo.style.color = color;
}
