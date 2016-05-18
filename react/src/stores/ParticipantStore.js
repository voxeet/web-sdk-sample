import { List } from 'immutable';

import alt from '../lib/alt.js';

import ParticipantActions from '../actions/ParticipantActions.js';

class ParticipantStore {
  constructor() {
    this.bindActions(ParticipantActions);
    this.on('init', () => {
      this.participants = new List();
    });
  }

  onAddParticipant({ participant }) {
    const participants = this.participants;
    const index = this.participants.findIndex(p => p.userId === participant.userId);

    if (index !== -1) {
      return null;
    }

    this.participants = participants.push(participant);
  }

  onUpdateParticipant({ userId, data }) {
    const participants = new List(this.participants);

    const index = participants.findIndex(p => p.userId === userId);

    if (index === -1) {
      return null;
    }

    this.participants = new List(participants.update(
      index,
      participant => {
        return {
          ...participant,
          ...data,
        };
      }
    ));
  }

}

export default alt.createStore(ParticipantStore, 'ParticipantStore');
