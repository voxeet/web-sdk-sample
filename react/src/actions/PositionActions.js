import alt from '../lib/alt.js';

class PositionActions {
  constructor() {
    this.generateActions(
      'updateUserPosition',
    );
  }
}

export default alt.createActions(PositionActions);
