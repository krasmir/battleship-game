export default class Ship {
  constructor(type, size) {
    this.type = type;
    this.size = size;
    this.hits = 0;
    this.position = Math.random() < 0.5 ? "vertical" : "horizontal";
    this.startingCell = "";
    this.cells = [];
    this.image = false;
  }

  hit() {
    this.hits += 1;
    return this.checkIsShipSunk();
  }

  checkIsShipSunk() {
    if (this.hits === this.size) {
      setTimeout(() => this.addShipImageToBoard(), 500);
      return true;
    }
    return false;
  }

  addShipImageToBoard() {
    if (this.image) return;
    let startingSquare = document.querySelector(`#${this.startingCell}`);
    let shipImg = document.createElement("img");
    // ships images found on https://www.pngegg.com
    let src =
      this.position === "vertical"
        ? `images/${this.type}-vertical.png`
        : `images/${this.type}.png`;
    shipImg.setAttribute("src", src);
    shipImg.setAttribute("class", `ship_img ${this.position}`);
    startingSquare.append(shipImg);
    this.image = true;
  }
}
