import BaseEntity from "@/entities/BaseEntity";
import inputService from "@/services/inputService";

class Player extends BaseEntity {
  private updatePosition(deltaTime: number) {
    const input = inputService.getInput();
    const { x, y } = this.getPosition();

    if (input.up) {
      this.setPositionY(y - 300 * deltaTime);
    }
    
    if (input.right) {
      this.setPositionX(x + 300 * deltaTime);
    }
    
    if (input.down) {
      this.setPositionY(y + 300 * deltaTime);
    }
    
    if (input.left) {
      this.setPositionX(x - 300 * deltaTime);
    }
  }

  private drawPlayer(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getPosition();
    const { width, height } = this.getSize();

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, width, height);
  }

  public render(ctx: CanvasRenderingContext2D, deltaTime: number) {
    this.updatePosition(deltaTime);
    this.drawPlayer(ctx);
  }
}

export default Player;