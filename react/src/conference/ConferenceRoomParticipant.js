import React, { Component, PropTypes } from 'react';
import { DraggableCore } from 'react-draggable';

import ConferenceRoomParticipantVuMeter from './ConferenceRoomParticipantVuMeter.js';
import ConferenceRoomParticipantBar from './ConferenceRoomParticipantBar.js';

export default class ConferenceRoomParticipant extends Component {

  constructor(props) {
    super(props);
    this.position = null;
    this.updateUserPosition = this.updateUserPosition.bind(this);
  }

  updateUserPosition(position) {
    const { participant, positions, updateUserPosition } = this.props;
    const { posX, posY } = positions[participant.userId];
    const { clientX, clientY } = this.position;
    updateUserPosition({
      userId: participant.userId,
      posX: position.clientX - clientX + posX,
      posY: position.clientY - clientY + posY,
      manual: true,
    });
  }

  handleStart(event, ui) {
    this.position = ui.position;
  }

  handleDrag(event, ui) {
    const { participant, positions } = this.props;
    const { x, y } = positions[participant.userId];
    this.updateUserPosition(ui.position);
    if (x > -1 && x < 1) {
      this.position.clientX = ui.position.clientX;
    }
    if (y > -1 && y < 0) {
      this.position.clientY = ui.position.clientY;
    }
  }

  handleStop(event, ui) {
    this.updateUserPosition(ui.position);
  }

  render() {
    const { participant, positions } = this.props;

    if (!positions[participant.userId]) {
      return null;
    }

    const { posX, posY } = positions[participant.userId];

    return (
      <div style={{ transform: `translate(${posX}px,${posY}px)` }}>
        <DraggableCore
          onStart={(e, ui) => this.handleStart(e, ui)}
          onDrag={(e, ui) => this.handleDrag(e, ui)}
          onStop={(e, ui) => this.handleStop(e, ui)}
        >
          <div className="participant">
            {
              participant.muted ? (
                <span className="muted icon-mute" />
              ) : ''
            }
            <ConferenceRoomParticipantVuMeter
              participant={participant}
            />
            <ConferenceRoomParticipantBar
              participant={participant}
            />
          </div>
        </DraggableCore>
      </div>
    );
  }
}

ConferenceRoomParticipant.propTypes = {
  participant: PropTypes.object.isRequired,
  positions: PropTypes.array.isRequired,
  updateUserPosition: PropTypes.func.isRequired,
};
