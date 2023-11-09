function newJoke() {
    const url = "https://api.chucknorris.io/jokes/random";
    fetch(url)
    .then((x) => x.json())
    .then((response) => {
        displayJoke(response.value);
    });
}

function displayJoke(joke) {
    document.querySelector("#joke").innerHTML = `
        <div class="joke-box fly-in">
            ${joke}
        </div>
    `;
}
