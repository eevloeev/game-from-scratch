import { Renderable, Service } from "@/types";

declare global {
  interface Window {
    renderService: RenderService;
  }
}

class RenderService implements Service, Renderable {
  private renderables: Renderable[] = [];
  private lastTime: number = performance.now();

  public addRenderable(renderable: Renderable) {
    this.renderables.push(renderable);
  }

  public getRenderables() {
    return [...this.renderables];
  }

  public render(ctx: CanvasRenderingContext2D) {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.renderables.forEach((renderable) => {
      ctx.save();
      renderable.render(ctx, deltaTime);
      ctx.restore();
    });
  }
}

window.renderService = new RenderService();

export default window.renderService;