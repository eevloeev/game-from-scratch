import BaseEntity from "@/entities/BaseEntity";
import Bullet from "@/entities/Bullet";
import { frameHeight, frameScale, frameWidth, sequenceMap } from "@/entities/Player/animation";
import gameService from "@/services/gameService";
import inputService from "@/services/inputService";

enum Direction {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
  UpRight = "up-right",
  UpLeft = "up-left",
  DownRight = "down-right",
  DownLeft = "down-left",
}

enum State {
  Idle = "idle",
  Walk = "walk",
}

type Weapon = {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
};

class Player extends BaseEntity {
  private walkSpeed = 300;
  private diagonalSpeed = this.walkSpeed * Math.sqrt(2) / 2;
  private state: State = State.Idle;
  private direction: Direction = Direction.Right;
  private weapon: Weapon = { x: 0, y: 0, width: 128, height: 4, angle: 0 };
  private attackCooldown = 500;
  private lastAttackTime = 0;
  private score = 0;
  protected health = 3;

  public getScore() {
    return this.score;
  }

  public addScore(amount: number) {
    this.score += amount;
  }

  public resetScore() {
    this.score = 0;
  }

  private updatePosition() {
    const input = inputService.getInput();
    const speed = input.isDiagonal ? this.diagonalSpeed : this.walkSpeed;

    let velocityX = 0;
    let velocityY = 0;

    if (input.up) {
      velocityY = -speed;
    }
    
    if (input.right) {
      velocityX = speed;
    }
    
    if (input.down) {
      velocityY = speed;
    }
    
    if (input.left) {
      velocityX = -speed;
    }

    this.setVelocity(velocityX, velocityY);
  }

  private updateWeaponPosition() {
    const { mouseX, mouseY } = inputService.getInput();
    const { x, y } = this.getPosition();
    const { width, height } = this.getSize();

    this.weapon.angle = Math.atan2(mouseY - y - height / 2, mouseX - x - width / 2);
    this.weapon.x = x + width / 2;
    this.weapon.y = y + height / 2;
  }

  private updateAnimation() {
    const { x: previousX, y: previousY } = this.getPreviousPosition();
    const { x: nextX, y: nextY } = this.getPosition();

    if (nextX !== previousX && nextY !== previousY) {
      if (nextX > previousX && nextY > previousY) {
        this.direction = Direction.UpRight;
      }

      if (nextX > previousX && nextY < previousY) {
        this.direction = Direction.DownRight;
      }
      
      if (nextX < previousX && nextY > previousY) {
        this.direction = Direction.UpLeft;
      }

      if (nextX < previousX && nextY < previousY) {
        this.direction = Direction.DownLeft;
      }
    } else {
      if (nextX > previousX) {
        this.direction = Direction.Right;
      }
      
      if (nextX < previousX) {
        this.direction = Direction.Left;
      }

      if (nextY > previousY) {
        this.direction = Direction.Down;
      }

      if (nextY < previousY) {
        this.direction = Direction.Up;
      }
    }

    if (previousX !== nextX || previousY !== nextY) {
      this.state = State.Walk;
    } else {
      this.state = State.Idle;
    }

    this.setAnimationName(`${this.state}-${this.direction}`);
  }

  private drawPlayer(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getPosition();
    const { width, height } = this.getSize();

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, width, height);
  }

  private drawWeapon(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.weapon.x, this.weapon.y);
    ctx.rotate(this.weapon.angle);

    ctx.fillStyle = "red";
    ctx.fillRect(0, -this.weapon.height / 2, this.weapon.width, this.weapon.height);

    ctx.restore();
  }

  private handleShooting() {
    const { isMouseDown } = inputService.getInput();
    const now = Date.now();

    if (isMouseDown && now - this.lastAttackTime >= this.attackCooldown) {
      this.lastAttackTime = now;
      const { x, y } = this.getPosition();
      const { width, height } = this.getSize();
      const { angle } = this.weapon;
      gameService.getCurrentScene()?.addRenderables(new Bullet(x + width / 2, y + height / 2, angle, this));
    }
  }

  protected onDestroy() {
    gameService.getCurrentScene()?.pause();
    alert(`Game over! Your score is ${this.score}. Press "OK" to restart.`);
    gameService.start();
  }

  public onRender(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
    this.updatePosition();
    this.updateWeaponPosition();
    this.handleShooting();
    // this.updateAnimation();
    this.drawPlayer(ctx);
    this.drawWeapon(ctx);
  }

  constructor(x: number, y: number) {
    super(x, y, 40, 64);
  }

  protected onCreate() {
    this.setIsCollidable(true);
    this.setDamagable(true);
    
    this.setAnimationSequenceMap(sequenceMap);
    this.setAnimationFrameWidth(frameWidth);
    this.setAnimationFrameHeight(frameHeight);
    this.setAnimationFrameScale(frameScale);
  }
}

export default Player;