import Cell from "./Cell.js";
import Ships from "./Ships.js";
import { letters } from "./letters.js";

export default class Board {
  constructor(player) {
    this.player = player;
    this.cells = {};
    this.takenCells = [];
    this.boardShips = {};
  }

  initializeBoard() {
    this.createBoard();
    this.appendNumbers();
    this.appendLetters();
    this.placeShipsOnBoard();
  }

  createBoard() {
    const board = document.querySelector(`#${this.player}`);
    for (let i = 0; i < 10; i++) {
      for (let j = 1; j <= 10; j++) {
        const square = document.createElement("div");
        const id = letters[i] + j;
        this.cells[id] = new Cell(id);
        square.setAttribute("id", `${id}-${this.player}`);
        square.setAttribute("class", "square");
        if (this.player === "enemy") square.classList.add("canClick");
        board.append(square);
      }
    }
  }

  appendNumbers() {
    const container = document.querySelector(`#${this.player}-board-numbers`);
    for (let i = 1; i <= 10; i++) {
      const element = document.createElement("div");
      element.textContent = i;
      container.appendChild(element);
    }
  }

  appendLetters() {
    const container = document.querySelector(`#${this.player}-board-letters`);
    for (let i = 0; i < 10; i++) {
      const element = document.createElement("div");
      element.textContent = letters[i];
      container.appendChild(element);
    }
  }

  placeShipsOnBoard() {
    const ships = new Ships();
    ships.createShips();
    const shipsInDescOrder = ships.ships.sort(
      (ship1, ship2) => ship2.size - ship1.size
    );
    for (const ship of shipsInDescOrder) {
      this.chooseShipsPlacement(ship);
      this.boardShips[ship.type] = ship;
    }
  }

  chooseShipsPlacement(ship) {
    const { position, size, type } = ship;
    let cells = [];
    const start = this.getRandomStartCell(position, size);

    const letter = start.match(/[A-J]/)[0];
    const number = start.match(/\d+/)[0];

    if (position === "vertical") {
      cells = Array.from(
        { length: size },
        (_, i) => String.fromCodePoint(letter.codePointAt(0) + i) + number
      );
    } else if (position === "horizontal") {
      cells = Array.from({ length: size }, (_, i) => letter + (+number + i));
    }
    const check = this.checkIfCellIsTaken(cells);
    if (check) this.chooseShipsPlacement(ship);
    else {
      this.takenCells = this.takenCells.concat(cells);
      cells.forEach((cell) => {
        this.cells[cell].shipType = type;
      });
      ship.startingCell = `${start}-${this.player}`;
      ship.cells = cells;
      if (this.player === "player") ship.addShipImageToBoard();
    }
  }

  getRandomStartCell(position, size) {
    if (position === "vertical") {
      return (
        letters[Math.floor(Math.random() * (10 - (size - 1)))] +
        Math.ceil(Math.random() * 10)
      );
    } else if (position === "horizontal") {
      return (
        letters[Math.floor(Math.random() * 10)] +
        Math.ceil(Math.random() * (10 - (size - 1)))
      );
    }
  }

  checkIfCellIsTaken(arrayOfCells) {
    return arrayOfCells.some((cell) => this.takenCells.includes(cell));
  }

  removeShipsFromBoard() {
    for (const ship of Object.values(this.boardShips)) {
      const startingCell = document.querySelector(`#${ship.startingCell}`);
      const img = document.querySelector(`#${ship.startingCell} img`);
      if (img) startingCell.removeChild(img);
    }
    for (const cell of this.takenCells) {
      this.cells[cell].shipType = "";
    }
    this.takenCells = [];
    this.boardShips = {};
  }

  clearBoard() {
    this.removeShipsFromBoard();
    this.points = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 1; j <= 10; j++) {
        const id = letters[i] + j;
        const square = document.querySelector(`#${id}-${this.player}`);
        this.cells[id] = new Cell(id);
        square.setAttribute("class", "square");
        if (this.player === "enemy") square.classList.add("canClick");
      }
    }
  }
}
