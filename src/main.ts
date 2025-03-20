import "@/style.css";

import HomeScene from "@/scenes/HomeScene";
import assetService from "@/services/assetService";
import gameService from "@/services/gameService";
import playerUnarmedIdleSprite from "@/assets/player/Unarmed_Idle/Unarmed_Idle_full.png";
import playerUnarmedWalkSprite from "@/assets/player/Unarmed_Walk/Unarmed_Walk_full.png";

const { width, height } = gameService.getConfig();
const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Failed to get 2d context");
}

const render = () => {
  try {
    gameService.getCurrentScene()?.render(ctx);
  } catch (error) {
    console.error(error);
  }
  requestAnimationFrame(render);
};

assetService.loadAssets({
  playerUnarmedIdle: playerUnarmedIdleSprite,
  playerUnarmedWalk: playerUnarmedWalkSprite,
}).then(() => {
  document.body.appendChild(canvas);
  gameService.start();
  render();
});