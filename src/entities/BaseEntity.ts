import renderService from "@/services/renderService";
import { Entity } from "@/types";

class BaseEntity implements Entity {
  private position: {
    x: number;
    y: number;
  };

  private size: {
    width: number;
    height: number;
  };

  private isCollidable: boolean;

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

  public setIsCollidable(isColliding: boolean) {
    this.isCollidable = isColliding;
  }

  public getPosition() {
    return this.position;
  }

  public getSize() {
    return this.size;
  }

  public getIsCollidable() {
    return this.isCollidable;
  }

  public render(_ctx: CanvasRenderingContext2D, _deltaTime: number) {
    throw new Error("Method not implemented.");
  }

  public constructor(x: number, y: number, width: number, height: number, isColliding: boolean) {
    this.position = {
      x,
      y,
    };

    this.size = {
      width,
      height,
    };

    this.isCollidable = isColliding;
  }
}

export default BaseEntity;