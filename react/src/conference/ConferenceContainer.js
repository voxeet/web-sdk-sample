import React, { Component, PropTypes } from 'react';
import connectToStores from 'alt/utils/connectToStores';
import { List } from 'immutable';

import alt from '../lib/alt.js';

import PositionStore from '../stores/PositionStore.js';
import ParticipantStore from '../stores/ParticipantStore.js';
import ParticipantActions from '../actions/ParticipantActions.js';
import VuMeterActions from '../actions/VuMeterActions.js';

import ConferenceRoom from './ConferenceRoom.js';

require('../fonts/icomoon.css');
require('../styles/Conference.less');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conference: null,
    };
  }

  componentDidMount() {
    voxeet.on('conferenceJoined', () => {
      this.setState({
        conference: voxeet.conference,
      });
      ParticipantActions.addParticipant({
        participant: {
          userId: voxeet.userId,
          onAir: true,
          muted: false,
        },
      });
      VuMeterActions.startVuMeter.defer();
    });

    voxeet.on('conferenceLeft', () => {
      alt.recycle();
      VuMeterActions.stopVuMeter.defer();
      this.setState({
        conference: null,
      });
    });

    voxeet.on('participantAdded', (peerId, stream) => {
      ParticipantActions.addParticipant({
        participant: {
          userId: peerId,
          stream: stream,
          onAir: true,
          muted: false,
        },
      });
    });

    voxeet.on('participantRemoved', (peerId) => {
      ParticipantActions.updateParticipant({
        userId: peerId,
        data: {
          stream: null,
          onAir: false,
        },
      });
    });
  }

  static getStores() {
    return [PositionStore, ParticipantStore];
  }

  static getPropsFromStores() {
    return {
      ...PositionStore.getState(),
      ...ParticipantStore.getState(),
    };
  }

  render() {
    const { participants, positions } = this.props;
    const { conference } = this.state;

    if (conference && participants) {
      return (
        <ConferenceRoom
          positions={positions}
          participants={participants}
        />
      );
    }

    return null;
  }
}

export default connectToStores(App);

App.propTypes = {
  positions: PropTypes.array.isRequired,
  participants: PropTypes.instanceOf(List).isRequired,
};
