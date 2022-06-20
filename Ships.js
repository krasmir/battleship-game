import Ship from "./Ship.js";
import { shipTypes } from "./shipTypes.js";

export default class Ships {
  constructor() {
    this.ships = [];
  }

  createShips() {
    for (const shipType in shipTypes) {
      const { name, size } = shipTypes[shipType];
      this.ships.push(new Ship(name, size));
    }
  }
}
