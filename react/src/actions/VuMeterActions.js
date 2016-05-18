import alt from '../lib/alt.js';

class VuMeterActions {
  constructor() {
    this.generateActions(
      'startVuMeter',
      'stopVuMeter',
      'changeLevel',
    );
  }
}

export default alt.createActions(VuMeterActions);
