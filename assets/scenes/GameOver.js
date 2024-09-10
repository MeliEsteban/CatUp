export default class GameOver extends Phaser.Scene {
    constructor() {
      super("gameOver");
    }
  
    init(data) {
      this.starScore = data.starScore; // Recibir la cantidad de estrellas recolectadas
    }
  
    create() {

      this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'final').setOrigin(0.5, 0.5);

      // Mostrar la cantidad de estrellas recolectadas
      this.add
        .text(
          this.game.config.width / 2,
          this.game.config.height / 2 -187,
          `Score: ${this.starScore}`, // Texto que muestra la cantidad total
          {
            fontSize: "24px",
            fill: "#000",
            fontFamily: 'Candara'
          }
        )
        .setOrigin(0.5);
  
      const restart = this.add.text(
          this.game.config.width / 2,
          this.game.config.height / 2 -135,
          "Click to Restart",
          {
            fontSize: "24px",
            fill: "#000",
            fontFamily: 'Candara'
          }
        )
        .setOrigin(0.5)
        .setInteractive()
        restart.on("pointerdown", () => {
          this.scene.start("game"); // Reiniciar el juego al hacer clic
        });
    }
  }