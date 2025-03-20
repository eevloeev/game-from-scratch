export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

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
  destroy?: () => void;
};

export interface Service {};
