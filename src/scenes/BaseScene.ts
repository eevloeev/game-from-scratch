import Player from "@/entities/Player/Player";
import gameService from "@/services/gameService";
import { Renderable } from "@/types";

class BaseScene implements Renderable {
  private mounted = false;
  private renderables: Renderable[] = [];
  private lastTime: number = performance.now();
  private isPaused = false;
  private players: Player[] = [];

  public createPlayer() {
    const player = new Player(700, 350);
    this.players.push(player);
    this.addRenderables(player);
  }

  public getPlayers() {
    return this.players;
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
  }

  public addRenderables(...renderables: Renderable[]) {
    this.renderables.push(...renderables);
  }

  public getRenderables() {
    return [...this.renderables];
  }

  public removeRenderable(renderable: Renderable) {
    this.renderables = this.renderables.filter((r) => r !== renderable);
  }

  public clearRenderables() {
    this.renderables.forEach((renderable) => {
      renderable.destroy?.();
    });
    this.renderables = [];
  }

  protected beforeRender(_ctx: CanvasRenderingContext2D, _deltaTime: number) {}

  protected afterRender(_ctx: CanvasRenderingContext2D, _deltaTime: number) {}

  public render(ctx: CanvasRenderingContext2D) {
    if (this.isPaused) {
      return;
    }

    if (!this.mounted) {
      this.mounted = true;
      this.onMounted();
    }

    ctx.save();

    const { width, height } = gameService.getConfig();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.beforeRender(ctx, deltaTime);
    this.renderables.forEach((renderable) => {
      if (this.isPaused) {
        return;
      }
      renderable.render(ctx, deltaTime);
    });
    this.afterRender(ctx, deltaTime);
    
    ctx.restore();
  }

  protected onMounted() {}
}

export default BaseScene;