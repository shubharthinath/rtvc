const APP_ID = "a24681963b024ac8b77ea8739f5f1dcf"
const CHANNEL = "main"
const TOKEN =
  "007eJxTYPCpbQg7kbG1jW3+r2B+Kysmi4P61y+1ceZbr8qYxn/XQFyBIdHIxMzC0NLMOMnAyCQx2SLJ3Dw10cLc2DLNNM0wJTnt4DutlIZARoblhasYGRkgEMRnYchNzMxjYAAApogdxA==";
let UID

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })

let localTracks = [];
let remoteUsers = {};

let joinAndDisplayLocalStream = async () => {
  UID = await client.join(APP_ID, CHANNEL, TOKEN, null)
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

  let player = `<div class="video-container" id="user-container-${UID}">
                        <div class="username-wrapper"><span class="user-name">My Name</span></div>
                        <div class="video-player" id="user-${UID}"></div>
                    </div>`
  document
    .getElementById("video-streams")
    .insertAdjacentHTML("beforeend", player)

  localTracks[1].play(`user-${UID}`)

  await client.publish([localTracks[0], localTracks[1]])
}

joinAndDisplayLocalStream();