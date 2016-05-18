import alt from '../lib/alt.js';

class ParticipantActions {
  constructor() {
    this.generateActions(
      'addParticipant',
      'updateParticipant',
    );
  }

}

export default alt.createActions(ParticipantActions);
