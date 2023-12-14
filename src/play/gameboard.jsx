import React from "react";
import "./play.css";
import { GameBoard } from "./gameboard.js";

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

function SmallBoard(props) {
    const [cells, setCells] = React.useState(Array(3).fill(Array(3).fill(null)));
    const [hoveredCell, setHoveredCell] = React.useState(null); // [i, j]
    const I = props.I;
    const J = props.J;

    const handleCellClick = (i, j) => {
        console.log(`Clicked on cell ${I}, ${J}, ${i}, ${j}`)
        const newCells = cells.map(row => [...row]); // create a deep copy of cells
        newCells[i][j] = 'X';
        setCells(newCells);
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
                {cells.map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, j) => {
                            const isValid = isValidMove(I, J, i, j);
                            return (
                                <td
                                    key={j}
                                    className={getCellClass(i, j)}
                                    onClick={() => isValid && handleCellClick(i, j)}
                                    onMouseOver={() => isValid && handleCellMouseOver(i, j)}
                                    onMouseOut={handleCellMouseOut}
                                    style={{
                                        color: isValid && cell === null && hoveredCell?.i === i && hoveredCell?.j === j ? 'lightgray' : 'black',
                                        cursor: isValid && cell === null ? (hoveredCell?.i === i && hoveredCell?.j === j ? 'pointer' : 'default') : 'not-allowed',
                                    }}
                                >
                                    {cell || (isValid && hoveredCell?.i === i && hoveredCell?.j === j ? 'X' : '')}
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

function isValidMove(I, J, i, j) {
    if ((I + J + i + j) % 3 === 0) { return true; }
    return true;
}