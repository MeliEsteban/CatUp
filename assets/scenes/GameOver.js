export default class GameOver extends Phaser.Scene {
    constructor() {
      super("gameOver");
    }
  
    init(data) {
      this.starScore = data.starScore; // Recibe la cantidad de estrellas recolectadas
    }
  
    create() {
      //Imagen de fondo de game over
      this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'final').setOrigin(0.5, 0.5);

      // Muestra la cantidad de estrellas recolectadas
      this.add
        .text(
          this.game.config.width / 2,
          this.game.config.height / 2 -187,
          `Score: ${this.starScore}`, // Texto cantidad total
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
          this.scene.start("game"); // Reinicia el juego al hacer click
        });
    }
  }