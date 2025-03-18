import { Renderable } from "@/types";

class PerfomanceBar implements Renderable {
  private frames: number = 0;
  private fps: number = 0;
  private lastFpsUpdate: number = Date.now();

  private updateFps() {
    this.frames++;
    const currentTime = Date.now();
    
    if (currentTime - this.lastFpsUpdate >= 100) {
      this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastFpsUpdate));
      this.frames = 0;
      this.lastFpsUpdate = currentTime;
    }
  }

  private drawFps(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "yellow";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`FPS: ${this.fps}`, 10, 30);
  }

  public render(ctx: CanvasRenderingContext2D) {
    this.updateFps();
    this.drawFps(ctx);
  }
}

export default PerfomanceBar;