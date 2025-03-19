import Barrel from "@/entities/Barrel";
import Enemy from "@/entities/Enemy";
import Player from "@/entities/Player/Player";
import BaseScene from "@/scenes/BaseScene";
import ConfigService from "@/services/configService";
import renderService from "@/services/renderService";

class HomeScene extends BaseScene {
  private spawnInterval = 2000;
  private lastSpawnTime = 0;

  public render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    const config = ConfigService.getConfig();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, config.width, config.height);

    const now = Date.now();
    if (now - this.lastSpawnTime > this.spawnInterval) {
      this.lastSpawnTime = now;
      
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      
      let x = 0;
      let y = 0;
      
      switch (side) {
        case 0: // top
          x = Math.random() * config.width;
          y = 0 - Enemy.height * 2;
          break;
        case 1: // right
          x = config.width + Enemy.width * 2;
          y = Math.random() * config.height;
          break;
        case 2: // bottom
          x = Math.random() * config.width;
          y = config.height + Enemy.height * 2;
          break;
        case 3: // left
          x = 0 - Enemy.width * 2;
          y = Math.random() * config.height;
          break;
      }

      renderService.addRenderables(
        new Enemy(x, y),
      );
    }
  }

  protected onMounted() {
    renderService.addRenderables(
      new Player(100, 100),
      new Barrel(400, 100),
    );
  }
}

export default HomeScene;
