import PerfomanceBar from "@/renderables/PerfomanceBar";
import HomeScene from "@/scenes/HomeScene";
import assetService from "@/services/assetService";
import configService from "@/services/configService";
import renderService from "@/services/renderService";
import playerUnarmedIdleSprite from "@/assets/player/Unarmed_Idle/Unarmed_Idle_full.png";
import playerUnarmedWalkSprite from "@/assets/player/Unarmed_Walk/Unarmed_Walk_full.png";

import "@/style.css";
import DebugBar from "@/renderables/DebugBar";

const config = configService.getConfig();

const canvas = document.createElement("canvas");
canvas.width = config.width;
canvas.height = config.height;

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Failed to get 2d context");
}

const bootstrap = async () => {
  await assetService.loadAssets({
    playerUnarmedIdle: playerUnarmedIdleSprite,
    playerUnarmedWalk: playerUnarmedWalkSprite,
  });
  
  renderService.addRenderables(
    new HomeScene(),
    new PerfomanceBar(),
    new DebugBar(),
  );
  
  const render = () => {
    renderService.render(ctx);
    requestAnimationFrame(render);
  };
  
  document.body.appendChild(canvas);
  
  render();
};

bootstrap();