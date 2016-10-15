'use babel';

const RECT_FILTERS = {
  above: (rect, pt) => {
    return rect.left <= pt.x &&
      rect.right > pt.x &&
      rect.bottom <= pt.y;
  },
  below: (rect, pt) => {
    return rect.left <= pt.x &&
      rect.right > pt.x &&
      rect.top >= pt.y;
  },
  left: (rect, pt) => {
    return rect.top <= pt.y &&
      rect.bottom > pt.y &&
      rect.right <= pt.x;
  },
  right: (rect, pt) => {
    return rect.top <= pt.y &&
      rect.bottom > pt.y &&
      rect.left >= pt.x;
  },
};

const DISTANCE_MEASURE = {
  x: (rect, pt) => {
    return Math.min(
      Math.abs(rect.left - pt.x),
      Math.abs(rect.right - pt.x)
    );
  },
  y: (rect, pt) => {
    return Math.min(
      Math.abs(rect.top - pt.y),
      Math.abs(rect.bottom - pt.y)
    );
  },
};

const MEASURE_IDS = {
  above: 'y',
  below: 'y',
  left:  'x',
  right: 'x',
};

export default class Geometry {
  static getRectCenter(rect) {
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }

  static getNextRectIndex(rects, point, direction) {
    const rectFilter = RECT_FILTERS[direction];
    const possibleRects = rects.filter((rect) => {
      return rectFilter(rect, point);
    });
    if (possibleRects.length === 0) {
      return -1;
    }

    const measureId = MEASURE_IDS[direction];
    const measure = DISTANCE_MEASURE[measureId];
    const targetRect = possibleRects.reduce((r1, r2) => {
      const d1 = measure(r1, point);
      const d2 = measure(r2, point);
      return d1 < d2 ?
        r1 : r2;
    });
    return rects.indexOf(targetRect);
  }

  static isDirectionHorizontal(direction) {
    return MEASURE_IDS[direction] === 'x';
  }
}

Geometry.DIRECTION = {
  ABOVE: 'above',
  BELOW: 'below',
  LEFT:  'left',
  RIGHT: 'right',
};
