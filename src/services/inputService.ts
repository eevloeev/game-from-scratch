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

  public constructor() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        this.input.up = true;
      } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        this.input.down = true;
      } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        this.input.left = true;
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        this.input.right = true;
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
  }
};

export default new InputService();