const videoEl = document.querySelector('.js-video');
const videoControlsEl = document.querySelector('.js-controls');
const isVideoWorks = !!document.createElement('video').canPlayType;

//remove native controls and display custom ones
if (isVideoWorks) {
    videoEl.controls = false;
    videoControlsEl.classList.remove('hidden');
}

const playPauseBtn = document.querySelector('.js-togglePlay');
const stopBtn = document.querySelector('.js-stop');
const timeElapsedEl = document.querySelector('.js-time-elapsed');
const videoDurationEl = document.querySelector('.js-duration');
const progressBarEl = document.querySelector('.js-progress-bar');
const seekEl = document.querySelector('.js-seek');


videoEl.addEventListener('loadedmetadata', initializeVideo);
videoEl.addEventListener('play', updatePlayBtn);
videoEl.addEventListener('pause', updatePlayBtn);
videoEl.addEventListener('timeupdate', updateTimeAndProgress);

playPauseBtn.addEventListener('click', togglePlay);
stopBtn.addEventListener('click', stopVideo)


//If the video is paused or ended, the video is played, if not, then video is paused
function togglePlay() {
    if (videoEl.paused || videoEl.ended) {
        videoEl.play();
    } else {
        videoEl.pause();
    }
}

function updatePlayBtn() {
    if (videoEl.paused) {
        playPauseBtn.textContent = "Play"
    } else {
        playPauseBtn.textContent = "Pause"
    }
}

//Stop video playing and return it to beggining
function stopVideo() {
    videoEl.pause();
    videoEl.currentTime = 0;
    videoEl.playbackRate = 1;
    playbackRate.val(1);
}

//Takes time length in seconds and returns it in minutes and seconds
function formatTime(seconds) {
    const result = new Date(seconds * 1000).toISOString().substr(11, 8);

    return {
        minutes: result.substr(3, 2),
        seconds: result.substr(6, 2)
    };
}

//Initializing video sets video duration and value of progress bar
function initializeVideo() {
    const duration = Math.round(videoEl.duration);
    seekEl.setAttribute('max', duration);
    progressBarEl.setAttribute('max', duration);
    const time = formatTime(duration);
    videoDurationEl.innerText = `${time.minutes}:${time.seconds}`;
    videoDurationEl.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
}

//Update time while playing video
function updateTimeElapsed() {
    const time = formatTime(Math.round(videoEl.currentTime));
    timeElapsedEl.innerText = `${time.minutes}:${time.seconds}`;
    timeElapsedEl.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`);
}

//Update progress bar depending of how far video is played
function updateProgressBar() {
    seekEl.value = Math.floor(videoEl.currentTime);
    progressBarEl.value = Math.floor(videoEl.currentTime);
}


function updateTimeAndProgress() {
    updateTimeElapsed();
    updateProgressBar();
}