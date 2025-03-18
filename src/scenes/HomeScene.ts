import Barrel from "@/entities/Barrel";
import Player from "@/entities/Player/Player";
import BaseScene from "@/scenes/BaseScene";
import ConfigService from "@/services/configService";
import renderService from "@/services/renderService";

class HomeScene extends BaseScene {
  public render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    const config = ConfigService.getConfig();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, config.width, config.height);
  }

  protected onMounted() {
    renderService.addRenderable(new Player(100, 100));
    renderService.addRenderable(new Barrel(400, 100));
  }
}

export default HomeScene;
