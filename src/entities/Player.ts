import BaseEntity from "@/entities/BaseEntity";
import assetService from "@/services/assetService";
import inputService from "@/services/inputService";

type Direction = "up" | "down" | "left" | "right" | "up-right" | "up-left" | "down-right" | "down-left";

type State = "idle" | "walk";

const PLAYER_COLLIDER_WIDTH = 40;
const PLAYER_COLLIDER_HEIGHT = 64;
const PLAYER_SPEED = 300;
const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 64;
const FRAME_SCALE = 3;

const idleUp = {
  y: FRAME_HEIGHT * 3,
  count: 4,
  frameTime: 800,
};

const idleRight = {
  y: FRAME_HEIGHT * 2,
  count: 12,
  frameTime: 300,
};

const idleDown = {
  y: FRAME_HEIGHT * 0,
  count: 12,
  frameTime: 300,
};

const idleLeft = {
  y: FRAME_HEIGHT * 1,
  count: 12,
  frameTime: 300,
};

const walkUp = {
  y: FRAME_HEIGHT * 3,
  count: 6,
  frameTime: 100,
};

const walkRight = {
  y: FRAME_HEIGHT * 2,
  count: 6,
  frameTime: 100,
};

const walkDown = {
  y: FRAME_HEIGHT * 0,
  count: 6,
  frameTime: 100,
};

const walkLeft = {
  y: FRAME_HEIGHT * 1,
  count: 6,
  frameTime: 100,
};

const spriteSheets = {
  idle: {
    up: idleUp,
    right: idleRight,
    down: idleDown,
    left: idleLeft,
    "up-right": idleRight,
    "up-left": idleLeft,
    "down-right": idleRight,
    "down-left": idleLeft,
  },
  walk: {
    up: walkUp,
    right: walkRight,
    down: walkDown,
    left: walkLeft,
    "up-right": walkRight,
    "up-left": walkLeft,
    "down-right": walkRight,
    "down-left": walkLeft,
  },
};

class Player extends BaseEntity {
  private direction: Direction = "right";
  private state: State = "idle";
  private currentFrame = 0;
  private lastFrameTime = Date.now();

  private updatePosition(deltaTime: number) {
    const input = inputService.getInput();
    const { x: previousX, y: previousY } = this.getPreviousPosition();

    if (input.up) {
      const { y } = this.getPosition();
      this.setPositionY(y - PLAYER_SPEED * deltaTime);
    }
    
    if (input.right) {
      const { x } = this.getPosition();
      this.setPositionX(x + PLAYER_SPEED * deltaTime);
    }
    
    if (input.down) {
      const { y } = this.getPosition();
      this.setPositionY(y + PLAYER_SPEED * deltaTime);
    }
    
    if (input.left) {
      const { x } = this.getPosition();
      this.setPositionX(x - PLAYER_SPEED * deltaTime);
    }

    const { x: nextX, y: nextY } = this.getPosition();

    if (nextX !== previousX && nextY !== previousY) {
      if (nextX > previousX && nextY > previousY) {
        this.direction = "up-right";
      }

      if (nextX > previousX && nextY < previousY) {
        this.direction = "down-right";
      }
      
      if (nextX < previousX && nextY > previousY) {
        this.direction = "up-left";
      }

      if (nextX < previousX && nextY < previousY) {
        this.direction = "down-left";
      }
    } else {
      if (nextX > previousX) {
        this.direction = "right";
      }
      
      if (nextX < previousX) {
        this.direction = "left";
      }

      if (nextY > previousY) {
        this.direction = "down";
      }

      if (nextY < previousY) {
        this.direction = "up";
      }
    }

    if (previousX !== nextX || previousY !== nextY) {
      this.state = "walk";
    } else {
      this.state = "idle";
    }
  }

  private drawPlayer(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getPosition();
    const asset = assetService.getAsset(this.state === "idle" ? "playerUnarmedIdle" : "playerUnarmedWalk");
    
    const spriteSheet = spriteSheets[this.state][this.direction];

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      asset,
      FRAME_WIDTH * this.currentFrame,
      spriteSheet.y,
      FRAME_WIDTH, FRAME_HEIGHT,
      x - (FRAME_WIDTH - PLAYER_COLLIDER_WIDTH) / 2 - FRAME_WIDTH,
      y - (FRAME_HEIGHT - PLAYER_COLLIDER_HEIGHT) / 2 - FRAME_HEIGHT,
      FRAME_WIDTH * FRAME_SCALE, FRAME_HEIGHT * FRAME_SCALE,
    );
  }

  private updateFrame() {
    const now = Date.now();
    const timeSinceLastFrame = now - this.lastFrameTime;
    const spriteSheet = spriteSheets[this.state][this.direction];

    if (this.currentFrame >= spriteSheet.count) {
      this.currentFrame = 0;
    }

    if (timeSinceLastFrame >= spriteSheet.frameTime) {
      this.currentFrame = (this.currentFrame + 1) % spriteSheet.count;
      this.lastFrameTime = now;
    }
  }

  public render(ctx: CanvasRenderingContext2D, deltaTime: number) {
    super.render(ctx, deltaTime);
    this.updatePosition(deltaTime);
    this.updateFrame();
    this.drawPlayer(ctx);
  }

  public constructor(x: number, y: number, isCollidable: boolean) {
    super(x, y, PLAYER_COLLIDER_WIDTH, PLAYER_COLLIDER_HEIGHT, isCollidable);
  }
}

export default Player;