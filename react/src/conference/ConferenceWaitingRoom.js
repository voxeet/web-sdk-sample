import React from 'react';

import { getAvatarUrl } from '../lib/avatar.js';

export default function ConferenceWaitingRoom({ participants }) {
  const waitingParticipants = participants.filter(participant => {
    return !participant.onAir && participant.userId !== voxeet.userId;
  });

  if (waitingParticipants.size === 0) {
    return <ul />;
  }

  return (
    <ul className="conference-waiting-room">
      <li className="label">Waiting on...</li>
      {
        waitingParticipants.map(participant => {
          return (
            <li key={participant.userId} className="waiting-user">
              <img src={getAvatarUrl(participant)} />
              <span className="name">{participant.userId}</span>
            </li>
          );
        })
      }
    </ul>
  );
}
