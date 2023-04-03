const APP_ID = "a24681963b024ac8b77ea8739f5f1dcf";
const CHANNEL = "mynewchannel";
const TOKEN =
  "006a24681963b024ac8b77ea8739f5f1dcfIABDBr28lY1KbIaSv+9TtnPFDU3hEfAB/wF+LBiyydiREWf+nQgy4S2rIgCK+fMDWIosZAQAAQBYiixkAgBYiixkAwBYiixkBABYiixk";
let UID = 41;

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

let localTracks = [];
let remoteUsers = {};

let joinAndDisplayLocalStream = async () => {
  client.on("user-published", handleUserJoined);
  client.on("user-left", handleUserLeft);

  UID = await client.join(APP_ID, CHANNEL, TOKEN, UID);

  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

  let player = `<div  class="video-container" id="user-container-${UID}">
                     <div class="username-wrapper"><span class="user-name">My Name</span></div>
                     <div class="video-player" id="user-${UID}"></div>
                  </div>`;

  document
    .getElementById("video-streams")
    .insertAdjacentHTML("beforeend", player);

  localTracks[1].play(`user-${UID}`);
  await client.publish([localTracks[0], localTracks[1]]);
};

let handleUserJoined = async (user, mediaType) => {
  remoteUsers[user.uid] = user;
  await client.subscribe(user, mediaType);

  if (mediaType === "video") {
    let player = document.getElementById(`user-container-${user.uid}`);
    if (player != null) {
      player.remove();
    }

    player = `<div  class="video-container" id="user-container-${user.uid}">
            <div class="video-player" id="user-${user.uid}"></div>
            <div class="username-wrapper"><span class="user-name">My Name</span></div>
        </div>`;

    document
      .getElementById("video-streams")
      .insertAdjacentHTML("beforeend", player);
    user.videoTrack.play(`user-${user.uid}`);
  }

  if (mediaType === "audio") {
    user.audioTrack.play();
  }
};

let handleUserLeft = async (user) => {
  delete remoteUsers[user.uid];
  document.getElementById(`user-container-${user.uid}`).remove();
};

let leaveAndRemoveLocalStream = async () => {
  for (let i = 0; localTracks.length > i; i++) {
    localTracks[i].stop();
    localTracks[i].close();
  }

  await client.leave();
  window.open("/", "_self");
};

let toggleCamera = async (e) => {
  if (localTracks[1].muted) {
    await localTracks[1].setMuted(false);
    e.target.style.backgroundColor = "#fff";
  } else {
    await localTracks[1].setMuted(true);
    e.target.style.backgroundColor = "rgb(255, 80, 80, 1)";
  }
};

let toggleMic = async (e) => {
  if (localTracks[0].muted) {
    await localTracks[0].setMuted(false);
    e.target.style.backgroundColor = "#fff";
  } else {
    await localTracks[0].setMuted(true);
    e.target.style.backgroundColor = "rgb(255, 80, 80, 1)";
  }
};

joinAndDisplayLocalStream();

document
  .getElementById("leave-btn")
  .addEventListener("click", leaveAndRemoveLocalStream);

document.getElementById("camera-btn").addEventListener("click", toggleCamera);

document.getElementById("mic-btn").addEventListener("click", toggleMic);
