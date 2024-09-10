export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    this.load.image("sky", "./assets/images/skay.png");
    this.load.image("star", "./assets/images/star.png");
    this.load.image("player", "./assets/images/player.png");
    this.load.image("globo_1", "./assets/images/globoN.png");
    this.load.image("globo_2", "./assets/images/globoR.png");
    this.load.image("globo_3", "./assets/images/globoV.png");
    this.load.image("obs_1", "./assets/images/obs4.png");
    this.load.image("obs_2", "./assets/images/obs3.png");

    this.load.audio("death", [
      "./assets/sounds/death.mp3",
    ]);
    this.load.audio("stick", [
      "./assets/sounds/stick.mp3",
    ]);

    this.load.spritesheet("exp_glo1", "./assets/images/expNaranja.png", {
      frameWidth: 140,
      frameHeight: 110,
    });

    this.load.spritesheet("exp_glo2", "./assets/images/expRosa.png", {
      frameWidth: 268,
      frameHeight: 159,
    });

    this.load.spritesheet("exp_glo3", "./assets/images/expVerde.png", {
      frameWidth: 373,
      frameHeight: 194,
    });
  }
    create() {
    this.scene.start("startScene");
  }
}
