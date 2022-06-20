import Ships from "./Ships.js";
import Game from "./Game.js";

const game = new Game();
game.init();

const newGameButton = document.querySelector("#new-game");
newGameButton.addEventListener("click", () => game.restartGame());
newGameButton.setAttribute("class", "inactive");
