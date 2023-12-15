import React from "react";
import "./play.css";
import { gameBoard } from "./play.jsx";

export function Gameboard() {
    return (
        <table className="outer-table">
            <tbody>
                <tr>
                    <td className="big-board">
                        <SmallBoard
                            I={0}
                            J={0}
                        />
                    </td>
                    <td className="big-board big-vertical">
                        <SmallBoard
                            I={0}
                            J={1}
                        />
                    </td>
                    <td className="big-board">
                        <SmallBoard
                            I={0}
                            J={2}
                        />
                    </td>
                </tr>
                <tr>
                    <td className="big-board big-horizontal">
                        <SmallBoard
                            I={1}
                            J={0}
                        />
                    </td>
                    <td className="big-board big-horizontal big-vertical">
                        <SmallBoard
                            I={1}
                            J={1}
                        />
                    </td>
                    <td className="big-board big-horizontal">
                        <SmallBoard
                            I={1}
                            J={2}
                        />
                    </td>
                </tr>
                <tr>
                    <td className="big-board">
                        <SmallBoard
                            I={2}
                            J={0}
                        />
                    </td>
                    <td className="big-board big-vertical">
                        <SmallBoard
                            I={2}
                            J={1}
                        />
                    </td>
                    <td className="big-board">
                        <SmallBoard
                            I={2}
                            J={2}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

//TODO WORKING HERE THIS DOESNT WORK
function SmallBoard(props) {
    const [hoveredCell, setHoveredCell] = React.useState(null); // [i, j]
    const I = props.I;
    const J = props.J;

    const handleCellClick = (i, j) => {
        console.log(`Clicked on cell ${I}, ${J}, ${i}, ${j}`);
        gameBoard.updateBoard(I, J, i, j);
        gameBoard.nextTurn();
    };

    const handleCellMouseOver = (i, j) => {
        setHoveredCell({ i, j });
    };

    const handleCellMouseOut = () => {
        setHoveredCell(null);
    };

    const getCellClass = (i, j) => {
        let className = "";
        if (i === 1) { className += "horizontal "; }
        if (j === 1) { className += "vertical "; }
        return className;
    }

    return (
        <table className="inner-table">
            <tbody>
                {gameBoard.bigBoard[I][J].map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, j) => {
                            const isValid = gameBoard.validMove(I, J, i, j);
                            const isBlank = gameBoard.bigBoard[I][J][i][j] === '';
                            return (
                                <td
                                    key={j}
                                    className={getCellClass(i, j)}
                                    onClick={() => isValid && handleCellClick(i, j)}
                                    onMouseOver={() => isValid && handleCellMouseOver(i, j)}
                                    onMouseOut={handleCellMouseOut}
                                    style={{
                                        color: isValid && isBlank && hoveredCell?.i === i && hoveredCell?.j === j ? 'lightgray' : 'black',
                                        cursor: isValid && isBlank ? (hoveredCell?.i === i && hoveredCell?.j === j ? 'pointer' : 'default') : 'not-allowed',
                                    }}
                                >
                                    {cell || (isValid && hoveredCell?.i === i && hoveredCell?.j === j ? gameBoard.playerTurn : '')}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export function ChatBox() {
    return (
        <div className="chat-box">
            <h6>Chat History:</h6>
            <div className="chat-history"></div>
            <br />
            <form className="d-flex justify-content-center mx-2">
                <label htmlFor="chat-input">Chat:</label>
                <input type="text" id="chat-input" name="chat-input" />
                <button id="send-button" type="submit">Send</button>
            </form>
        </div>
    );
}

export function DrawMove({ I, J, i, j, move }) {
    const cell = document.querySelector(
        `.inner-table:nth-child(${I + 1}) > tbody > tr:nth-child(${i + 1}) > td:nth-child(${j + 1})`
    );
    cell.innerText = move;

    return null;
}
