import BaseEntity from "@/entities/BaseEntity";

class Barrel extends BaseEntity {  
  public onRender(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.getPosition();
    const { width, height } = this.getSize();

    ctx.fillStyle = "brown";
    ctx.fillRect(x, y, width, height);
  }

  public constructor(x: number, y: number) {
    super(x, y, 64, 64);
    this.setIsCollidable(true);
  }
};

export default Barrel;