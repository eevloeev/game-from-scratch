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

  private boxCollider: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  private isColliding: boolean;

  // TODO: Add collision logic
  public setPositionX(x: number) {
    this.position.x = x;
  }

  // TODO: Add collision logic
  public setPositionY(y: number) {
    this.position.y = y;
  }

  public setSize(width: number, height: number) {
    this.size = {
      width,
      height,
    };
  }

  public setBoxCollider(top: number, right: number, bottom: number, left: number) {
    this.boxCollider = {
      top,
      right,
      bottom,
      left,
    };
  }

  public setIsColliding(isColliding: boolean) {
    this.isColliding = isColliding;
  }

  public getPosition() {
    return this.position;
  }

  public getSize() {
    return this.size;
  }

  public getBoxCollider() {
    return this.boxCollider;
  }

  public getIsColliding() {
    return this.isColliding;
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

    this.boxCollider = {
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
    };

    this.isColliding = isColliding;
  }
}

export default BaseEntity;