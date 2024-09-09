export default class Game extends Phaser.Scene {
  constructor() {
    /* ---------- CONSTRUCTOR DE LA SCENA ----------- */
    super({ key: "Game" });
  }

  init() {
    this.firstMove = true;
    this.platformTouched = false;
    this.score = 0; // Inicializamos el score en 0
    this.sound.stopAll();
    this.gameOver = false;
    this.balloonsRemaining = 3;
  }

  create() {
    // Inicializar cantidad de estrellas recolectadas
    this.cantidadEstrellas = 0;

    // Mostrar el texto de estrellas recolectadas en la esquina superior derecha
    this.cantidadEstrellasTexto = this.add.text(
      this.game.config.width - 200, // Posición X, margen derecho
      20, // Posición Y, margen superior
      "Estrellas recolectadas: 0", // Texto inicial
      {
        fontSize: "24px", // Tamaño de fuente
        fill: "#fff", // Color del texto
      }
    );

    const centerX = this.game.config.width / 2;

    this.addSounds();
    this.addBackground();
    this.addPlayer(centerX);
    this.addBalloons(centerX);

    // Crear grupo de figuras
    this.fallingShapes = this.physics.add.group({
      immovable: true, // Las figuras no se ven afectadas por colisiones
      allowGravity: false, // Sin gravedad para las figuras
    });

    // Crear grupo de estrellas
    this.fallingStars = this.physics.add.group({
      immovable: true, // Las figuras no se ven afectadas por colisiones
      allowGravity: false, // Sin gravedad para las figuras
    });

    // Iniciar temporizador para crear figuras cada 2 segundos
    this.time.addEvent({
      delay: 2000, // 2 segundos
      callback: this.createFallingShape, // Función para crear una nueva figura
      callbackScope: this,
      loop: true, // Repetir indefinidamente
    });

    // Iniciar temporizador para crear figuras cada 2 segundos
    this.time.addEvent({
      delay: 1000, // 2 segundos
      callback: this.createFallingStar, // Función para crear una nueva figura
      callbackScope: this,
      loop: true, // Repetir indefinidamente
    });

    // Detectar las flechas izquierda y derecha
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(
      this.fallingStars,
      this.player,
      this.collectStars,
      null,
      this
    );

    this.physics.add.collider(
      [this.globo_1, this.globo_2, this.globo_3],
      this.fallingShapes,
      this.balloonHit,
      null,
      this
    );

    this.createExplosionsAnimations();
  }

  update() {
    if (this.gameOver) {
      return;
    }

    this.movePlayer();

    if (this.player.y > this.game.config.height) {
      this.gameOver = true;
      this.cameras.main.shake(200, 0.01);
      this.playSound(this.sounds.death, { delay: 0.5, volume: 0.5 });
      this.physics.pause();
      // this.showGameOverScreen();
      return;
    }
  }

  // Crear una figura que cae de forma individual
  createFallingShape() {
    const shape = this.fallingShapes.create(
      Phaser.Math.Between(50, this.game.config.width), // Posición horizontal aleatoria
      Phaser.Math.Between(-300, -150), // Posición vertical para que aparezca fuera de la pantalla
      "obs_1" // Aquí puedes usar la textura que desees para las figuras
    );

    shape.body.velocity.y = 190; // Velocidad de caída constante
  }

  createFallingStar() {
    const star = this.fallingStars
      .create(
        Phaser.Math.Between(80, this.game.config.width), // Posición horizontal aleatoria
        Phaser.Math.Between(-300, -150), // Posición vertical para que aparezca fuera de la pantalla
        "star" // Aquí puedes usar la textura que desees para las figuras
      )
      .setScale(0.2);

    star.body.velocity.y = 250; // Velocidad de caída constante
  }

  // Lógica para la colisión de los globos con los obstáculos
  balloonHit(balloon, shape) {
    // Ejecutar la animación de explosión correspondiente según el globo que haya sido impactado
    if (balloon.texture.key === "globo_1") {
      balloon.play("boom1", true);
    } else if (balloon.texture.key === "globo_2") {
      balloon.play("boom2", true);
    } else if (balloon.texture.key === "globo_3") {
      balloon.play("boom3", true);
    }

    // Destruir el obstáculo (figura)
    shape.destroy();

    // Destruir el globo después de que la animación haya terminado
    balloon.on("animationcomplete", () => {
      balloon.destroy();

      // Reducir el número de globos restantes
      this.balloonsRemaining--;

      // Verificar si ya no quedan globos, activar el game over
      if (this.balloonsRemaining <= 0) {
        this.gameOver = true;
        this.physics.pause(); // Pausar la física para detener el juego
        this.showGameOverScreen(); // Mostrar pantalla de Game Over
      }
    });
  }

  // Función para agregar globos
  addBalloons(positionX) {
    this.globo_1 = this.physics.add
      .sprite(this.player.x - 5, this.player.y - 80, "globo_1")
      .setScale(0.5);
    this.globo_1.setGravityY(0);

    this.globo_2 = this.physics.add
      .sprite(this.player.x + 25, this.player.y - 100, "globo_2")
      .setScale(0.5);
    this.globo_2.setGravityY(0);

    this.globo_3 = this.physics.add
      .sprite(this.player.x + 8, this.player.y - 120, "globo_3")
      .setScale(0.5);
    this.globo_3.setGravityY(0);
  }

  // Función para finalizar el juego y mostrar "Game Over"
  endGame() {
    this.gameOver = true;
    this.physics.pause(); // Pausar la física
    this.playSound(this.sounds.death, { volume: 0.5 });
    this.showGameOverScreen(); // Mostrar pantalla de Game Over
  }

  collectStars(jugador, estrella) {
    // Deshabilitar la estrella cuando es recolectada
    estrella.disableBody(true, true);
    
    // Incrementar la cantidad de estrellas recolectadas
    this.cantidadEstrellas++;

    // Sumar 15 puntos al score
    this.score += 15;

    // Actualizar el texto de cantidad de estrellas recolectadas
    this.cantidadEstrellasTexto.setText(
      "Estrellas recolectadas: " + this.cantidadEstrellas
    );
  }

  // Mostrar pantalla de Game Over
  showGameOverScreen() {
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

    this.add
      .text(
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
      .on("pointerdown", () => {
        this.scene.restart(); // Reiniciar el juego al hacer clic
      });
  }

  addSounds() {
    this.sounds = {
      death: this.sound.add("death"),
      run: this.sound.add("run"),
      stick: this.sound.add("stick"),
      pick: this.sound.add("pick"),
      click: this.sound.add("click"),
    };
  }

  addBackground() {
    this.background = this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.background.setInteractive();
  }

  addPlayer(positionX) {
    this.player = this.physics.add
      .sprite(this.cameras.main.centerX, this.cameras.main.centerY, "player")
      .setScale(0.5);
    this.player.setGravityY(0);
  }

  movePlayer() {
    if (this.gameOver) {
      return;
    }

    // Mover el jugador
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);

      // Solo mover los globos si todavía existen
      if (this.globo_1 && this.globo_1.active) {
        this.globo_1.setVelocityX(-300);
      }
      if (this.globo_2 && this.globo_2.active) {
        this.globo_2.setVelocityX(-300);
      }
      if (this.globo_3 && this.globo_3.active) {
        this.globo_3.setVelocityX(-300);
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);

      if (this.globo_1 && this.globo_1.active) {
        this.globo_1.setVelocityX(300);
      }
      if (this.globo_2 && this.globo_2.active) {
        this.globo_2.setVelocityX(300);
      }
      if (this.globo_3 && this.globo_3.active) {
        this.globo_3.setVelocityX(300);
      }
    } else {
      this.player.setVelocityX(0);

      if (this.globo_1 && this.globo_1.active) {
        this.globo_1.setVelocityX(0);
      }
      if (this.globo_2 && this.globo_2.active) {
        this.globo_2.setVelocityX(0);
      }
      if (this.globo_3 && this.globo_3.active) {
        this.globo_3.setVelocityX(0);
      }
    }
  }

  playSound(sound, options) {
    sound.play("", options);
  }

  createExplosionsAnimations() {
    // Crear animaciones de explosión para los globos
    const animationExplosion1 = this.anims.generateFrameNumbers("exp_glo1");
    const antExplo1 = animationExplosion1.slice();
    antExplo1.reverse();
    const anExp1 = antExplo1.concat(animationExplosion1);
    this.anims.create({
      key: "boom1",
      frames: anExp1,
      frameRate: 50,
      repeat: false,
    });

    const animationExplosion2 = this.anims.generateFrameNumbers("exp_glo2");
    const antExplo2 = animationExplosion2.slice();
    antExplo2.reverse();
    const anExp2 = antExplo2.concat(animationExplosion2);
    this.anims.create({
      key: "boom2",
      frames: anExp2,
      frameRate: 48,
      repeat: false,
    });

    const animationExplosion3 = this.anims.generateFrameNumbers("exp_glo3");
    const antExplo3 = animationExplosion3.slice();
    antExplo3.reverse();
    const anExp3 = antExplo3.concat(animationExplosion3);
    this.anims.create({
      key: "boom3",
      frames: anExp3,
      frameRate: 48,
      repeat: false,
    });
  }
}
