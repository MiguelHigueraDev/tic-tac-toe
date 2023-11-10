
const GameBoard = function() {
    let board = [
    [""], [""], [""],
    [""], [""], [""],
    [""], [""], [""]
    ];
    const getBoard = () => board;
    const resetBoard = () => board = [[""], [""], [""],[""], [""], [""],[""], [""], [""]];

    const getSquare = (index) => board[index][0]; 
    const setSquare = (index, content) => {
        if(getSquare(index).length > 0) return false;
        board[index] = content; 
        DisplayHandler.setSquare(index, content);
        return true;
    }

    return {getBoard, resetBoard, getSquare, setSquare};
}();

const MenuHandler = function() {
    const sections = document.querySelectorAll('section');
    const aiBtn = document.getElementById('ai-btn');
    const pvpBtn = document.getElementById('pvp-btn');

    const aiStartBtn = document.getElementById('btn-ai');
    const pvpNextBtn = document.getElementById('btn-1');
    const pvpStartBtn = document.getElementById('btn-2');

    const playerAiInput = document.getElementById('player-ai-name');
    const player1Input = document.getElementById('player-1-name');
    const player2Input = document.getElementById('player-2-name');

    aiBtn.addEventListener("click", () => setMenu("player-creation-ai"));
    pvpBtn.addEventListener("click", () => setMenu("player-creation-1"));

    pvpNextBtn.addEventListener("click", () => {
        let player1Name = player1Input.value;
        if(player1Name == "") {
            player1Input.value = "Player 1";
            player1Name = "Player 1";
        }
        setMenu("player-creation-2");
    });

    pvpStartBtn.addEventListener("click", () => {
        let player2Name = player2Input.value;
        if(player2Name == "") player2Name = "Player 2";
        let player1Name = player1Input.value;
        Game.startGame(player1Name, player2Name);
    })

    aiStartBtn.addEventListener("click", () => {
        let player1Name = playerAiInput.value;
        if(player1Name == "") player1Name = "Human";
        Game.startGame(player1Name, false);
    })

    const setMenu = (id) => {
        sections.forEach((sect) => sect.classList.add('hidden'));
        const el = document.getElementById(id);
        el.classList.remove('hidden');
    }

    const resetPlayers = () => {
        player1Input.value = "";
        player2Input.value = "";
    }

    return {setMenu, resetPlayers}
}();

const DisplayHandler = function() {
    const squares = document.querySelectorAll('.square');
    squares.forEach((el) => {
        el.addEventListener("click", () => Game.playTurn(el.id))
    })

    const currentPlayer = document.querySelector('.current-player');
    const currentTurnText = document.querySelector('.current-turn-text');
    const winningPlayer = document.querySelector('.winning-player');
    const endGameText = document.querySelector('#end-game-text');
    const restartButton = document.querySelector('#restart-game');
    restartButton.addEventListener("click", () => Game.restartGame())

    const getSquareElement = (index) => document.getElementById(index);

    const setSquare = (index, content) => {
        const el = getSquareElement(index);
        el.firstChild.textContent = content;
    }

    const setCurrentPlayer = (name) => currentPlayer.textContent = name;

    const setGameResult = (winner) => {
        currentPlayer.parentElement.classList.add('hidden');
        endGameText.classList.remove('hidden');
        restartButton.classList.remove('hidden');
        if(winner === false) {
            endGameText.textContent = "It's a tie! :("
            endGameText.classList.add('tie-text');
        } else {
            winningPlayer.textContent = winner;
            endGameText.classList.add('winner-text');
        }
    }

    const highlightWinner = (combination) => {
        combination.map((i) => {
            const el = document.getElementById(i);
            el.classList.add('square-winning');
        })
    }

    const resetDisplay = () => {
        currentPlayer.parentElement.classList.remove('hidden');
        currentPlayer.textContent = "";
        currentTurnText.classList.remove('hidden');
        endGameText.classList.add('hidden');
        restartButton.classList.add('hidden');
        squares.forEach((i) => {
            i.classList.remove('square-winning');
            i.firstChild.textContent = "";
        });
    }

    return {setSquare, highlightWinner, setCurrentPlayer, setGameResult, resetDisplay}
}();

