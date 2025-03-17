import { Renderable } from "@/types";

class PerfomanceBar implements Renderable {
  private frames: number = 0;
  private fps: number = 0;
  private lastFpsUpdate: number = performance.now();

  private handleRender() {
    this.frames++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastFpsUpdate >= 100) {
      this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastFpsUpdate));
      this.frames = 0;
      this.lastFpsUpdate = currentTime;
    }
  }

  private drawBar(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "yellow";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`FPS: ${this.fps}`, 10, 30);
  }

  public render(ctx: CanvasRenderingContext2D) {
    this.handleRender();
    this.drawBar(ctx);
  }
}

export default PerfomanceBar;