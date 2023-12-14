import React from "react";
import Button from "react-bootstrap/Button";
import "./login.css";

export function GameMenu() {
    const playLocal = () => {
        // TODO: Implement playLocal function
        console.log("playLocal");
        localStorage.setItem("opponentType", "player");
        window.location.href = "/play";

    };

    const playAI = () => {
        // TODO: Implement playAI function
        console.log("playAI");
        localStorage.setItem("opponentType", "cpu");
        window.location.href = "/play";
    };

    const playOnline = () => {
        // TODO: Implement playOnline function
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
        localStorage.setItem("opponentType", "online");
    };

    const joinGame = () => {
        // TODO: Implement joinGame function
        console.log("joinGame");
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
                    <Button id="hostGameButton" type="button" className="more-online-id btn my-1 w-100" onClick={joinGame} style={{ display: 'none' }} disabled>Host Game</Button>
                    <Button id="joinGameButton" type="button" className="more-online-id btn my-1 w-100" onClick={joinGame} style={{ display: 'none' }} disabled>Join Game</Button>
                    <Button type="button" className="btn btn-secondary my-1 w-100" onClick={logout}>Logout</Button>
                </div>
            </div>
        </>
    );
}