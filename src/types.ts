export interface Renderable {
  render: (ctx: CanvasRenderingContext2D, deltaTime: number) => void;
};

export interface Entity extends Renderable {
  setPositionX: (x: number) => void;
  setPositionY: (y: number) => void;
  setSize: (width: number, height: number) => void;
  setBoxCollider: (top: number, right: number, bottom: number, left: number) => void;
  setIsColliding: (isColliding: boolean) => void;
  getPosition: () => { x: number, y: number };
  getSize: () => { width: number, height: number };
  getBoxCollider: () => { top: number, right: number, bottom: number, left: number };
  getIsColliding: () => boolean;
};

export interface Service {};
