import PerfomanceBar from "@/entities/PerfomanceBar";
import HomeScene from "@/scenes/homeScene";
import configService from "@/services/configService";
import renderService from "@/services/renderService";

import "@/reset.css";

const config = configService.getConfig();

const canvas = document.createElement("canvas");
canvas.width = config.width;
canvas.height = config.height;

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Failed to get 2d context");
}

renderService.addRenderable(new HomeScene());
renderService.addRenderable(new PerfomanceBar());

const render = () => {
  renderService.render(ctx);
  requestAnimationFrame(render);
};

document.body.appendChild(canvas);

render();