import gameService from "@/services/gameService";
import { Renderable } from "@/types";

class UserBar implements Renderable {
  public render(ctx: CanvasRenderingContext2D) {
    const score = gameService.getCurrentScene()?.getPlayers()[0].getScore();
    const health = gameService.getCurrentScene()?.getPlayers()[0].getHealth();
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "black";

    ctx.fillStyle = "chartreuse";
    ctx.fillText(`Score: ${score}`, ctx.canvas.width / 2 - 150, 50);
    ctx.fillStyle = "red";
    ctx.fillText(`Health: ${health}`, ctx.canvas.width / 2 + 150, 50);
  }
}

export default UserBar;