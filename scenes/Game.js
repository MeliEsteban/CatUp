import { gameOptions, playSound, stopSound } from "../utils/gameOptions.js";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
    this.firstMove = true;
    this.platformTouched = false;
    this.score = -1;
    this.sound.stopAll();
    this.gameOver = false;
  }

  create() {
    const centerX = this.game.config.width / 2;
    const positionY =
      this.game.config.height * gameOptions.firstPlatformPosition;

    this.addSounds();
    this.addBackground();
    this.addPlatforms(centerX, positionY);
    this.addUITexts(centerX);
    this.addPlayer(centerX);

    this.input.on("pointerdown", this.movePlayer, this);
    this.input.on("pointerup", this.stopPlayer, this);

    this.physics.add.collider(
      this.platformGroup,
      this.player,
      this.handleCollision,
      null,
      this
    );
  }

  update() {
    if (this.gameOver) {
      return;
    }
    this.platformGroup.getChildren().forEach(function (platform) {
      if (platform.getBounds().bottom < 0) {
        this.positionPlatform(platform);
      }
    }, this);

    if (this.player.body.touching.none) {
      this.platformTouched = false;
    }

    if (this.player.y > this.game.config.height || this.player.y < 0) {
      this.gameOver = true;
      this.cameras.main.shake(200, 0.01);
      playSound(this.sounds.death, { delay: 0.5, volume: 0.5});
      // pausar juego
      this.physics.pause();
      // show game over title
      this.add
        .text(this.centerX, this.centerY, "Game Over", {
          fontSize: "32px",
          fill: "#fff",
        })
        .setOrigin(0.5);
      // show final score
      this.add
        .text(this.centerX, this.centerY + 50, `Score: ${this.score}`, {
          fontSize: "32px",
          fill: "#fff",
        })
        .setOrigin(0.5);
      // show restart message
      this.add
        .text(this.centerX, this.centerY + 100, "Click to restart", {
          fontSize: "32px",
          fill: "#fff",
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => {
          this.scene.restart();
        });
        return;
    }
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
    this.centerX = this.game.config.width / 2;
    this.centerY = this.game.config.height / 2;
    this.background = this.add.image(this.centerX, this.centerY, "sky");
    this.background.displayWidth = this.game.config.width;
    this.background.displayHeight = this.game.config.height;
  }

  addPlatforms(positionX, positionY) {
    this.platformGroup = this.physics.add.group();

    const platform = this.platformGroup.create(
      positionX,
      positionY,
      "platform"
    );
    platform.setScale(0.3, 1);
    platform.setImmovable(true);

    for (let i = 0; i < 10; i++) {
      let platform = this.platformGroup.create(0, 0, "platform");
      platform.setImmovable(true);
      this.positionPlatform(platform);
    }
  }

  addPlayer(positionX) {
    this.player = this.physics.add.sprite(positionX, 0, "player");
    this.player.setScale(0.2);
    this.player.setGravityY(gameOptions.gameGravity);
  }

  addUITexts(positionX) {
    this.textTimer = this.add.text(10, 10, "0", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.textScore = this.add
      .text(this.game.config.width - 10, 10, "0", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(1, 0);

    this.textFirstMove = this.add
      .text(positionX, 500, "Hace clic para empezar", {
        fontSize: "32px",
        fill: "#fff",
      })
      .setOrigin(0.5, 0);
  }

  movePlayer(e) {
    if (this.gameOver) {
      return;
    }
    playSound(this.sounds.click, { volume: 0.5 });
    this.player.anims.play("run", false);
    playSound(this.sounds.run, { volume: 0.5, loop: false});
    const isClickedRight = e.x > this.game.config.width / 2;
    this.player.flipX = !isClickedRight;
    const speedX = gameOptions.heroSpeed * (isClickedRight ? 1 : -1);
    this.player.setVelocityX(speedX);

    if (this.firstMove) {
      this.firstMove = false;
      this.addTimer();
      this.textFirstMove.setText("");
      this.platformGroup.setVelocityY(-gameOptions.platformSpeed);
    }
  }

  stopPlayer() {
    this.player.setVelocityX(0);
    this.player.anims.stop();
    stopSound(this.sounds.run);
  }

  randomValue(a) {
    return Phaser.Math.Between(a[0], a[1]);
  }

  getLowestPlatform() {
    let lowestPlatform = 0;
    const hijos = this.platformGroup.getChildren();

    hijos.forEach(function (platform) {
      lowestPlatform = Math.max(lowestPlatform, platform.y);
    });
    return lowestPlatform;
  }

  positionPlatform(platform) {
    platform.y =
      this.getLowestPlatform() +
      this.randomValue(gameOptions.platformVerticalDistanceRange);

    platform.x =
      this.game.config.width / 2 +
      this.randomValue(gameOptions.platformHorizontalDistanceRange) *
        Phaser.Math.RND.sign();

    platform.displayWidth = this.randomValue(gameOptions.platformLengthRange);
  }

  addTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  updateTimer() {
    this.textTimer.setText(parseInt(this.textTimer.text) + 1);
  }

  handleCollision(player, platform) {
    if (!this.platformTouched) {
      this.platformTouched = true;
      this.score += 1;
      this.textScore.setText(this.score);
    }
  }
}
