import { AnimationSequence, AnimationSequenceMap } from "@/types";

const idleLeft: AnimationSequence = {
  row: 1,
  count: 12,
  frameTime: 300,
  asset: "playerUnarmedIdle",
};

const idleRight: AnimationSequence = {
  row: 2,
  count: 12,
  frameTime: 300,
  asset: "playerUnarmedIdle",
};

const walkLeft: AnimationSequence = {
  row: 1,
  count: 6,
  frameTime: 100,
  asset: "playerUnarmedWalk",
};

const walkRight: AnimationSequence = {
  row: 2,
  count: 6,
  frameTime: 100,
  asset: "playerUnarmedWalk",
};

export const frameWidth = 64;

export const frameHeight = 64;

export const frameScale = 3;

export const sequenceMap: AnimationSequenceMap = {
  "idle-up": {
    row: 3,
    count: 4,
    frameTime: 800,
    asset: "playerUnarmedIdle",
  },
  "idle-down": {
    row: 0,
    count: 12,
    frameTime: 300,
    asset: "playerUnarmedIdle",
  },
  "idle-right": idleRight,
  "idle-left": idleLeft,
  "idle-up-right": idleRight,
  "idle-up-left": idleLeft,
  "idle-down-right": idleRight,
  "idle-down-left": idleLeft,
  "walk-up": {
    row: 3,
    count: 6,
    frameTime: 100,
    asset: "playerUnarmedWalk",
  },
  "walk-down": {
    row: 0,
    count: 6,
    frameTime: 100,
    asset: "playerUnarmedWalk",
  },
  "walk-right": walkRight,
  "walk-left": walkLeft,
  "walk-up-right": walkRight,
  "walk-up-left": walkLeft,
  "walk-down-right": walkRight,
  "walk-down-left": walkLeft,
};