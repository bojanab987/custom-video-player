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

videoEl.addEventListener('loadedmetadata', initializeVideo);
videoEl.addEventListener('play', updatePlayBtn);
videoEl.addEventListener('pause', updatePlayBtn);
videoEl.addEventListener('timeupdate', updateTimeAndProgress);

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
    // playbackRate.value=1;
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
    console.log(e.target)
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

