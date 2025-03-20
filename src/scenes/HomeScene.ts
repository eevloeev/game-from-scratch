import Barrel from "@/entities/Barrel";
import Enemy from "@/entities/Enemy";
import DebugBar from "@/renderables/DebugBar";
import PerfomanceBar from "@/renderables/PerfomanceBar";
import UserBar from "@/renderables/UserBar";
import BaseScene from "@/scenes/BaseScene";
import gameService from "@/services/gameService";
import { Renderable } from "@/types";

class HomeScene extends BaseScene {
  private lastSpawnTime = 0;
  private spawnInterval = 2000;
  private spawnDecreaseInterval: NodeJS.Timeout | null = null;
  private gui: Renderable[] = [];

  private spawnEnemies() {
    const { width, height } = gameService.getConfig();

    const now = Date.now();
    if (now - this.lastSpawnTime > this.spawnInterval) {
      this.lastSpawnTime = now;
      
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      
      let x = 0;
      let y = 0;
      
      switch (side) {
        case 0: // top
          x = Math.random() * width;
          y = 0 - Enemy.height * 2;
          break;
        case 1: // right
          x = width + Enemy.width * 2;
          y = Math.random() * height;
          break;
        case 2: // bottom
          x = Math.random() * width;
          y = height + Enemy.height * 2;
          break;
        case 3: // left
          x = 0 - Enemy.width * 2;
          y = Math.random() * height;
          break;
      }

      this.addRenderables(
        new Enemy(x, y),
      );
    }
  }

  private drawGui(ctx: CanvasRenderingContext2D, deltaTime: number) {
    this.gui.forEach((renderable) => {
      renderable.render(ctx, deltaTime);
    });
  }

  protected beforeRender() {
    this.spawnEnemies();
  }

  protected afterRender(ctx: CanvasRenderingContext2D, deltaTime: number) {
    this.drawGui(ctx, deltaTime);
  }

  protected onMounted() {
    this.addRenderables(new Barrel(400, 100));
    this.createPlayer();
    this.gui.push(
      new PerfomanceBar(),
      new DebugBar(),
      new UserBar(),
    );
    this.createSpawnDecreaseInterval();
  }

  private createSpawnDecreaseInterval() {
    this.spawnDecreaseInterval = setInterval(() => {
      const newSpawnInterval = this.spawnInterval * 0.95;

      if (newSpawnInterval < 1000) {
        this.spawnInterval = 1000;
      } else {
        this.spawnInterval = newSpawnInterval;
      }
    }, 5000);
  }

  public onDestroy() {
    if (this.spawnDecreaseInterval) {
      clearInterval(this.spawnDecreaseInterval);
    }
  }
}
export default HomeScene;
