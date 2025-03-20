import BaseScene from "@/scenes/BaseScene";
import HomeScene from "@/scenes/HomeScene";
import inputService from "@/services/inputService";
import { Service } from "@/types";

class gameService implements Service {
  private config: {
    width: number;
    height: number;
  } = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  private currentScene: BaseScene | null = null;

  public getConfig() {
    return this.config;
  }

  public setCurrentScene(scene: BaseScene | null) {
    this.currentScene = scene;
  }

  public start() {
    inputService.reset();
    this.setCurrentScene(new HomeScene());
  };

  public getCurrentScene() {
    return this.currentScene;
  }
}

export default new gameService();
