import { Service } from "@/types";

type Input = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  isDiagonal: boolean;
  mouseX: number;
  mouseY: number;
  isMouseDown: boolean;
};

const initialInput: Input = {
  up: false,
  down: false,
  left: false,
  right: false,
  isDiagonal: false,
  mouseX: 0,
  mouseY: 0,
  isMouseDown: false,
};

class InputService implements Service {
  private input: Input = structuredClone(initialInput);

  public getInput() {
    return this.input;
  }

  private updateIsDiagonal() {
    this.input.isDiagonal = (this.input.up || this.input.down) && (this.input.left || this.input.right);

    if (this.input.up && this.input.down) {
      this.input.isDiagonal = false;
    } else if (this.input.left && this.input.right) {
      this.input.isDiagonal = false;
    }
  }

  public reset() {
    this.input = structuredClone(initialInput);
  }

  constructor() {
    document.addEventListener("keydown", (e) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        this.input.up = true;
      } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        this.input.down = true;
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        this.input.left = true;
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        this.input.right = true;
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

    document.addEventListener("mousemove", (e) => {
      this.input.mouseX = e.clientX;
      this.input.mouseY = e.clientY;
    }, { passive: true });

    document.addEventListener("mousedown", () => {
      this.input.isMouseDown = true;
    });

    document.addEventListener("mouseup", () => {
      this.input.isMouseDown = false;
    });
  }
};

export default new InputService();