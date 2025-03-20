import assetService from "@/services/assetService";
import gameService from "@/services/gameService";
import { Animation, AnimationSequenceMap, Position, Size } from "@/types";

class BaseEntity {
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

  protected health = 1;
  private isDead = false;
  private damagable = false;

  private isCollidable: boolean = false;

  private velocity: {
    x: number;
    y: number;
  } = {
    x: 0,
    y: 0,
  };

  public setVelocity(x: number, y: number) {
    this.velocity = {
      x,
      y,
    };
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
    if (this.animation.name !== name) {
      this.animation.currentFrame = 0;
      this.animation.lastFrameTime = 0;
    }

    this.animation.name = name;
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

  public setHealth(health: number) {
    this.health = health;

    if (this.health <= 0) {
      this.isDead = true;
      this.destroy();
    }
  }

  public setDamagable(damagable: boolean) {
    this.damagable = damagable;
  }

  public decreaseHealth(amount: number) {
    if (this.damagable) {
      this.setHealth(this.health - amount);
    }
  }

  public getPosition(): Readonly<Position> {
    return this.position;
  }

  public getPreviousPosition(): Readonly<Position> {
    return this.previousPosition;
  }

  public getSize(): Readonly<Size> {
    return this.size;
  }

  public getIsCollidable() {
    return this.isCollidable;
  }

  public getAnimation(): Readonly<Animation> {
    return this.animation;
  }

  public getIsDead() {
    return this.isDead;
  }

  public getHealth() {
    return this.health;
  }

  public getDamagable() {
    return this.damagable;
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
  
  public destroy() {
    gameService.getCurrentScene()?.removeRenderable(this);
    this.onDestroy();
  }

  protected getCollidingRenderables(x?: number, y?: number) {
    const _x = x ?? this.position.x;
    const _y = y ?? this.position.y;

    const collidableEntities = gameService.getCurrentScene()?.getRenderables().filter((renderable) => (
      renderable !== this &&
      renderable instanceof BaseEntity &&
      renderable.getIsCollidable()
    )) as BaseEntity[];
    
    return collidableEntities.filter((entity) => (
      _x < entity.position.x + entity.size.width &&
      _x + this.size.width > entity.position.x &&
      _y < entity.position.y + entity.size.height &&
      _y + this.size.height > entity.position.y
    ));
  }

  protected onCreate() {}

  protected onRender(_ctx: CanvasRenderingContext2D, _deltaTime: number) {}

  protected onDestroy() {}

  private updatePreviousPosition() {
    this.previousPosition.x = this.position.x;
    this.previousPosition.y = this.position.y;
  }

  protected onCollision(_entity: BaseEntity) {}

  private _updatePosition(deltaTime: number) {
    if (!this.isCollidable) {
      this.position.x += this.velocity.x * deltaTime;
      this.position.y += this.velocity.y * deltaTime;
      return;
    }

    const newPosition = {
      x: this.position.x + this.velocity.x * deltaTime,
      y: this.position.y + this.velocity.y * deltaTime,
    };

    const collidingEntitiesX = this.getCollidingRenderables(newPosition.x, this.position.y);
    const collidingEntitiesY = this.getCollidingRenderables(this.position.x, newPosition.y);

    new Set([...collidingEntitiesX, ...collidingEntitiesY]).forEach((entity) => {
      this.onCollision(entity);
    });

    if (collidingEntitiesX.length === 0) {
      this.position.x = newPosition.x;
    } else {
      if (this.velocity.x > 0) {
        this.position.x = collidingEntitiesX[0].position.x - this.size.width;
      } else {
        this.position.x = collidingEntitiesX[0].position.x + collidingEntitiesX[0].size.width;
      }
    }

    if (collidingEntitiesY.length === 0) {
      this.position.y = newPosition.y;
    } else {
      if (this.velocity.y > 0) {
        this.position.y = collidingEntitiesY[0].position.y - this.size.height;
      } else {
        this.position.y = collidingEntitiesY[0].position.y + collidingEntitiesY[0].size.height;
      }
    }

    const collidingEntities = this.getCollidingRenderables(this.position.x, this.position.y);

    if (collidingEntities.length > 0) {
      this.position.x = this.previousPosition.x;
      this.position.y = this.previousPosition.y;
    }
  }

  public render(ctx: CanvasRenderingContext2D, deltaTime: number) {
    this.updatePreviousPosition();
    this._updatePosition(deltaTime);

    this.onRender(ctx, deltaTime);

    this.animate(ctx, deltaTime);
  }

  constructor(x: number, y: number, width: number, height: number) {
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