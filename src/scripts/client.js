import VoxeetSdk from '@voxeet/voxeet-web-sdk'
import config from './config'
import css from '../styles/main.css'

import { 
  enableUI, 
    conferenceJoinedUI, 
    conferenceLeftUI,
    createVideoTag,
    updateVideoTag,
    removeVideoTag,
    createFeedbackTag,
    addParticipant,
    removeParticipant
} from './client_ui'


const main = () => {
  const voxeet = new VoxeetSdk();

  let participants = {};
  let timeout = null;
  let isConferenceMuted = false;

  voxeet.on('conferenceJoined', () => {
    conferenceJoinedUI();

    timeout = setInterval(() => {

      for (var userId in participants) {
        var node = document.getElementById('participant-' + userId);
        if (node != null) {
          voxeet.isUserSpeaking(userId, (isSpeaking) => {
            if (isSpeaking) {
              node.setAttribute('class', 'flex red');
            } else {
              node.setAttribute('class', 'flex');
            }
          });
        }
      }
    }, 500);
  });

  voxeet.on('conferenceLeft', () => {
    conferenceLeftUI();
  });

  voxeet.on('participantAdded', (userId, userInfo) => {
    participants[userId] = userInfo;
  });

  voxeet.on('participantJoined', (userId, stream) => {
    if (userId !== voxeet.userId) { // != of me
      addParticipant(voxeet, participants, userId, stream);

      if (stream && stream.getVideoTracks().length > 0) {
        createVideoTag(userId, stream);
      }

      voxeet.muteUser(userId, isConferenceMuted);

    } else { // Adding feedback stream
      if (stream && stream.getVideoTracks().length > 0) {
        createFeedbackTag(userId, stream);
      }
    }
  });

  voxeet.on('participantUpdated', (userId, stream) => {
    var node = document.getElementById('video-' + userId);
    if(stream && stream.getVideoTracks().length > 0) {
      if (!node) {
        if (userId == voxeet.userId) {
          createFeedbackTag(userId, stream);
        } else {
          createVideoTag(userId, stream);
        }
      } else {
        updateVideoTag(node, userId, stream);
      }
    } else {
      if (node) {
        removeVideoTag(userId);
      }
    }
  });

  voxeet.on('participantLeft', (userId) => {
    removeParticipant(participants, userId);

    if (userId !== voxeet.userId) {
      delete participants[userId];
    }

    removeVideoTag(userId);
    console.log(participants);
  });

  voxeet.on('messageReceived', (msg) => {
    var node = document.createElement('div');
    node.innerHTML = msg;

    document.getElementById('messages').appendChild(node);
  });

  voxeet.on('screenShareStarted', (userId, stream) => {
    var node = document.createElement('video');
    node.setAttribute('id', 'screen-share');

    document.body.appendChild(node);

    navigator.attachMediaStream(node, stream);

    node.autoplay = 'autoplay';
    node.muted = true;
  });

  voxeet.on('screenShareStopped', () => {
    var node = document.getElementById('screen-share');
    if (node) {
      node.parentNode.removeChild(node);
    }
  });

  voxeet.on('conferenceStatusUpdated', (infos) => {
    console.log(infos);
  });

  voxeet.initialize(config.customerKey, config.customerSecret, {name: "John Doe"})
    .then((myUserId) => {
      enableUI(voxeet, participants, isConferenceMuted);
      voxeet.subscribeConferenceStatus("toto");
    })
    .catch((e) => {
      console.error(e);
    });
}

main();
