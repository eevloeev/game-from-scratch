import BaseEntity from "@/entities/BaseEntity";
import Bullet from "@/entities/Bullet";
import { frameHeight, frameScale, frameWidth, sequenceMap } from "@/entities/Player/animation";
import inputService from "@/services/inputService";
import renderService from "@/services/renderService";

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
  public static players: Player[] = [];

  private walkSpeed = 300;
  private diagonalSpeed = this.walkSpeed * Math.sqrt(2) / 2;
  private state: State = State.Idle;
  private direction: Direction = Direction.Right;
  private weapon: Weapon = { x: 0, y: 0, width: 128, height: 4, angle: 0 };
  private attackCooldown = 500;
  private lastAttackTime = 0;

  private updatePosition(deltaTime: number) {
    const input = inputService.getInput();
    const speed = input.isDiagonal ? this.diagonalSpeed : this.walkSpeed;

    if (input.up) {
      const { y } = this.getPosition();
      this.setPositionY(y - speed * deltaTime);
    }
    
    if (input.right) {
      const { x } = this.getPosition();
      this.setPositionX(x + speed * deltaTime);
    }
    
    if (input.down) {
      const { y } = this.getPosition();
      this.setPositionY(y + speed * deltaTime);
    }
    
    if (input.left) {
      const { x } = this.getPosition();
      this.setPositionX(x - speed * deltaTime);
    }
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
      renderService.addRenderables(new Bullet(x + width / 2, y + height / 2, angle, this));
    }
  }

  public onRender(ctx: CanvasRenderingContext2D, deltaTime: number) {
    ctx.imageSmoothingEnabled = false;
    this.updatePosition(deltaTime);
    this.updateWeaponPosition();
    this.handleShooting();
    // this.updateAnimation();
    this.drawPlayer(ctx);
    this.drawWeapon(ctx);
  }

  constructor(x: number, y: number) {
    super(x, y, 40, 64);
    Player.players.push(this);
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