import { Service } from "@/types";

class InputService implements Service {
  private input: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    isDiagonal: boolean;
  } = {
    up: false,
    down: false,
    left: false,
    right: false,
    isDiagonal: false,
  };

  public getInput() {
    return this.input;
  }

  private hideCursor() {
    document.body.style.cursor = "none";
  }

  private showCursor() {
    document.body.style.cursor = "default";
  }

  private updateIsDiagonal() {
    this.input.isDiagonal = (this.input.up || this.input.down) && (this.input.left || this.input.right);
  }
  public constructor() {
    document.addEventListener("keydown", (e) => {
      this.hideCursor();

      if (e.code === "ArrowUp" || e.code === "KeyW") {
        this.input.up = true;
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        this.input.down = true;
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        this.input.left = true;
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        this.input.right = true;
      } else {
        this.showCursor();
      }

      this.updateIsDiagonal();
    });
    
    document.addEventListener("keyup", (e) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        this.input.up = false;
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        this.input.down = false;
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        this.input.left = false;
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        this.input.right = false;
      }

      this.updateIsDiagonal();
    });

    document.addEventListener("mousemove", () => {
      this.showCursor();
    }, { passive: true });
  }
};

export default new InputService();