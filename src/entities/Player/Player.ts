import BaseEntity from "@/entities/BaseEntity";
import { frameHeight, frameScale, frameWidth, sequenceMap } from "@/entities/Player/animation";
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

class Player extends BaseEntity {
  private walkSpeed = 300;
  private diagonalSpeed = this.walkSpeed * Math.sqrt(2) / 2;
  private state: State = State.Idle;
  private direction: Direction = Direction.Right;

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

  public onRender(ctx: CanvasRenderingContext2D, deltaTime: number) {
    ctx.imageSmoothingEnabled = false;
    this.updatePosition(deltaTime);
    this.updateAnimation();
  }

  public constructor(x: number, y: number) {
    super(x, y, 40, 64);
  }

  protected onCreate() {
    this.setIsCollidable(true);
    
    this.setAnimationSequenceMap(sequenceMap);
    this.setAnimationFrameWidth(frameWidth);
    this.setAnimationFrameHeight(frameHeight);
    this.setAnimationFrameScale(frameScale);
  }
}

export default Player;