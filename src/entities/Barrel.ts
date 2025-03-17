import BaseEntity from "@/entities/BaseEntity";

class Barrel extends BaseEntity {  
  private drawBarrel(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getPosition();
    const { width, height } = this.getSize();

    ctx.fillStyle = "brown";
    ctx.fillRect(x, y, width, height);
  }

  public render(ctx: CanvasRenderingContext2D) {
    this.drawBarrel(ctx);
  }
};

export default Barrel;