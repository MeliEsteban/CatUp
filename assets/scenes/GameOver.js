export default class GameOver extends Phaser.Scene {
    constructor() {
      super("gameOver");
    }
  
    init(data) {
      this.starScore = data.starScore; // Recibir la cantidad de estrellas recolectadas
    }
  
    create() {

      this.add
        .text(
          this.game.config.width / 2,
          this.game.config.height / 2,
          "Game Over",
          {
            fontSize: "48px",
            fill: "#fff",
          }
        )
        .setOrigin(0.5);
  
      // Mostrar la cantidad de estrellas recolectadas
      this.add
        .text(
          this.game.config.width / 2,
          this.game.config.height / 2 + 50,
          `Score: ${this.starScore}`, // Texto que muestra la cantidad total
          {
            fontSize: "32px",
            fill: "#fff",
          }
        )
        .setOrigin(0.5);
  
      const restart = this.add.text(
          this.game.config.width / 2,
          this.game.config.height / 2 + 100,
          "Click to Restart",
          {
            fontSize: "32px",
            fill: "#fff",
          }
        )
        .setOrigin(0.5)
        .setInteractive()
        restart.on("pointerdown", () => {
          this.scene.start("game"); // Reiniciar el juego al hacer clic
        });
    }
  }