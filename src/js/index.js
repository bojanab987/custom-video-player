const videoEl = document.querySelector('.js-video');
const videoControlsEl = document.querySelector('.js-controls');

//remove native controls and display custom ones
videoEl.removeAttribute('controls');
videoControlsEl.classList.remove('hidden');

const playPauseBtn = document.querySelector('.js-togglePlay');

playPauseBtn.addEventListener('click', togglePlay);

function togglePlay() {
    if (videoEl.paused || videoEl.ended) {
        videoEl.play();
    } else {
        videoEl.pause();
    }
}