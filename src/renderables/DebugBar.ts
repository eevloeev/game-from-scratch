import inputService from "@/services/inputService";
import { Renderable } from "@/types";

class DebugBar implements Renderable {
  private drawInput(ctx: CanvasRenderingContext2D) {
    const { up, down, left, right, isMouseDown } = inputService.getInput();

    ctx.font = "bold 20px Arial";
    ctx.textAlign = "right";
    
    ctx.fillStyle = up ? "green" : "yellow";
    ctx.fillText("Up", ctx.canvas.width - 10, 30);
    ctx.fillStyle = down ? "green" : "yellow";
    ctx.fillText("Down", ctx.canvas.width - 10, 60);
    ctx.fillStyle = left ? "green" : "yellow";
    ctx.fillText("Left", ctx.canvas.width - 10, 90);
    ctx.fillStyle = right ? "green" : "yellow";
    ctx.fillText("Right", ctx.canvas.width - 10, 120);
    ctx.fillStyle = isMouseDown ? "green" : "yellow";
    ctx.fillText("LMB", ctx.canvas.width - 10, 150);
  }

  public render(ctx: CanvasRenderingContext2D) {
    this.drawInput(ctx);
  }
}

export default DebugBar;