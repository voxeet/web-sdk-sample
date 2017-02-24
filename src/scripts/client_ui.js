export const enableUI = (voxeet, participants, isConferenceMuted) => {
  const roomInput = document.getElementById('room-id');
  const messageInput = document.getElementById('message-input');
  const demoButton = document.getElementById('demo-button');
  const createButton = document.getElementById('create-button');
  const joinButton = document.getElementById('join-button');
  const sendButton = document.getElementById('send-button');
  const leaveButton = document.getElementById('leave-button');
  const muteButton = document.getElementById('mute-button');
  const muteConferenceButton = document.getElementById('mute-conference-button');
  const stopVideoButton = document.getElementById('stop-video-button');
  const startVideoButton = document.getElementById('start-video-button');
  const startShareButton = document.getElementById('start-share-button');
  const stopShareButton = document.getElementById('stop-share-button');
  const fullscreenShareButton = document.getElementById('fullscreen-share-button');
  const audioInputNode = document.getElementById('audio-devices');
  const videoInputNode = document.getElementById('video-devices');
  const startRecordingButton = document.getElementById('start-recording');
  const stopRecordingButton = document.getElementById('stop-recording');
  const replayRecordingButton = document.getElementById('replay-recording');
  const conferenceIdRecorded = document.getElementById('conference-id-recorded');
  const audioDeviceId = document.getElementById('audio-device-id'); 
  const videoDeviceId = document.getElementById('video-device-id'); 

  demoButton.disabled = false;
  createButton.disabled = false;
  joinButton.disabled = false;

  demoButton.onclick = function() {
    voxeet.createDemoConference();
  }

  createButton.onclick = function() {
    var alias = "";

    if (roomInput !== undefined) {
      alias = roomInput.value;
    }

    voxeet.createConference(alias)
      .then(function(res){
        roomInput.value = res.data.conferenceAlias;
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  joinButton.onclick = function() {
    if (roomInput !== undefined) {
      var selectNode = document.getElementById('video-size');
      var frameRateNode = document.getElementById('framerate');

      var constraints = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 160,
            minHeight: 120,
            maxWidth: 320,
            maxHeight: 240,
            minFrameRate: 5,
            maxFrameRate: 30
          }
        }
      };

      constraints.video.mandatory.maxFrameRate = frameRateNode.value;

      switch (selectNode.value) {
        case "1080":
          constraints.video.mandatory.maxWidth = 1920;
          constraints.video.mandatory.maxHeight = 1080;
          break;
        case "720":
          constraints.video.mandatory.maxWidth = 1280;
          constraints.video.mandatory.maxHeight = 720;
          break;
        case "640":
          constraints.video.mandatory.maxWidth = 640;
          constraints.video.mandatory.maxHeight = 480;
          break;
        case "320":
          constraints.video.mandatory.maxWidth = 320;
          constraints.video.mandatory.maxHeight = 240;
          break;
      }

      if (audioDeviceId.value) {
        constraints.audio = {
          deviceId: {exact: audioDeviceId.value}
        }
      }

      if (videoDeviceId.value) {
        constraints.video = {
          deviceId: {exact: videoDeviceId.value}
        }
      }

      voxeet.joinConference(roomInput.value, constraints)
        .then((info) => {
          console.log(info);
          voxeet.enumerateAudioDevices()
            .then(function(sources) {
              console.log(sources);
              var audioInputNode = document.getElementById('audio-devices');
              sources.forEach(function(source) {
                var opt = document.createElement('option');
                opt.value = source.deviceId;
                opt.innerHTML = source.label;
                audioInputNode.appendChild(opt); 
              });
            })
            .catch(function(e) { console.error(e); });

          voxeet.enumerateVideoDevices()
            .then(function(sources) {
              console.log(sources);
              var videoInputNode = document.getElementById('video-devices');
              sources.forEach(function(source) {
                var opt = document.createElement('option');
                opt.value = source.deviceId;
                opt.innerHTML = source.label;
                videoInputNode.appendChild(opt); 
              });
            })
            .catch(function(e) { console.error(e); });
        })
        .catch(function(e) {
          console.error(e);
        });
    }
  }

  sendButton.onclick = function() {
    voxeet.sendConferenceMessage(messageInput.value);
  }

  leaveButton.onclick = function() {
    voxeet.leaveConference();
  }

  muteButton.onclick = function() {
    voxeet.toggleMute(voxeet.userId);
  }

  startShareButton.onclick = function() {
    voxeet.startScreenShare();
  }

  stopShareButton.onclick = function() {
    voxeet.stopScreenShare();
  }

  fullscreenShareButton.onclick = function() {
    var elem = document.getElementById("screen-share");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }

  stopVideoButton.onclick = function() {
    voxeet.stopVideoForUser(voxeet.userId);
  }

  startVideoButton.onclick = function() {
    voxeet.startVideoForUser(voxeet.userId);
  }

  muteConferenceButton.onclick = function() {
    isConferenceMuted = !isConferenceMuted;
    for (let k in participants) {
      voxeet.muteUser(k, isConferenceMuted);
    }
  }

  audioInputNode.onchange = function() {
    voxeet.selectAudioInput(audioInputNode.value)
      .catch(e => console.error(e)); 
  }

  startRecordingButton.onclick = function() {
    conferenceIdRecorded.value = voxeet.conference.conferenceId;
    voxeet.startRecording();
  }

  stopRecordingButton.onclick = function() {
    voxeet.stopRecording();
  }

  replayRecordingButton.onclick = function() {
    voxeet.replayConference(conferenceIdRecorded.value); 
  }
}

