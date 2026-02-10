export const matrices = {
  a2x2: [
    [1, 2],
    [3, 4],
  ],
  b2x2: [
    [5, 6],
    [7, 8],
  ],
  identity2x2: [
    [1, 0],
    [0, 1],
  ],
  zero2x2: [
    [0, 0],
    [0, 0],
  ],
  a3x3: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 10],
  ],
  singular3x3: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ],
  rect2x3: [
    [1, 2, 3],
    [4, 5, 6],
  ],
  a4x4: [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 12, 12],
    [13, 14, 15, 17],
  ],
};

export const datasets = {
  simple5: [1, 2, 3, 4, 5],
  withRepeats: [1, 1, 2, 3],
  identical: [5, 5, 5, 5],
  single: [42],
  negative: [-3, -1, 0, 2, 4],
  even: [1, 2, 3, 4, 5, 6],
  multimodal: [1, 1, 2, 2, 3],
  noMode: [1, 2, 3, 4],
  ten: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};

export const xyPoints = {
  linear: [
    { x: 1, y: 3 },
    { x: 2, y: 5 },
    { x: 3, y: 7 },
    { x: 4, y: 9 },
    { x: 5, y: 11 },
  ],
  quadratic: [
    { x: -2, y: 4 },
    { x: -1, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 4 },
  ],
  twoPoints: [
    { x: 0, y: 1 },
    { x: 1, y: 3 },
  ],
  singlePoint: [{ x: 1, y: 2 }],
  horizontal: [
    { x: 1, y: 5 },
    { x: 2, y: 5 },
    { x: 3, y: 5 },
  ],
  sameX: [
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 1, y: 3 },
  ],
};
