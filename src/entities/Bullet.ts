import BaseEntity from "@/entities/BaseEntity";
import Enemy from "@/entities/Enemy";
import Player from "@/entities/Player/Player";

class Bullet extends BaseEntity {
  public static width = 10;
  public static height = 10;

  private speed = 1000;
  private angle: number;
  private owner: BaseEntity;
  private damage = 1;

  private updatePosition() {
    this.setVelocity(this.speed * Math.cos(this.angle), this.speed * Math.sin(this.angle));
  }

  private drawBullet(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getPosition();
    const { width, height } = this.getSize();

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, width, height);
  }

  private handleIfOffScreen() {
    const { x, y } = this.getPosition();
    const { width, height } = this.getSize();

    if (x + width < 0 || x > window.innerWidth || y + height < 0 || y > window.innerHeight) {
      this.destroy();
    }
  }

  private handleHit() {
    const target = this.getCollidingRenderables()[0];

    if (!target || target === this.owner) {
      return;
    }

    if (target instanceof Player) {
      target.decreaseHealth(this.damage);
    } else if (target instanceof Enemy) {
      target.decreaseHealth(this.damage);

      if (target.getIsDead() && this.owner instanceof Player) {
        this.owner.addScore(1);
      }
    }

    this.destroy();
  }

  public onRender(ctx: CanvasRenderingContext2D) {
    this.updatePosition();
    this.handleHit();
    this.drawBullet(ctx);
    this.handleIfOffScreen();
  }

  constructor(x: number, y: number, angle: number, owner: BaseEntity) {
    super(x - Bullet.width / 2, y - Bullet.height / 2, Bullet.width, Bullet.height);
    this.angle = angle;
    this.owner = owner;
  }
}

export default Bullet;
