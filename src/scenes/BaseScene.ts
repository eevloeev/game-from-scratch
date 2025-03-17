import { Renderable } from "@/types";

class BaseScene implements Renderable {
  private mounted = false;

  public render(_ctx: CanvasRenderingContext2D) {
    if (!this.mounted) {
      this.mounted = true;
      this.onMounted();
    }
  }

  protected onMounted() {}
}

export default BaseScene;