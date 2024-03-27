// Diplay controller to update the player's turns and winning message.
const displayController = (() => {
  const renderMessage = (message) => {
    document.querySelector(".messageDisplay").innerText = message;
  };

  const renderTurn = (message) => {
    document.querySelector(".turnDisplay").innerText = message;
  };
  return {
    renderMessage,
    renderTurn,
  };
})();

// Gameboard module that contains the gameboard array as well as the rendering function to display the board properly between turns and resets.
const Gameboard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const renderBoard = () => {
    let boardHTML = "";
    gameboard.forEach((square, index) => {
      const isWinningSquare = checkForWin(index);
      const winningClass =
        isWinningSquare && checkForWin(index) ? "winning-square" : "";
      boardHTML += `<div class="square ${winningClass}" id="square-${index}">${square}</div>`;
    });
    document.querySelector("#board").innerHTML = boardHTML;
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", Game.handleClick);
    });
  };

  const checkForWin = (index) => {
    // Winning combinations logic.
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let combo of winningCombos) {
      if (combo.includes(index)) {
        const [a, b, c] = combo;
        if (
          gameboard[a] &&
          gameboard[a] === gameboard[b] &&
          gameboard[a] === gameboard[c]
        ) {
          return true;
        }
      }
    }
    return false;
  };

  function checkForTie(board) {
    return board.every((cell) => cell !== "");
  }

  const update = (index, value) => {
    gameboard[index] = value;
    renderBoard();
  };

  const getGameboard = () => gameboard; // Exports gameboard without having direct access to it

  return {
    // Exports all necessary functions while keeping the rest private.
    renderBoard,
    update,
    getGameboard,
    checkForWin,
    checkForTie,
  };
})();

// Create player factory function
const createPlayer = (name, mark, antimark) => {
  return {
    name,
    mark,
    antimark, // Used to update the current player display (the opposite mark)
  };
};

// Game play logic
const Game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;

  const start = () => {
    players = [
      createPlayer("Player 1", "X", "O"),
      createPlayer("Player 2", "O", "X"),
    ];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.renderBoard();
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", handleClick);
    });
    displayController.renderTurn(`${players[currentPlayerIndex].mark}'s turn.`);
  };

  const handleClick = (e) => {
    if (gameOver) {
      return;
    }
    let index = parseInt(e.target.id.split("-")[1]);
    if (Gameboard.getGameboard()[index] !== "") return;
    Gameboard.update(index, players[currentPlayerIndex].mark);

    if (Gameboard.checkForWin(index)) {
      gameOver = true;
      displayController.renderMessage(
        `${players[currentPlayerIndex].mark} wins!`
      );
    } else if (Gameboard.checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.renderMessage("It's a tie!");
    }
    displayController.renderTurn(
      `${players[currentPlayerIndex].antimark}'s turn.`
    );
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0; // Switches current player index
  };

  const resetGameboard = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
    currentPlayerIndex = 0;
    displayController.renderMessage("");
    Game.start();
    displayController.renderTurn("");
  };

  return {
    start,
    handleClick,
    resetGameboard,
  };
})();

// Functionality buttons
const startButton = document.querySelector(".startButton");
startButton.addEventListener("click", () => {
  Game.start();
});

const resetButton = document.querySelector(".resetButton");
resetButton.addEventListener("click", () => {
  Game.resetGameboard();
});
