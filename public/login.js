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
  var moreOnlineIdElements = document.getElementsByClassName('more-online-id');
  for (var i = 0; i < moreOnlineIdElements.length; i++) {
    moreOnlineIdElements[i].style.display = 'block';
    moreOnlineIdElements[i].classList.add('dropdown');
  }


  localStorage.setItem("opponent", "online");
  // window.location.href = 'play.html';
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

    const gameExists = await checkGameExists(gameID);
    if (gameExists) {
      joinGameButton.disabled = false;
      joinGameButton.classList.add("btn-primary");
    }
  } else {
    hostGameButton.disabled = true;
    hostGameButton.classList.remove("btn-primary");
    joinGameButton.disabled = true;
    joinGameButton.classList.remove("btn-primary");
  }
});


async function checkGameExists(gameID) {
  // Make an API call to check if the game ID exists on the server
  // Replace the API endpoint with the actual endpoint for checking game existence

  return false;  
  // const response = await fetch(`/api/game/${gameID}`);
  // return response.status === 200;
}

function hostGame() {
  console.log("Host game");
  gameID = document.querySelector("#gameID").value;
  localStorage.setItem("gameID", gameID);
}

function joinGame() {
  console.log("Join game");
}

function test() {
  console.log("Test");
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