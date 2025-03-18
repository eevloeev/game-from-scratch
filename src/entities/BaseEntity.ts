import assetService from "@/services/assetService";
import renderService from "@/services/renderService";
import { Animation, AnimationSequenceMap, Entity } from "@/types";

class BaseEntity implements Entity {
  private position: {
    x: number;
    y: number;
  };

  private previousPosition: {
    x: number;
    y: number;
  };

  private size: {
    width: number;
    height: number;
  };

  private animation: Animation = {
    sequenceMap: {},
    frameWidth: 0,
    frameHeight: 0,
    frameScale: 1,
    name: null,
    currentFrame: 0,
    lastFrameTime: 0,
  };

  private isCollidable: boolean = false;

  public setPositionX(x: number) {
    if (this.isCollidable) {
      const collidableEntities = renderService.getRenderables().filter((renderable) => (
        renderable !== this &&
        renderable instanceof BaseEntity &&
        renderable.getIsCollidable()
      )) as BaseEntity[];
      
      const collidingEntities = collidableEntities.filter((entity) => (
        x < entity.position.x + entity.size.width &&
        x + this.size.width > entity.position.x &&
        this.position.y < entity.position.y + entity.size.height &&
        this.position.y + this.size.height > entity.position.y
      ));

      if (collidingEntities.length === 0) {
        this.position.x = x;
      } else {
        const direction = this.position.x - x < 0 ? 'right' : 'left';

        if (direction === 'right') {
          const leftMostCollidingEntity = collidingEntities.reduce((prev, current) => (
            prev.position.x < current.position.x ? prev : current
          ));

          this.position.x = leftMostCollidingEntity.position.x - this.size.width;
          
        } else {
          const rightMostCollidingEntity = collidingEntities.reduce((prev, current) => (
            prev.position.x > current.position.x ? prev : current
          ));

          this.position.x = rightMostCollidingEntity.position.x + rightMostCollidingEntity.size.width;
        }
      }
    } else {
      this.position.x = x;
    }
  }

  public setPositionY(y: number) {
    if (this.isCollidable) {
      const collidableEntities = renderService.getRenderables().filter((renderable) => (
        renderable !== this &&
        renderable instanceof BaseEntity &&
        renderable.getIsCollidable()
      )) as BaseEntity[];
      
      const collidingEntities = collidableEntities.filter((entity) => (
        this.position.x < entity.position.x + entity.size.width &&
        this.position.x + this.size.width > entity.position.x &&
        y < entity.position.y + entity.size.height &&
        y + this.size.height > entity.position.y
      ));

      if (collidingEntities.length === 0) {
        this.position.y = y;
      } else {
        const direction = this.position.y - y < 0 ? 'down' : 'up';

        if (direction === 'down') {
          const upMostCollidingEntity = collidingEntities.reduce((prev, current) => (
            prev.position.y < current.position.y ? prev : current
          ));

          this.position.y = upMostCollidingEntity.position.y - this.size.height;
          
        } else {
          const downMostCollidingEntity = collidingEntities.reduce((prev, current) => (
            prev.position.y > current.position.y ? prev : current
          ));

          this.position.y = downMostCollidingEntity.position.y + downMostCollidingEntity.size.height;
        }
      }
    } else {
      this.position.y = y;
    }
  }

  public setSize(width: number, height: number) {
    this.size = {
      width,
      height,
    };
  }

  public setIsCollidable(isCollidable: boolean) {
    this.isCollidable = isCollidable;
  }

  public setAnimationSequenceMap(sequenceMap: AnimationSequenceMap) {
    this.animation.sequenceMap = sequenceMap;
  }

  public setAnimationName(name: string) {
    this.animation.name = name;
    // this.animation.currentFrame = 0;
    // this.animation.lastFrameTime = 0;
  }

  public setAnimationCurrentFrame(currentFrame: number) {
    this.animation.currentFrame = currentFrame;
  }

  public setAnimationLastFrameTime(lastFrameTime: number) {
    this.animation.lastFrameTime = lastFrameTime;
  }

  public setAnimationFrameWidth(frameWidth: number) {
    this.animation.frameWidth = frameWidth;
  }

  public setAnimationFrameHeight(frameHeight: number) {
    this.animation.frameHeight = frameHeight;
  }

  public setAnimationFrameScale(frameScale: number) {
    this.animation.frameScale = frameScale;
  }

  public getPosition() {
    return this.position;
  }

  public getPreviousPosition() {
    return this.previousPosition;
  }

  public getSize() {
    return this.size;
  }

  public getIsCollidable() {
    return this.isCollidable;
  }

  public getAnimation() {
    return this.animation as Readonly<Animation>;
  }

  protected animate(ctx: CanvasRenderingContext2D, _deltaTime: number) {
    if (!this.animation.name) {
      return;
    }

    const { x, y } = this.getPosition();
    const { width, height } = this.getSize();
    const { frameWidth, frameHeight } = this.getAnimation();

    const now = Date.now();
    const sequence = this.animation.sequenceMap[this.animation.name];

    if (this.animation.currentFrame >= sequence.count) {
      this.animation.currentFrame = 0;
    }

    if (now - this.animation.lastFrameTime >= sequence.frameTime) {
      this.animation.currentFrame = (this.animation.currentFrame + 1) % sequence.count;
      this.animation.lastFrameTime = now;
    }

    ctx.drawImage(
      assetService.getAsset(sequence.asset),
      frameWidth * this.animation.currentFrame,
      sequence.row * frameHeight,
      frameWidth, frameHeight,
      x - (frameWidth - width) / 2 - frameWidth,
      y - (frameHeight - height) / 2 - frameHeight,
      frameWidth * this.animation.frameScale, frameHeight * this.animation.frameScale,
    );
  }

  protected onCreate() {}

  protected onRender(_ctx: CanvasRenderingContext2D, _deltaTime: number) {}

  public render(ctx: CanvasRenderingContext2D, deltaTime: number) {
    this.previousPosition.x = this.position.x;
    this.previousPosition.y = this.position.y;

    this.onRender(ctx, deltaTime);

    this.animate(ctx, deltaTime);
  }

  public constructor(x: number, y: number, width: number, height: number) {
    this.position = {
      x,
      y,
    };

    this.previousPosition = {
      x,
      y,
    };

    this.size = {
      width,
      height,
    };

    this.onCreate();
  }
}

export default BaseEntity;