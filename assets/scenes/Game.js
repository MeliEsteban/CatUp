export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game" });
  }

  init() {
    this.firstMove = true;
    this.score = 0;
    this.sound.stopAll();
    this.balloonsRemaining = 3
    this.starScore = 0; // Inicializa el contador de estrellas
    this.obstacleTextures = ["obs_1", "obs_2"]; 
  }

  create() {
   // Inicializa cantidad de estrellas recolectadas
    this.starScore = 0;
    //musica
    this.music = this.sound.add("music", {
      volume: 0.4,
      loop: true,
     })

    this.music.play();

    this.addBackground();

    this.parallax = this.add.tileSprite(
      0, 0, 
      this.game.config.width, this.game.config.height, 
      "nubes"
    ).setOrigin(0, 0);

    this.parallax.setDepth(0);  // Asegura que esté detrás de los otros objetos pero sobre el fondo

    const centerX = this.game.config.width / 2;

    this.addSounds();
    this.addPlayer(centerX);
    this.addBalloons(centerX);

    // Grupo de figuras
    this.fallingShapes = this.physics.add.group({
      immovable: true, // Las figuras no se ven afectadas por colisiones
      allowGravity: false, // Gravedad para las figuras
    });

    // Grupo de estrellas
    this.fallingStars = this.physics.add.group({
      immovable: true, // Las estrellas no se ven afectadas por colisiones
      allowGravity: false, // Gravedad para las estrellas
    });

    // Temporizador para crear figuras cada 2 segundos
    this.time.addEvent({
      delay: 2000,
      callback: this.createFallingShape, // Función para crear una nueva figura
      callbackScope: this,
      loop: true, // Repetir indefinidamente
    });

    // Temporizador para crear estrellas cada 2 segundos
    this.time.addEvent({
      delay: 1000,
      callback: this.createFallingStar, // Función para crear una nueva estrella
      callbackScope: this,
      loop: true, // Repetir indefinidamente
    });

    // Flechas izquierda y derecha
    this.cursors = this.input.keyboard.createCursorKeys();
    //Función para recolectar estrellas
    this.physics.add.overlap(this.player, this.fallingStars, this.collectStar, null, this);

    //Texto de score de estrellas
    this.starScoreText = this.add.text(10, 10, 'Score: 0', {
      fontSize: '20px',
      fill: '#fff',
      fontFamily: 'Arial',
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
      Phaser.Math.Between(50, this.game.config.width),
      Phaser.Math.Between(-300, -150),
    randomTexture
  );

  if (randomTexture === "obs_1") {
    shape.setScale(0.8); 
  } ; 
  if (randomTexture === "obs_2") {
    shape.setScale(0.5);
  }
    shape.body.velocity.y = 190; // Velocidad de caída constante
  }

  createFallingStar() {
    const star = this.fallingStars.create(
        Phaser.Math.Between(80, this.game.config.width), 
        Phaser.Math.Between(-300, -150), 
        "star"
      )
      .setScale(0.2);
    star.body.velocity.y = 250;
  }

  // Lógica de colisión de los globos con los obstáculos
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

    // Destruye el obstáculo (figura)
    shape.destroy();

    // Destruye el globo después de que la animación haya terminado
    balloon.on("animationcomplete", () => {
      balloon.destroy();

      // Reduce el número de globos restantes
      this.balloonsRemaining--;

      // Verifica si ya no quedan globos, activar el game over
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

        // Destruye la estrella
        star.destroy();
    
        // Suma al contador de estrellas
        this.starScore += 1;
        this.playSound(this.sounds.star, {volume: 0.3 });
        // Actualiza el texto del puntaje
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

  // Posicion del jugador
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

      // Movimiento el jugador
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-300);

        // Solo m los globos si todavía existen
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
      // Crea la animacion de explosión para cada globos
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
