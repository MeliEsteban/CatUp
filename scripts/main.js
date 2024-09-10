import Preload from "../assets/scenes/Preload.js";
import startScene from "../assets/scenes/startScene.js";
import Game from "../assets/scenes/Game.js";
import GameOver from '../assets/scenes/GameOver.js';

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
  scene: [Preload, startScene, Game, GameOver],
};

window.game = new Phaser.Game(config);
