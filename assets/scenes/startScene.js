export default class startScene extends Phaser.Scene {
    constructor() {
      super("startScene");
    }
  
    create() {
      const centerX = this.game.config.width / 2;
      const centerY = this.game.config.height / 2;

      this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'inicio').setOrigin(0.5, 0.5);

      // Textos
      const infoText = this.add.text(centerX, centerY + 107, "Click to play", {
          fontSize: "25px",
          fill: "#000",
          fontFamily: 'Candara'
        })
        .setOrigin(0.5).setInteractive();

      infoText.on("pointerdown", () => {
        this.scene.start("game"); // Inicia la escena del juego
      })
    }
  }