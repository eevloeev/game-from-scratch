import BaseEntity from "@/entities/BaseEntity";
import Player from "@/entities/Player/Player";

class Enemy extends BaseEntity {  
  public static width = 48;
  public static height = 48;

  private speed = 100;

  private updatePosition(deltaTime: number) {
    const targetPosition = Player.players[0].getPosition();
    const { x, y } = this.getPosition();

    const direction = {
      x: targetPosition.x - x,
      y: targetPosition.y - y,
    };

    const distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    const normalizedDirection = {
      x: direction.x / distance,
      y: direction.y / distance,
    };

    this.setPositionX(x + normalizedDirection.x * this.speed * deltaTime);
    this.setPositionY(y + normalizedDirection.y * this.speed * deltaTime);
  }

  private drawEnemy(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getPosition();
    const { width, height } = this.getSize();

    ctx.fillStyle = "orange";
    ctx.fillRect(x, y, width, height);
  }

  public onRender(ctx: CanvasRenderingContext2D, deltaTime: number) {
    this.updatePosition(deltaTime);
    this.drawEnemy(ctx);
  }

  constructor(x: number, y: number) {
    super(x, y, Enemy.width, Enemy.height);
  }

  protected onCreate() {
    this.setIsCollidable(true);
    this.setDamagable(true);
  }
};

export default Enemy;