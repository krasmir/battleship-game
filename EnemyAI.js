import { letters } from "./letters.js";

export default class EnemyAI {
  constructor(board) {
    this.board = board;
    this.chosenCells = new Set();
    this.unresolvedHits = new Set();
  }

  fireAtCell() {
    if (this.chosenCells.size === 100) return;
    const guess =
      this.unresolvedHits.size > 0
        ? this.makeEducatedGuess()
        : this.chooseRandomCell();
    const { wasItHit, didShipSink, shipCells } = this.board.cells[guess].fire(
      this.board.player,
      this.board.boardShips
    );
    if (wasItHit && !didShipSink) {
      this.unresolvedHits.add(guess);
    }
    if (didShipSink) {
      for (const cell of shipCells) {
        this.unresolvedHits.delete(cell);
      }
    }
    this.chosenCells.add(guess);

    return wasItHit;
  }

  chooseRandomCell() {
    const guess =
      letters[Math.floor(Math.random() * 10)] + Math.ceil(Math.random() * 10);
    if (this.chosenCells.has(guess)) return this.chooseRandomCell();
    else {
      return guess;
    }
  }

  makeEducatedGuess() {
    const prevHit = [...this.unresolvedHits][this.unresolvedHits.size - 1];
    const letter = prevHit.match(/[A-J]/)[0];
    const number = +prevHit.match(/\d+/)[0];
    const letterIndex = letters.indexOf(letter);

    let directions = this.getDirections(letterIndex, number);

    const shuffledDirections = [];
    while (directions.length > 0) {
      const randIndex = Math.floor(Math.random() * directions.length);
      const randDir = directions.splice(randIndex, 1)[0];
      shuffledDirections.push(randDir);
    }

    const adjacentCells = shuffledDirections.map((dir) =>
      this.getAdjacentCell(letterIndex, number, dir)
    );

    for (let i = 0; i < adjacentCells.length; i++) {
      const guess = adjacentCells[i];
      if (this.chosenCells.has(guess)) continue;
      return guess;
    }
    this.unresolvedHits.delete(prevHit);
    return this.unresolvedHits.size > 0
      ? this.makeEducatedGuess()
      : this.chooseRandomCell();
  }

  getDirections(cellLetterIndex, cellNumber) {
    let directions = ["up", "down", "right", "left"];
    if (cellLetterIndex === 0)
      directions = directions.filter((dir) => dir !== "up");
    if (cellLetterIndex === 9)
      directions = directions.filter((dir) => dir !== "down");
    if (cellNumber === 1)
      directions = directions.filter((dir) => dir !== "left");
    if (cellNumber === 10)
      directions = directions.filter((dir) => dir !== "right");
    return directions;
  }

  getAdjacentCell(cellLetterIndex, cellNumber, direction) {
    switch (direction) {
      case "up":
        return letters[cellLetterIndex - 1] + cellNumber;
      case "down":
        return letters[cellLetterIndex + 1] + cellNumber;
      case "right":
        return letters[cellLetterIndex] + (cellNumber + 1);
      case "left":
        return letters[cellLetterIndex] + (cellNumber - 1);
    }
  }
}
