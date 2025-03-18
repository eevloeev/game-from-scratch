import PerfomanceBar from "@/entities/PerfomanceBar";
import HomeScene from "@/scenes/HomeScene";
import assetService from "@/services/assetService";
import configService from "@/services/configService";
import renderService from "@/services/renderService";
import playerUnarmedIdleSprite from "@/assets/player/Unarmed_Idle/Unarmed_Idle_full.png";
import playerUnarmedWalkSprite from "@/assets/player/Unarmed_Walk/Unarmed_Walk_full.png";

import "@/style.css";

const config = configService.getConfig();

const canvas = document.createElement("canvas");
canvas.width = config.width;
canvas.height = config.height;

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Failed to get 2d context");
}

await assetService.loadAssets({
  playerUnarmedIdle: playerUnarmedIdleSprite,
  playerUnarmedWalk: playerUnarmedWalkSprite,
});

renderService.addRenderable(new HomeScene());
renderService.addRenderable(new PerfomanceBar());

const render = () => {
  renderService.render(ctx);
  requestAnimationFrame(render);
};

document.body.appendChild(canvas);

render();