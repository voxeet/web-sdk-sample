import React, { PropTypes } from 'react';
import { List } from 'immutable';

import ParticipantActions from '../actions/ParticipantActions.js';

import ConferenceRoomBarVuMeter from './ConferenceRoomBarVuMeter.js';

const handleMute = () => {
  const muted = voxeet.conference.rtc.toggleOwnMute();
  ParticipantActions.updateParticipant({
    userId: voxeet.userId,
    data: {
      muted: muted,
    },
  });
};

export default function ConferenceRoomBar({ participants }) {
  const me = participants.find(p => p.userId === voxeet.userId);

  if (!me) {
    return (
      <div className="conference-bottom">
        <div className="conference-actions">
          <a
            onClick={() => voxeet.leaveConference()}
            className="hang-up-btn icon-phone-end-call"
          />
        </div>
      </div>
    );
  }

  const muteClass = me.muted
    ? 'icon-mute on'
    : 'icon-mute';

  return (
    <div className="conference-bottom">
      <div className="conference-actions">
        <ConferenceRoomBarVuMeter me={me} />
        <ul>
          <li>
            <a
              onClick={handleMute}
              className={muteClass}
            />
          </li>
        </ul>
        <a
          onClick={() => voxeet.leaveConference()}
          className="hang-up-btn icon-phone-end-call"
        />
      </div>
    </div>
  );
}

ConferenceRoomBar.propTypes = {
  participants: PropTypes.instanceOf(List).isRequired,
};
