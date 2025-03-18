export type AnimationSequence = {
  row: number;
  count: number;
  frameTime: number;
  asset: string;
};

export type AnimationSequenceMap = {
  [key: string]: AnimationSequence;
};

export type Animation = {
  sequenceMap: AnimationSequenceMap;
  frameWidth: number;
  frameHeight: number;
  frameScale: number;
  name: string | null;
  currentFrame: number;
  lastFrameTime: number;
};

export interface Renderable {
  render: (ctx: CanvasRenderingContext2D, deltaTime: number) => void;
};

export interface Entity extends Renderable {
  // Setters
  setPositionX: (x: number) => void;
  setPositionY: (y: number) => void;
  setSize: (width: number, height: number) => void;
  setIsCollidable: (isCollidable: boolean) => void;
  setAnimationSequenceMap: (sequenceMap: AnimationSequenceMap) => void;
  setAnimationFrameWidth: (frameWidth: number) => void;
  setAnimationFrameHeight: (frameHeight: number) => void;
  setAnimationFrameScale: (frameScale: number) => void;
  setAnimationName: (name: string) => void;
  setAnimationCurrentFrame: (currentFrame: number) => void;
  setAnimationLastFrameTime: (lastFrameTime: number) => void;

  // Getters
  getPosition: () => { x: number, y: number };
  getPreviousPosition: () => { x: number, y: number };
  getSize: () => { width: number, height: number };
  getIsCollidable: () => boolean;
  getAnimation: () => Animation;
};

export interface Service {};
