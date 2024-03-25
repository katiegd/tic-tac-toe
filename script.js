// const displayController = (() => {
//   const renderMessage = (message) => {
//     document.querySelector("#messageModal").innerText = "You lose!";
//   };
//   return {
//     renderMessage,
//   };
// })();

const Gameboard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const renderBoard = () => {
    let boardHTML = "";
    gameboard.forEach((square, index) => {
      boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
    });
    document.querySelector("#board").innerHTML = boardHTML;
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", Game.handleClick);
    });
  };

  const update = (index, value) => {
    gameboard[index] = value;
    renderBoard();
  };

  const getGameboard = () => gameboard;

  return {
    renderBoard,
    update,
    getGameboard,
  };
})();

const createPlayer = (name, mark) => {
  return {
    name,
    mark,
  };
};

const Game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;

  const start = () => {
    players = [createPlayer("Player 1", "X"), createPlayer("Player 2", "O")];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.renderBoard();
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.addEventListener("click", handleClick);
    });
  };

  const handleClick = (e) => {
    if (gameOver) {
      return;
    }
    let index = parseInt(e.target.id.split("-")[1]);
    if (Gameboard.getGameboard()[index] !== "") return;
    Gameboard.update(index, players[currentPlayerIndex].mark);

    if (
      checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)
    ) {
      gameOver = true;
      alert("You win!");
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      alert("It is a tie.");
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  const resetGameboard = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "");
    }
    currentPlayerIndex = 0;
    Gameboard.renderBoard();
  };

  return {
    start,
    handleClick,
    resetGameboard,
  };
})();

function checkForWin(board) {
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
  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

function checkForTie(board) {
  return board.every((cell) => cell !== "");
}

const startButton = document.querySelector(".startButton");
startButton.addEventListener("click", () => {
  Game.start();
});

const resetButton = document.querySelector(".resetButton");
resetButton.addEventListener("click", () => {
  Game.resetGameboard();
});