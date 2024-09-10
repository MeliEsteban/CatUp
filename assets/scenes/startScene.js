export default class startScene extends Phaser.Scene {
    constructor() {
      super("startScene"); // Nombre de la escena
    }
  
    create() {
      const centerX = this.game.config.width / 2;
      const centerY = this.game.config.height / 2;
      
      this.cameras.main.setBackgroundColor("#24252A");
      // Mostrar texto de título
      this.add
        .text(centerX, centerY - 90, "¡Bienvenido al juego del gatito!", {
          fontSize: "30px",
          fill: "#fff",
          align: "center"
        })
        .setOrigin(0.5);
   
      // Mostrar texto de instrucciones
      this.add
        .text(centerX, centerY, "Instrucciones:\n- Mueve al gatito con las flechas\n- Esquiva los obstáculos\n- Recolecta estrellas", {
          fontSize: "24px",
          fill: "#fff",
          align: "center"
        })
        .setOrigin(0.5);
  
      // Mostrar el mensaje de "Click para comenzar"
      const infoText = this.add.text(centerX, centerY + 150, "Haz clic para comenzar", {
          fontSize: "32px",
          fill: "#fff",
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