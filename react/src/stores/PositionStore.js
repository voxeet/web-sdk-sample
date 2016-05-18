import alt from '../lib/alt.js';

import { getRelativePosition } from '../lib/position.js';

import PositionActions from '../actions/PositionActions.js';

class PositionStore {
  constructor() {
    this.positions = [];
    this.bindActions(PositionActions);
  }

  onUpdateUserPosition({ width, height, userId, posX, posY, manual = false }) {
    const { x, y } = getRelativePosition(width, height, posX, posY);

    this.positions[userId] = {
      posX,
      posY,
      x,
      y,
      manual,
    };

    voxeet.conference.rtc.setPeerPosition(userId, x, y);
  }
}

export default alt.createStore(PositionStore, 'PositionStore');
