import alt from '../lib/alt.js';
import { List } from 'immutable';

import VuMeterActions from '../actions/VuMeterActions.js';

import ParticipantStore from './ParticipantStore.js';

class VuMeterStore {
  constructor() {
    this.bindActions(VuMeterActions);
    this.on('init', () => {
      this.vumeters = new List();
      this.vuMeterInterval = null;
    });
  }

  onStartVuMeter() {
    this.vuMeterInterval = setInterval(() => {
      const { participants } = ParticipantStore.getState();

      if (!voxeet.conference) {
        return false;
      }

      const vumeters = participants.map(p => {
        let participantLevel = 0;
        voxeet.conference.rtc.getLevel(p.userId, level => {
          participantLevel = level;
        });

        return {
          userId: p.userId,
          level: !p.onAir || p.muted ? 0 : participantLevel,
        };
      });

      VuMeterActions.changeLevel.defer(vumeters);
    }, 100);
  }

  onStopVuMeter() {
    if (!this.vuMeterInterval) {
      return null;
    }

    clearInterval(this.vuMeterInterval);
  }

  onChangeLevel(vumeters) {
    this.vumeters = vumeters;
  }
}

export default alt.createStore(VuMeterStore, 'VuMeterStore');