export const conferenceJoinedUI = () => {
  document.getElementById('leave-button').disabled = false;
  document.getElementById('join-button').disabled = true;
  document.getElementById('stop-video-button').disabled = false;
  document.getElementById('start-video-button').disabled = false;

}

export const conferenceLeftUI = () => {
  document.getElementById('leave-button').disabled = true;
  document.getElementById('join-button').disabled = false;
  document.getElementById('stop-video-button').disabled = true;
  document.getElementById('start-video-button').disabled = true;

}

export const createVideoTag = (userId, stream) => {
  var node = document.createElement('video');
  node.setAttribute('id', 'video-' + userId);
  node.setAttribute('class', 'round');
  node.setAttribute('width', 320);
  node.setAttribute('height', 320);

  document.body.appendChild(node);

  navigator.attachMediaStream(node, stream);

  node.autoplay = 'autoplay';
  node.muted = true;
}

export const updateVideoTag = (node, userId, stream) => {
  navigator.attachMediaStream(node, stream);

  node.muted = true;
}

export const removeVideoTag = (userId) => {
  var node = document.getElementById('video-' + userId);
  if(node) {
    node.parentNode.removeChild(node);
  }
}

export const createFeedbackTag = (userId, stream) => {
  var node = document.createElement('video');
  var feedbackNode = document.getElementById('feedback');

  node.setAttribute('id', 'video-' + userId);
  node.setAttribute('class', 'round');
  node.setAttribute('width', 200);
  node.setAttribute('height', 200);

  feedbackNode.appendChild(node);

  navigator.attachMediaStream(node, stream);

  node.autoplay = 'autoplay';
  node.muted = true;
}

const updatePosition = (voxeet, participants, userId) => {
  if (participants[userId] !== undefined) {
    voxeet.setUserPosition(userId, participants[userId].x, participants[userId].y);
  }
}


export const addParticipant = (voxeet, participants, userId, userInfo, stream) => {
  var participantList = document.getElementById('participant-list');
  participants[userId] = {x: 0.0, y: 0.5}; // Initial position

  if (voxeet.userId !== userId) {

    var node = document.createElement('div');

    node.innerHTML = '<div>' + userInfo['name'] + '</div>';
    node.setAttribute('id', "participant-" + userId);
    node.setAttribute('class', 'flex red');

    var horizontalRange = document.createElement('input');
    horizontalRange.setAttribute('type', 'range');
    horizontalRange.setAttribute('id', userId);
    horizontalRange.min = -1.0;
    horizontalRange.max = 1.0;
    horizontalRange.step = 0.1;
    horizontalRange.value= 0.0;

    horizontalRange.oninput = function(e) {
      console.log(e.target.value);
      var userId = e.target.getAttribute('id');
      participants[userId].x = e.target.value;

      updatePosition(voxeet, participants, userId);
    };

    node.appendChild(horizontalRange);

    var verticalRange = document.createElement('input');
    verticalRange.setAttribute('type', 'range');
    //verticalRange.setAttribute('orient', 'vertical');
    verticalRange.setAttribute('id', userId);
    verticalRange.min = 0.0;
    verticalRange.max = 1.0;
    verticalRange.step = 0.1;
    verticalRange.value= 0.5;

    verticalRange.oninput = function(e) {
      console.log(e.target.value);
      var userId = e.target.getAttribute('id');
      participants[userId].y = e.target.value;

      updatePosition(voxeet, participants, userId);
    };

    node.appendChild(verticalRange);

    var muteButton = document.createElement('button');
    muteButton.setAttribute('id', userId);
    muteButton.innerHTML = 'Mute';

    muteButton.onclick = function(e) {
      var userId = e.target.getAttribute('id');
      voxeet.toggleMute(userId);
    }

    node.appendChild(muteButton);

    var muteVideoButton = document.createElement('button');
    muteVideoButton.setAttribute('id', userId);
    muteVideoButton.innerHTML = 'Stop video';

    muteVideoButton.onclick = function(e) {
      var userId = e.target.getAttribute('id');
      voxeet.stopVideoForUser(userId);
    }

    node.appendChild(muteVideoButton);

    var unmuteVideoButton = document.createElement('button');
    unmuteVideoButton.setAttribute('id', userId);
    unmuteVideoButton.innerHTML = 'Start video';

    unmuteVideoButton.onclick = function(e) {
      var userId = e.target.getAttribute('id');
      voxeet.startVideoForUser(userId);
    }

    node.appendChild(unmuteVideoButton);

    participantList.appendChild(node);

    updatePosition(voxeet, participants, userId);
  }
}

export const removeParticipant = (participants, userId) => {
  var node = document.getElementById("participant-" + userId);
  participants[userId] = {x: 0.0, y: 0.5}; // Initial position
  if (node != undefined) {
    node.parentNode.removeChild(node);
  }
}


