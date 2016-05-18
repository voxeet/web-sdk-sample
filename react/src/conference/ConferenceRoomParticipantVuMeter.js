import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import connectToStores from 'alt/utils/connectToStores';
import { List } from 'immutable';

import { getAvatarUrl } from '../lib/avatar.js';
import { createVolumeAvatar } from '../lib/volume.js';

import VuMeterStore from '../stores/VuMeterStore.js';

class ConferenceRoomParticipantVuMeter extends Component {

  constructor(props) {
    super(props);
    this.level = 0;
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    const { participant } = this.props;
    const photoUrl = getAvatarUrl(participant);
    this.setVolume = createVolumeAvatar(
      photoUrl,
      {
        selector: el,
        size: 110,
        lineWidth: 5,
        bgColor: '#fff',
      }
    );
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.vumeters.filter(vumeter => {
      return vumeter.userId === this.props.participant.userId;
    }).map(vumeter => {
      return vumeter.level !== this.level;
    });
  }

  componentDidUpdate() {
    this.props.vumeters.filter(vumeter => {
      return vumeter.userId === this.props.participant.userId;
    }).map(vumeter => {
      if (vumeter.level && vumeter.level > 0) {
        this.level = vumeter.level;
      } else {
        this.level = 0;
      }
      this.setVolume(this.level);
    });
  }

  static getStores() {
    return [VuMeterStore];
  }

  static getPropsFromStores() {
    return VuMeterStore.getState();
  }

  render() {
    return (
      <div className="avatar-vumeter"></div>
    );
  }
}

export default connectToStores(ConferenceRoomParticipantVuMeter);

ConferenceRoomParticipantVuMeter.propTypes = {
  vumeters: PropTypes.instanceOf(List).isRequired,
  participant: PropTypes.object.isRequired,
};
