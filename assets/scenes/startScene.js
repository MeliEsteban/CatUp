export default class startScene extends Phaser.Scene {
    constructor() {
      super("startScene"); // Nombre de la escena
    }
  
    create() {
      const centerX = this.game.config.width / 2;
      const centerY = this.game.config.height / 2;

      this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'inicio').setOrigin(0.5, 0.5);

      // Mostrar el mensaje de "Click para comenzar"
      const infoText = this.add.text(centerX, centerY + 107, "Click to play", {
          fontSize: "25px",
          fill: "#000",
          fontFamily: 'Candara'
        })
        .setOrigin(0.5).setInteractive();

      infoText.on("pointerdown", () => {
        this.scene.start("game"); // Iniciar la escena del juego
      })

      this.input.keyboard.on("keydown-SPACE", () => {
        this.scene.start("game"); // Iniciar la escena del juego al presionar la barra espaciadora
      });
    }
  }