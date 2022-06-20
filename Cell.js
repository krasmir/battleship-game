export default class Cell {
  constructor(id) {
    this.id = id;
    this.firedAt = false;
    this.shipType = "";
  }

  fire(player, ships) {
    if (this.firedAt) return;
    const element = document.querySelector(`#${this.id}-${player}`);
    element.classList.remove("canClick");
    this.firedAt = true;

    const result = { wasItHit: false, didShipSink: false, shipCells: [] };

    if (this.shipType !== "") {
      element.classList.add("hitMoment");
      result.wasItHit = true;
      result.didShipSink = ships[this.shipType].hit();
      if (result.didShipSink) result.shipCells = ships[this.shipType].cells;
      setTimeout(() => {
        element.classList.remove("hitMoment");
        element.classList.add("hit");
      }, 500);
      return result;
    } else {
      element.classList.add("missMoment");
      setTimeout(() => {
        element.classList.remove("missMoment");
        element.classList.add("miss");
      }, 500);
      return result;
    }
  }
}
