export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
  }

  init() {
    this.firstMove = true;
    this.score = 0; // Inicializamos el score en 0
    this.sound.stopAll();
    this.balloonsRemaining = 3
    this.starScore = 0; // Inicializar el contador de estrellas
    this.obstacleTextures = ["obs_1", "obs_2"]; 
  }

  create() {
   // Inicializar cantidad de estrellas recolectadas
    this.starScore = 0;

    this.music = this.sound.add("music", {
      volume: 0.3,
      loop: true,
     })

    this.music.play();

    this.addBackground();

    this.parallax = this.add.tileSprite(
      0, 0, 
      this.game.config.width, this.game.config.height, 
      "nubes"
    ).setOrigin(0, 0);  // Aseguramos que el origen esté en la esquina superior izquierda

    this.parallax.setDepth(0);  // Asegura que esté detrás de los otros objetos pero sobre el fondo

    const centerX = this.game.config.width / 2;

    this.addSounds();
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

    this.physics.add.overlap(this.player, this.fallingStars, this.collectStar, null, this);

    //Texto de estrellas
    this.starScoreText = this.add.text(10, 10, 'Score: 0', {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'Arial Black',
    });

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
      this.cameras.main.shake(200, 0.01);
      this.scene.start("gameOver", { starScore: this.starScore });
      this.physics.pause();
      this.music.stop();
      return;
    }

    this.parallax.tilePositionY -= 0.8;

  }



  // Crear una figura que cae de forma individual
  createFallingShape() {
    const randomTexture = Phaser.Utils.Array.GetRandom(this.obstacleTextures);
    const shape = this.fallingShapes.create(
      Phaser.Math.Between(50, this.game.config.width), // Posición horizontal aleatoria
      Phaser.Math.Between(-300, -150), // Posición vertical para que aparezca fuera de la pantalla
    randomTexture // Aquí puedes usar la textura que desees para las figuras
  );

  if (randomTexture === "obs_1") {
    shape.setScale(0.8); // Cambia el valor 0.5 según cuánto desees reducirlo (0.5 es la mitad de su tamaño original)
  } ; 
  if (randomTexture === "obs_2") {
    shape.setScale(0.5); // Cambia el valor 0.5 según cuánto desees reducirlo (0.5 es la mitad de su tamaño original)
  }
    shape.body.velocity.y = 190; // Velocidad de caída constante
  }

  createFallingStar() {
    const star = this.fallingStars.create(
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
      balloon.play("boom1", false);
      this.playSound(this.sounds.stick, { volume: 0.5 });
    } else if (balloon.texture.key === "globo_2") {
      balloon.play("boom2", false);
      this.playSound(this.sounds.stick, { volume: 0.5 });
    } else if (balloon.texture.key === "globo_3") {
      balloon.play("boom3", false);
      this.playSound(this.sounds.stick, { volume: 0.5 });
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
        this.player.setVelocityY(200)
        this.playSound(this.sounds.death, {delay: 0.7, volume: 0.2 });
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

    
    collectStar(player, star) {

        // Destruir la estrella
        star.destroy();
    
        // Sumar al contador de estrellas
        this.starScore += 1;
        this.playSound(this.sounds.star, {volume: 0.4 });
        // Actualizar el texto del puntaje
        this.starScoreText.setText(`Score: ${this.starScore}`);
    }


  addSounds() {
    this.sounds = {
      death: this.sound.add("death"),
      stick: this.sound.add("stick"),
      star: this.sound.add("star")
    };
  }

  addBackground() {
    this.background = this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.background.setInteractive();
  }

  addPlayer(positionX) {
    this.player = this.physics.add
      .sprite(this.cameras.main.centerX, 800, "player")
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
        frameRate: 10,
        repeat: false,
      });

      const animationExplosion2 = this.anims.generateFrameNumbers("exp_glo2");
      const antExplo2 = animationExplosion2.slice();
      antExplo2.reverse();
      const anExp2 = antExplo2.concat(animationExplosion2);
      this.anims.create({
        key: "boom2",
        frames: anExp2,
        frameRate: 7,
        repeat: false,
      });

      const animationExplosion3 = this.anims.generateFrameNumbers("exp_glo3");
      const antExplo3 = animationExplosion3.slice();
      antExplo3.reverse();
      const anExp3 = antExplo3.concat(animationExplosion3);
      this.anims.create({
        key: "boom3",
        frames: anExp3,
        frameRate: 10,
        repeat: false,
      });
    }
  }
