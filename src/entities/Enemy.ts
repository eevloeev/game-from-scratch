import BaseEntity from "@/entities/BaseEntity";
import Player from "@/entities/Player/Player";
import gameService from "@/services/gameService";

class Enemy extends BaseEntity {
  public static width = 48;
  public static height = 48;

  private speed = 100;
  private damage = 1;

  private updatePosition() {
    const currentScene = gameService.getCurrentScene();

    if (!currentScene) {
      return;
    }

    const targetPosition = currentScene.getPlayers()[0].getPosition();
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

    this.setVelocity(normalizedDirection.x * this.speed, normalizedDirection.y * this.speed);
  }

  protected onCollision(entity: BaseEntity) {
    if (entity instanceof Player && entity.getDamagable()) {
      entity.decreaseHealth(this.damage);
      this.destroy();
    }
  }

  private drawEnemy(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getPosition();
    const { width, height } = this.getSize();

    ctx.fillStyle = "orange";
    ctx.fillRect(x, y, width, height);
  }

  public onRender(ctx: CanvasRenderingContext2D) {
    this.updatePosition();
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