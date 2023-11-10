
const GameBoard = function() {
    const board = [
    [""], [""], [""],
    [""], [""], [""],
    [""], [""], [""]
    ];
    const getBoard = () => board;

    const getSquare = (index) => board[index][0]; 
    const setSquare = (index, content) => {
        if(getSquare(index).length > 0) return;
        board[index] = content; 
        DisplayHandler.setSquare(index, content);
    }

    return {getBoard, getSquare, setSquare};
}();

const DisplayHandler = function() {

    const squares = document.querySelectorAll('.square');
    squares.forEach((el) => {
        el.addEventListener("click", () => Game.playTurn(el.id))
    })

    const getSquareElement = (index) => document.getElementById(index);

    const setSquare = (index, content) => {
        const el = getSquareElement(index);
        el.firstChild.textContent = content;
    }

    const highlightWinner = (combination) => {
        // TODO
    }

    return {setSquare, highlightWinner}
}();

const Player = function(ty, na) {
    if(ty !== "O" && ty !== "X") return; 
    const type = ty;
    const name = na;
    let wins = 0;

    const getWins = () => wins;
    const addWin = () => wins =+ 1;
    const getType = () => type;
    const getName = () => name;

    return {getWins, addWin, getType, getName}
}

const Game = function () {
    const winningCombinations = [
        [0, 3, 6], [0, 1, 2], [2, 5, 8], [6, 7, 8], [1, 4, 7], [3, 4, 5], [6, 4, 2], [0, 4, 8]
    ];

    let currentPlayer = "X";
    let status = "playing";

    let p1, p2;

    const startGame = () => {
        p1 = Player("Miguel", "O");
        p2 = Player("Renzo", "X");
    }

    const checkWinner = () => {
        let filledCombinations = 0;
        for(combination of winningCombinations) {
            let countX = 0;
            let countO = 0;
            for(i of combination) {
                const sq = GameBoard.getSquare(i);
                if(sq.toUpperCase() === "X") countX++;
                if(sq.toUpperCase() === "O") countO++;
                if(countX === 3 || countO === 3) {
                    const winner = countX > countO ? "X" : "O";
                    status = "ended";
                    return console.log(winner + " wins with combination: " + combination);
                }
                if(countX + countO === 3) filledCombinations++;
            }
        }
        // Tie
        if(filledCombinations === 8) {
            console.log("Tie");
            status = "ended";
        } 
    }

    const playTurn = (index) => {
        if(status !== "playing") return;
        GameBoard.setSquare(index, currentPlayer);
        currentPlayer = (currentPlayer == "X") ? "O" : "X";
        checkWinner();
    }


    return {startGame, checkWinner, playTurn}
}();


