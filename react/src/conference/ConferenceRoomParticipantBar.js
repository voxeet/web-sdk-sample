import React, { PropTypes } from 'react';
import ParticipantActions from '../actions/ParticipantActions.js';

const handleMute = (participant) => {
  const muted = voxeet.conference.rtc.toggleMute(participant.userId);
  ParticipantActions.updateParticipant({
    userId: participant.userId,
    data: {
      muted: muted,
    },
  });
};

export default function ConferenceRoomParticipantBar({ participant }) {
  const indicators = [];
  const muteClass = participant.muted
    ? 'icon-mute on'
    : 'icon-mute';

  for (let i = 1; i <= 3; i++) {
    indicators.push(<span key={i} className="green"></span>);
  }

  return (
    <div className="participant-bar">
      <span className="quality">
        {indicators}
      </span>
      <span className="name">
        {participant.userId}
      </span>
      <a onClick={() => handleMute(participant)}>
        <span className={muteClass} />
      </a>
    </div>
  );
}

ConferenceRoomParticipantBar.propTypes = {
  participant: PropTypes.object.isRequired,
};