const Player = function(sy, na, ai = false) {
    if(sy !== "O" && sy !== "X") return; 
    const symbol = sy;
    const name = na;
    const isAi = ai;
    let wins = 0;

    // TODO: keep track of wins
    const getWins = () => wins;
    const addWin = () => wins += 1;
    const getSymbol = () => symbol;
    const getName = () => name;

    return {getWins, addWin, getSymbol, getName, isAi}
}

const Game = function () {
    const winningCombinations = [
        [0, 3, 6], [0, 1, 2], [2, 5, 8], [6, 7, 8], [1, 4, 7], [3, 4, 5], [6, 4, 2], [0, 4, 8]
    ];

    let players = [];
    let currentPlayerIndex = 0;
    let status = "playing";

    const startGame = (player1, player2) => {
        if(player2 === false) {
            // AI
            const p1 = Player("X", player1);
            const p2 = Player("O", "AI", true);
            players = [p1, p2];
        } else {
            // PVP
            const p1 = Player("X", player1);
            const p2 = Player("O", player2);
            players = [p1, p2];
        }
        DisplayHandler.setCurrentPlayer(players[currentPlayerIndex].getName());
        MenuHandler.setMenu('game');
    }

    const checkWinner = () => {
        let filledCombinations = 0;
        for(combination of winningCombinations) {
            let countP1 = 0;
            let countP2 = 0;
            for(i of combination) {
                const sq = GameBoard.getSquare(i);
                if(sq === players[0].getSymbol()) countP1++;
                if(sq === players[1].getSymbol()) countP2++;
                if(countP1 === 3 || countP2 === 3) {
                    const winner = countP1 > countP2 ? players[0].getName() : players[1].getName();
                    status = "ended";
                    DisplayHandler.highlightWinner(combination);
                    return DisplayHandler.setGameResult(winner);
                }
                if(countP1 + countP2 === 3) filledCombinations++;
            }
        }
        // Tie
        if(filledCombinations === 8) {
            status = "ended";
            return DisplayHandler.setGameResult(false);
        } 
    }

    const playTurn = (index) => {
        if(status !== "playing") return;
        if (GameBoard.setSquare(index, players[currentPlayerIndex].getSymbol())) {
            currentPlayerIndex = (currentPlayerIndex == 0) ? 1 : 0;
            DisplayHandler.setCurrentPlayer(players[currentPlayerIndex].getName());
            checkWinner();
        }
        if(players[1].isAi) {
            playAiTurn();
        }

    }

    const playAiTurn = () => {
        // TODO: Implement minimax algorithm to make AI unbeatable
        if(status !== "playing") return;
        status = "ai-playing";
        setTimeout(() => {
            const legalMove = getLegalMove();
            GameBoard.setSquare(legalMove, players[1].getSymbol());
            currentPlayerIndex = 0;
            DisplayHandler.setCurrentPlayer(players[currentPlayerIndex].getName());
            status = "playing";
            checkWinner();
        }, 700);

    }

    const getLegalMove = () => {
        const randomIndex = Math.floor(Math.random() * 9);
        const sq = GameBoard.getSquare(randomIndex);
        if(sq.length === 0) return randomIndex;
        else return getLegalMove();
    }

    const restartGame = () => {
        currentPlayerIndex = 0;
        status = "playing";
        players = [];

        GameBoard.resetBoard();
        DisplayHandler.resetDisplay();
        MenuHandler.resetPlayers();
        MenuHandler.setMenu('mode-selection');

    }

    return {startGame, checkWinner, playTurn, restartGame}
}();


