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
    this.load.image("nubes", "./assets/images/parallax.png");
    this.load.image("inicio", "./assets/images/inicio.png");
    this.load.image("final", "./assets/images/final.png");

    this.load.audio("death", [
      "./assets/sounds/death.mp3",
    ]);
    this.load.audio("stick", [
      "./assets/sounds/stick.mp3",
    ]);
    this.load.audio("star", [
      "./assets/sounds/star.mp3",
    ]);
    this.load.audio("music", [
      "./assets/sounds/music.mp3",
    ]);

     this.load.spritesheet("exp_glo1", "./assets/images/expNaranja.png", {
      frameWidth: 133,
      frameHeight: 139,
    });

    this.load.spritesheet("exp_glo2", "./assets/images/expRosa.png", {
      frameWidth: 133,
      frameHeight: 125,
    });

    this.load.spritesheet("exp_glo3", "./assets/images/expVerde.png", {
      frameWidth: 200,
      frameHeight: 188,
    }); 

  }
    create() {
    this.scene.start("startScene");
  }
}
