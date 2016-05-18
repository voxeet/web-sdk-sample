import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { List } from 'immutable';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { getBoundedPosition, getAbsolutePosition, getOrganizedPosition } from '../lib/position.js';

import PositionActions from '../actions/PositionActions.js';

import ConferenceRoomParticipant from './ConferenceRoomParticipant.js';

class ConferenceRoomParticipants extends Component {
  constructor(props) {
    super(props);
    this.resizeSensor = null;
    this.updateUserPosition = this.updateUserPosition.bind(this);
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this.refs.roomNode);
    this.resizeSensor = new ResizeSensor(node, () => this.handleResize());
    this.handleResize();
  }

  componentDidUpdate(prevProps) {
    const { participants } = this.props;
    if (participants.size !== prevProps.participants.size) {
      this.handleResize();
    }
  }

  componentWillUnmount() {
    if (this.resizeSensor) {
      this.resizeSensor.detach();
      this.resizeSensor = null;
    }
  }

  updateUserPosition({ userId, posX, posY, manual }) {
    const node = ReactDOM.findDOMNode(this.refs.roomNode);
    PositionActions.updateUserPosition(
      getBoundedPosition({
        userId: userId,
        width: node.offsetWidth,
        height: node.offsetHeight,
        posX: posX,
        posY: posY,
        manual: manual,
      })
    );
  }

  handleResize() {
    const { participants, positions } = this.props;
    const node = ReactDOM.findDOMNode(this.refs.roomNode);
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    participants.map((participant, index) => {
      let position = {};
      if (positions[participant.userId] && positions[participant.userId].manual) {
        const userPosition = positions[participant.userId];
        position = getAbsolutePosition({
          userId: participant.userId,
          width: width,
          height: height,
          x: userPosition.x,
          y: userPosition.y,
          manual: true,
        });
      } else {
        position = getOrganizedPosition({
          userId: participant.userId,
          width: width,
          height: height,
          size: participants.size,
          index: index,
          manual: false,
        });
      }
      PositionActions.updateUserPosition.defer(position);
    });
  }

  render() {
    const { participants, positions } = this.props;

    return (
      <div className="conference-participants" ref="roomNode">
        {
          participants.map(participant => {
            return (
              <ConferenceRoomParticipant
                key={participant.userId}
                participant={participant}
                positions={positions}
                updateUserPosition={this.updateUserPosition}
              />
            );
          })
        }
      </div>
    );
  }
}

export default ConferenceRoomParticipants;

ConferenceRoomParticipants.propTypes = {
  participants: PropTypes.instanceOf(List).isRequired,
  positions: PropTypes.array.isRequired,
};
