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
const seekToolTipEl = document.querySelector('.js-seek-tooltip');
const toBeginBtn = document.querySelector('.js-to-begin');
const rewindBtn = document.querySelector('.js-rewind');
const fastForwardBtn = document.querySelector('.js-fastForward');
const toEndBtn = document.querySelector('.js-to-end');
const TIME_STEP = 5;

const volumeBtn = document.querySelector('.js-volume-button');
const volumeIcons = document.querySelectorAll('.js-volume-icons');
const volumeMuteBtn = document.querySelector('.js-mute');
const volumeLowBtn = document.querySelector('.js-volume-low');
const volumeHighBtn = document.querySelector('.js-volume-high');
const volumeEl = document.querySelector('.js-volume');

const playBackBtns = document.querySelectorAll('.js-playback-rate');

const fullscreenBtn = document.querySelector('.js-fullscreen');
const videoContainerEl = document.querySelector('.js-video-container');
const toggleScreenBtns = document.querySelectorAll('.js-toggle-screen');

videoEl.addEventListener('loadedmetadata', initializeVideo);
videoEl.addEventListener('play', updatePlayBtn);
videoEl.addEventListener('pause', updatePlayBtn);
videoEl.addEventListener('timeupdate', updateTimeAndProgress);
videoEl.addEventListener('volumechange', changeVolumeIcon);

playPauseBtn.addEventListener('click', togglePlay);
stopBtn.addEventListener('click', stopVideo);
seekEl.addEventListener('mousemove', updateSeekTooltip);
seekEl.addEventListener('input', skipAhead);

//On click set current time to beggining and update seek tooltip
toBeginBtn.addEventListener('click', () => {
    videoEl.currentTime = 0;
    updateSeekTooltip();
});

//On click rewind video 5 seconds and update seek tooltip
rewindBtn.addEventListener('click', () => {
    videoEl.currentTime -= TIME_STEP;
    updateSeekTooltip();
});

//On click fast forward track 5 seconds and updates tooltip
fastForwardBtn.addEventListener('click', () => {
    videoEl.currentTime += TIME_STEP;
    updateSeekTooltip();
});

//On click set current time to end of track/video duration and updates seek tooltip
toEndBtn.addEventListener('click', () => {
    videoEl.currentTime = videoEl.duration;
    updateSeekTooltip();
});

volumeEl.addEventListener('input', updateVolume);
volumeBtn.addEventListener('click', toggleMute);

playBackBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        console.log(parseFloat(e.target.value))
        setPlayBackSpeed(parseFloat(e.target.value))
    });
});

fullscreenBtn.addEventListener('click', toggleFullScreen);
videoContainerEl.addEventListener('fullscreenchange', changeFullScreenIcon);

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

//Function by using mouse position on the progress bar shows seek tooltip with approx time of video on that position
function updateSeekTooltip(e) {
    const skipTo = Math.round((e.offsetX / e.target.clientWidth) * parseInt(e.target.getAttribute('max'), 10));
    seekEl.setAttribute('data-seek', skipTo);
    const time = formatTime(skipTo);
    seekToolTipEl.textContent = `${time.minutes}:${time.seconds}`;
    const rectangl = videoEl.getBoundingClientRect();
    seekToolTipEl.style.left = `${e.pageX - rectangl.left}px`;
}

//When value of the seek element changes (when progress bar is clicked on certain point) video skips ahead to 
//a that point (time where is clicked)
function skipAhead(e) {
    const skipTo = e.target.dataset.seek ? e.target.dataset.seek : e.target.value;
    videoEl.currentTime = skipTo;
    progressBarEl.value = skipTo;
    seekEl.value = skipTo;
}

//set sound volume
function updateVolume() {
    if (videoEl.muted) {
        videoEl.muted = false;
    }
    videoEl.volume = volumeEl.value;
}

//Set volume icon depending on volume range
function changeVolumeIcon() {
    volumeIcons.forEach(i => {
        i.classList.add('hidden')
    });

    volumeBtn.setAttribute('data-title', 'Mute (m)')

    if (videoEl.muted || videoEl.volume === 0) {
        volumeMuteBtn.classList.remove('hidden');
        console.log(volumeBtn.innerHTML)
        volumeBtn.setAttribute('data-title', 'Unmute (m)');
    } else if (videoEl.volume > 0 && videoEl.volume <= 0.5) {
        volumeLowBtn.classList.remove('hidden');
        console.log(volumeBtn.innerHTML)
    } else {
        volumeHighBtn.classList.remove('hidden');
        console.log(volumeBtn.innerHTML)
    }
}

//When video is unmuted, volume is set to value before the video was muted
function toggleMute() {
    videoEl.muted = !videoEl.muted;

    if (videoEl.muted) {
        volumeEl.setAttribute('data-volume', volumeEl.value);
        volumeEl.value = 0;
    } else {
        volumeEl.value = volumeEl.dataset.volume;
    }
}

function setPlayBackSpeed(value) {
    videoEl.playbackRate = value;
}

function toggleFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        videoContainerEl.requestFullscreen();
    }
}

function changeFullScreenIcon() {
    toggleScreenBtns.forEach(i => {
        i.classList.toggle('hidden')
    });

    if (document.fullscreenElement) {
        fullscreenBtn.setAttribute('data-title', 'Exit full screen (f)')
    } else {
        fullscreenBtn.setAttribute('data-titl', 'Full screen (f)')
    }
}