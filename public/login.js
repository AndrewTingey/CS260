(async () => {
  const username = localStorage.getItem('username');
  console.log("Username: \n\t", username);
  if (username) {
    document.querySelector('#playerName').textContent = username;
    setDisplay('loginControls', 'none');
    setDisplay('playControls', 'block');
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
    window.location.href = "play.html";
  }
}

function play() {
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

function setDisplay(controlId, display) {
  const playControlEl = document.querySelector(`#${controlId}`);
  if (playControlEl) {
    playControlEl.style.display = display;
  }
}