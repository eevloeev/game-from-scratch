export interface Renderable {
  render: (ctx: CanvasRenderingContext2D, deltaTime: number) => void;
};

export interface Entity extends Renderable {
  setPositionX: (x: number) => void;
  setPositionY: (y: number) => void;
  setSize: (width: number, height: number) => void;
  setIsCollidable: (isCollidable: boolean) => void;
  getPosition: () => { x: number, y: number };
  getSize: () => { width: number, height: number };
  getIsCollidable: () => boolean;
};

export interface Service {};
