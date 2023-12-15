import React from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import "./login.css";

export function GameMenu() {
    const navigate = useNavigate();

    const playLocal = () => {
        console.log("playLocal");
        localStorage.setItem("opponentType", "player");
        navigate("/playLocal");
    };

    const playAI = () => {
        console.log("playAI");
        localStorage.setItem("opponentType", "cpu");
        navigate("/playCPU");
    };

    const playOnline = () => {
        console.log("playOnline");
        var moreOnlineIdElements = document.getElementsByClassName("more-online-id");
        for (var i = 0; i < moreOnlineIdElements.length; i++) {
            if (moreOnlineIdElements[i].style.display === "block") {
                moreOnlineIdElements[i].style.display = "none";
                moreOnlineIdElements[i].classList.remove("dropdown");
            } else {
                moreOnlineIdElements[i].style.display = "block";
                moreOnlineIdElements[i].classList.add("dropdown");
            }
        }
        document.querySelector("#gameID").addEventListener("input", gameIdInputEventListener);
        localStorage.setItem("opponentType", "online");
    };

    const joinGame = async () => {
        console.log("joinGame");
        const gameID = document.getElementById("gameID").value;
        const username = localStorage.getItem("username");

        const response = await fetch("/api/game/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, gameID }),
        });

        const result = await response.json();

        if (result.success) {
            console.log("Game Registration Successful", result.message);
            const gameDetails = result.data;
            if (gameDetails.playingAsX == username) {
                localStorage.setItem("playingAs", "X");
                if (gameDetails.playerO) {
                    localStorage.setItem("opponentName", gameDetails.playerO);
                }
            } else if (gameDetails.playingAsO == username) {
                localStorage.setItem("playingAs", "O");
                if (gameDetails.playerX) {
                    localStorage.setItem("opponentName", gameDetails.playerX);
                }
            } else {
                console.log("ERROR: User is not a player in this game");
            }
            localStorage.setItem("playingFirst", gameDetails.playingFirst);
        } else {
            console.log("response.status" + response.status);
            console.log("GAME REGISTRATION FAILED", result.message);
            document.getElementById("infoMessage").innerHTML = result.message;
        }
        navigate(`/playOnline/${gameID}`);
    };

    const logout = () => {
        // TODO: Implement logout function
        console.log("logout");
        localStorage.removeItem("username");
        fetch("/api/auth/logout", {
            method: "DELETE",
        }).then(() => (window.location.href = "/"));
    };

    return (
        <>
            <div className="login">
                <h1 className="text-center">Welcome</h1>
                <p className="text-center">Select a game mode</p>
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <div className="text-center" id="playerName"></div>
                    <Button type="button" className="btn btn-primary my-1 w-100" onClick={playLocal}>Pass 'n' Play</Button>
                    <Button type="button" className="btn btn-primary my-1 w-100" onClick={playAI}>Play AI</Button>
                    <Button type="button" className="btn btn-primary my-1 w-100" onClick={playOnline}>Play Online</Button>
                    <input className="more-online-id my-1 w-100" id="gameID" type="text" placeholder="Game ID" style={{ display: 'none' }} />
                    <div id="infoMessage" className="more-online-id justify-content-end py-0 w-100" style={{ textAlign: 'right' }}></div>
                    <Button id="hostGameButton" type="button" className="more-online-id btn my-1 w-100" onClick={joinGame} style={{ display: 'none' }} >Host Game</Button>
                    <Button id="joinGameButton" type="button" className="more-online-id btn my-1 w-100" onClick={joinGame} style={{ display: 'none' }} >Join Game</Button>
                    <Button type="button" className="btn btn-secondary my-1 w-100" onClick={logout}>Logout</Button>
                </div>
            </div>
        </>
    );
}

async function gameIdInputEventListener(event) {
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

        hostGameButton.disabled = false;
        hostGameButton.classList.remove("btn-primary");
        joinGameButton.disabled = true;
        joinGameButton.classList.remove("btn-primary");
    }
}

function displayInfoMessage(message, color) {
    const gameInfo = document.querySelector('#infoMessage');
    gameInfo.textContent = message;
    gameInfo.style.color = color;
}
  