import Game from "../assets/scenes/Game.js";
import Preload from "../assets/scenes/Preload.js";

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 960,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [Preload, Game],
};

window.game = new Phaser.Game(config);
