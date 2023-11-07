function login() {
    const nameElemenet = document.querySelector("#username");
    localStorage.setItem("username", nameElemenet.value);
    window.location.href = "play.html";
  }