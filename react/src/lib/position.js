/*
 * those values MUST stay in sync with the ones in bundle.styl
 * they're used by trigo to place users on the circle without causing overflow.
 * it's a chicken and egg problem, React can't know an element dimensions before
 * rendering it, and when it does it's too late.
*/
const USER_WIDTH = 160;
const USER_HEIGHT = 160;

// CSS origin (0,0) is top-left corner, center of circle is in bottom-middle
const getCircleCenterCoords = boxDimensions => {
  return {
    x: Math.round(boxDimensions.width / 2),
    y: Math.round(boxDimensions.height),
  };
};

// smallest dimension of parent container
// also need to deal with user badges which are centered
const getCircleRadius = boxDimensions => {
  return Math.round(boxDimensions.width / 1.5);
};

const bound = (min, value, max) => {
  return Math.max(min, Math.min(value, max));
};

// x = [-1, 1], y = [0, -1]
export const getRelativePosition = (width, height, posX, posY) => {
  const maxWidth = width - USER_WIDTH;
  const halfMaxWidth = maxWidth / 2;
  const maxHeight = height - USER_HEIGHT;

  return {
    x: bound(-1, (posX - halfMaxWidth) / halfMaxWidth, 1),
    y: bound(-1, (posY - maxHeight) / maxHeight, 0),
  };
};

export const getBoundedPosition = ({ width, height, posX, posY, ...params }) => {
  const maxWidth = width - USER_WIDTH;
  const maxHeight = height - USER_HEIGHT;

  return {
    width: width,
    height: height,
    posX: bound(0, posX, maxWidth),
    posY: bound(0, posY, maxHeight),
    ...params,
  };
};

export const getAbsolutePosition = ({ width, height, x, y, ...params }) => {
  const maxWidth = width - USER_WIDTH;
  const halfMaxWidth = maxWidth / 2;
  const maxHeight = height - USER_HEIGHT;

  return {
    width: width,
    height: height,
    posX: bound(0, halfMaxWidth * (x + 1), maxWidth),
    posY: bound(0, maxHeight * (y + 1), maxHeight),
    ...params,
  };
};

export const getOrganizedPosition = ({ width, height, size, index, ...params }) => {
  const maxWidth = width - USER_WIDTH;
  const maxHeight = height - USER_HEIGHT;

  const step = Math.PI / size;

  const centerCoords = getCircleCenterCoords({
    width: maxWidth,
    height: maxHeight,
  });

  const radius = getCircleRadius({
    width: maxWidth,
    height: maxHeight,
  });

  const angle = Math.PI - (step * index + step / 2.0);

  return getBoundedPosition({
    width: width,
    height: height,
    posX: Math.round(centerCoords.x + radius * Math.cos(angle) / 2),
    posY: Math.round(centerCoords.y - radius * Math.sin(angle) / 2 + USER_HEIGHT),
    ...params,
  });
};
