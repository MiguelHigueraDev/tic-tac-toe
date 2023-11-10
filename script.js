
const GameBoard = function() {
    const board = [
    [], [], [], 
    [], [], [], 
    [], [], []
    ];
    const getBoard = () => board;

    const getSquare = (index) => board[index]; 
    const setSquare = (index, content) => {
        if(index < 0 || index > 8) return;
        board[index] = content; 
    }

    return {getBoard, getSquare, setSquare};
}();

const DisplayHandler = function() {

    const squares = document.querySelectorAll('.square');
    squares.forEach((el) => {
        el.addEventListener("click", () => setSquare(el.id))
    })

    const setSquare = (index) => {
        const status = GameBoard.getSquare(index);
        if(status.length !== 0) return;
        
        GameBoard.setSquare(index, "O");
        const square = document.getElementById(index);
        square.firstChild.textContent = "O";
        const span = document.getElementById(square);
    }
    return {setSquare}
}();


