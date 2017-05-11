import VoxeetSdk from '@voxeet/voxeet-web-sdk'
import config from './config'
import bowser from 'bowser'

const createVideoTag = (userId, stream) => {
  let node = document.createElement('video');
  node.setAttribute('id', 'video-' + userId);
  node.setAttribute('class', 'round');
  node.setAttribute('width', 320);
  node.setAttribute('height', 320);

  document.body.appendChild(node);

  navigator.attachMediaStream(node, stream);

  node.autoplay = 'autoplay';
  node.muted = true;
}

const removeVideoTag = (userId) => {
  let node = document.getElementById('video-' + userId);
  if (node) {
    node.parentNode.removeChild(node);
  }
}

const getParameters = () => {
  let params = {};
  window.location.search.substr(1).split("&").forEach((item) => {
    const k = item.split("=")[0];
    const v = decodeURIComponent(item.split("=")[1]); 
    (k in params) ? params[k].push(v) : params[k] = [v]
  });
  return params;
}

const main = (params) => {
  if (params["conferenceId"]) {

    if (bowser.mac || bowser.windows || bowser.linux || bowser.android) {
      if (bowser.chrome || bowser.firefox || bowser.opera) {

        let muteConferenceButton = document.getElementById('mute');
        let voxeet = new VoxeetSdk();
        let isConferenceMuted = false;
        let participants = {};

        muteConferenceButton.onclick = () => {
          isConferenceMuted = !isConferenceMuted;

          if (isConferenceMuted) {
            muteConferenceButton.innerHTML = 'Unmute';
          } else {
            muteConferenceButton.innerHTML = 'Mute';
          }

          console.log(participants);

          for (let k in participants) {
            voxeet.muteUser(k, isConferenceMuted);
          }
        }

        voxeet.on('participantAdded', (userId, userInfo) => {
          participants[userId] = userInfo;
        });


        voxeet.on('participantJoined', (userId, stream) => {
          voxeet.setUserPosition(userId, 0.0, 0.1);
          voxeet.muteUser(userId, isConferenceMuted);

          if (stream.getVideoTracks().length > 0) {
            createVideoTag(userId, stream);
          }

        });

        voxeet.on('participantUpdated', (userId, stream) => {
          let node = document.getElementById('video-' + userId);
          if(stream.getVideoTracks().length > 0) {
            if (!node) {
              createVideoTag(userId, stream);
            }
          } else {
            if (node) {
              removeVideoTag(userId);
            }
          }
        });

        voxeet.on('participantLeft', (userId) => {
          removeVideoTag(userId);
          delete participants[userId];
        });

        voxeet.on('screenShareStarted', (userId, stream) => {
          let node = document.createElement('video');
          node.setAttribute('id', 'screen-share');

          document.body.appendChild(node);

          navigator.attachMediaStream(node, stream);

          node.autoplay = 'autoplay';
          node.muted = true;
        });

        voxeet.on('screenShareStopped', () => {
          let node = document.getElementById('screen-share');
          if (node) {
            node.parentNode.removeChild(node);
          }
        });
        
        voxeet.initialize(config.customerKey, config.customerSecret)
          .then((myUserId) => {
            voxeet.listenConference(params["conferenceId"], {
              name: "John Doe",
              participantType: "listener"
            })
          })
          .catch(e => console.error(e));

        window.onbeforeunload = () => {
          if (voxeet) {
            voxeet.leaveConference();
          }
        }

      } else {
        alert('Browser not supported! We only supported on Chrome, Firefox, Opera');
      }
    } else {
      alert('Use a desktop browser.');
    }
  }
}

main(getParameters());
