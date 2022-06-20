import Board from "./Board.js";
import EnemyAI from "./EnemyAI.js";

export default class Game {
  constructor() {
    this.playerBoard = new Board("player");
    this.enemyBoard = new Board("enemy");
    this.AI = {};
    this.enemyBoardEl = document.querySelector(`#enemy`);
    this.playerBoardEl = document.querySelector(`#player`);
    this.gameIsEnded = false;
    this.winner = "";
    this.playerHits = 0;
    this.enemyHits = 0;
    this.pointsToWin = 17;
  }
  init() {
    this.playerBoard.initializeBoard();
    this.enemyBoard.initializeBoard();
    this.enemyBoardEl.classList.add("inactive");
    this.enemyBoardEl.addEventListener("click", (event) =>
      this.playTurn(event)
    );
    const placeShipsButton = document.querySelector("#place-ships");
    placeShipsButton.addEventListener("click", () => {
      this.playerBoard.removeShipsFromBoard();
      this.playerBoard.placeShipsOnBoard();
    });
    const startGameButton = document.querySelector("#start-game");
    const newGameButton = document.querySelector("#new-game");
    startGameButton.addEventListener("click", () => {
      placeShipsButton.classList.add("inactive");
      startGameButton.classList.add("inactive");
      newGameButton.classList.remove("inactive");
      this.startGame();
    });
  }

  startGame() {
    this.AI = new EnemyAI(this.playerBoard);
    this.enemyBoardEl.classList.remove("inactive");
  }

  playTurn(event) {
    const targetId = event.target.id; //for example "A1-enemy"
    const id = targetId.split("-")[0];
    if (id in this.enemyBoard.cells && !this.enemyBoard.cells[id].firedAt) {
      this.enemyBoardEl.classList.add("inactive");
      const { wasItHit, didShipSink } = this.enemyBoard.cells[id].fire(
        this.enemyBoard.player,
        this.enemyBoard.boardShips
      );
      if (wasItHit) {
        this.playerHits++;
      }
      if (this.playerHits === this.pointsToWin) {
        this.gameIsEnded = true;
        this.winner = "player";
        this.endGame();
      }
      if (!this.gameIsEnded) {
        setTimeout(() => {
          const wasItHit = this.AI.fireAtCell();
          if (wasItHit) {
            this.enemyHits++;
          }
          if (this.enemyHits === this.pointsToWin) {
            this.gameIsEnded = true;
            this.winner = "enemy";
          }
          if (this.gameIsEnded) this.endGame();
        }, 1000);

        setTimeout(() => {
          if (!this.gameIsEnded) this.enemyBoardEl.classList.remove("inactive");
        }, 1500);
      }
    }
  }

  endGame() {
    this.enemyBoardEl.classList.add("inactive");
    this.playerBoardEl.classList.add("inactive");
  }

  restartGame() {
    this.playerBoard.clearBoard();
    this.enemyBoard.clearBoard();
    this.playerBoard.placeShipsOnBoard();
    this.enemyBoard.placeShipsOnBoard();
    this.AI = {};
    this.playerBoardEl.classList.remove("inactive");
    this.enemyBoardEl.classList.add("inactive");
    this.gameIsEnded = false;
    this.winner = "";
    this.playerHits = 0;
    this.enemyHits = 0;
    const placeShipsButton = document.querySelector("#place-ships");
    const startGameButton = document.querySelector("#start-game");

    placeShipsButton.classList.remove("inactive");
    startGameButton.classList.remove("inactive");

    const newGameButton = document.querySelector("#new-game");
    newGameButton.classList.add("inactive");
  }
}
