import React, { PropTypes } from 'react';
import { List } from 'immutable';

import ConferenceWaitingRoom from './ConferenceWaitingRoom.js';
import ConferenceRoomBar from './ConferenceRoomBar.js';
import ConferenceRoomParticipants from './ConferenceRoomParticipants.js';

export default function ConferenceRoom({ positions, participants }) {
  const onAirUsers = participants.filter(p => p.onAir && p.userId !== voxeet.userId);

  return (
    <section className="Conference">
      <div className="conference-voice">
        <div className="conference-top">
          <ConferenceWaitingRoom
            participants={participants}
          />
        </div>
        {
          onAirUsers.size === 0 ? (
            <div className="hang-tight">
              <div>
                <img
                  src="https://app.voxeet.com/images/waiting-for-participants@3x.png"
                  alt="Waiting for participants"
                />
                <p>Hang Tight. We're waiting for other callers to arrive.</p>
              </div>
            </div>
          ) : (
            <ConferenceRoomParticipants
              participants={onAirUsers}
              positions={positions}
            />
          )
        }
        <ConferenceRoomBar
          participants={participants}
        />
      </div>
    </section>
  );
}

ConferenceRoom.propTypes = {
  positions: PropTypes.array.isRequired,
  participants: PropTypes.instanceOf(List).isRequired,
};
