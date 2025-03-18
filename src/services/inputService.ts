import { Service } from "@/types";

class InputService implements Service {
  private input: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  } = {
    up: false,
    down: false,
    left: false,
    right: false,
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

  public constructor() {
    document.addEventListener("keydown", (e) => {
      this.hideCursor();

      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        this.input.up = true;
      } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        this.input.down = true;
      } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        this.input.left = true;
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        this.input.right = true;
      } else {
        this.showCursor();
      }
    });
    
    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowUp" || e.key === "w") {
        this.input.up = false;
      } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        this.input.down = false;
      } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        this.input.left = false;
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        this.input.right = false;
      }
    });

    document.addEventListener("mousemove", () => {
      this.showCursor();
    }, { passive: true });
  }
};

export default new InputService();