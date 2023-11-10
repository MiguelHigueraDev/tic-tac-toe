
const GameBoard = function() {
    const board = [
    [""], [""], [""],
    [""], [""], [""],
    [""], [""], [""]
    ];
    const getBoard = () => board;

    const getSquare = (index) => board[index][0]; 
    const setSquare = (index, content) => {
        if(index < 0 || index > 8) return "invalid";
        board[index] = content; 
    }

    return {getBoard, getSquare, setSquare};
}();

const DisplayHandler = function() {

    const squares = document.querySelectorAll('.square');
    squares.forEach((el) => {
        el.addEventListener("click", () => setSquare(el))
    })

    const setSquare = (element) => {
        if(GameBoard.getSquare(element.id).length !== 0) return "invalid";
        GameBoard.setSquare(element.id, "O");
        element.firstChild.textContent = "O";
        console.log("set");
    }
    return {setSquare}
}();

const Player = function(t) {
    if(t !== "O" && t !== "X") return; 
    const type = t;
    let wins = 0;

    const getWins = () => wins;
    const addWin = () => wins =+ 1;
    const getType = () => type;


    return {getWins, addWin, getType}
}

const Game = function () {
    const winningCombinations = [
        [0, 3, 6], [0, 1, 2], [2, 5, 8], [6, 7, 8], [1, 4, 7], [3, 4, 5], [6, 4, 2], [0, 4, 8]
    ];

    const startGame = () => {
        const p1 = Player("X");
        const p2 = Player("O");
        return {p1, p2}
    }

    const getWinner = () => {
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
                    return console.log(winner + " wins with combination: " + combination);
                }
                if(countX + countO === 3) {
                    filledCombinations++;
                }
            }
        }
        // Tie
        if(filledCombinations === 8) {
            console.log("Tie");
        } 
    }


    return {startGame, getWinner}
}();


