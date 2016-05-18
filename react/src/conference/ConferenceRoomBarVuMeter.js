import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import connectToStores from 'alt/utils/connectToStores';
import { List } from 'immutable';

import { createVolumeAvatar } from '../lib/volume.js';
import VuMeterStore from '../stores/VuMeterStore.js';

class ConferenceRoomBarVuMeter extends Component {
  constructor(props) {
    super(props);
    this.level = 0;
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.setVolume = createVolumeAvatar(
      null,
      {
        selector: el,
        size: 70,
        lineWidth: 5,
        bgColor: 'transparent',
      }
    );
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.vumeters.filter(vumeter => {
      return vumeter.userId === voxeet.userId;
    }).map(vumeter => {
      return vumeter.level !== this.level;
    });
  }

  componentDidUpdate() {
    this.props.vumeters.filter(vumeter => {
      return vumeter.userId === voxeet.userId;
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
      <div className="me-vumeter"></div>
    );
  }
}

export default connectToStores(ConferenceRoomBarVuMeter);

ConferenceRoomBarVuMeter.propTypes = {
  vumeters: PropTypes.instanceOf(List).isRequired,
  me: PropTypes.object.isRequired,
};
