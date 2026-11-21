const PREVIEW_SECONDS = 15;

const audio = document.querySelector('#audioPlayer');
const player = document.querySelector('#player');

const infoImage = document.querySelector('#infoImage');
const infoName = document.querySelector('#infoName');
const playerTimer = document.querySelector('#playerTimer');

const playButton = document.querySelector('#controlPlay');
const pauseButton = document.querySelector('#controlPause');
const listenButtons = document.querySelectorAll('.catalog__main-listen');
const footer = document.querySelector('#siteFooter');

let activeButton = null;
let playerPositionFrame = null;

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return '0:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');

    return `${minutes}:${remainingSeconds}`;
}

function updateTimer() {
    playerTimer.textContent = formatTime(audio.currentTime);
}

function setButtonPlaying(button, isPlaying) {
    if (!button) {
        return;
    }

    const icon = button.querySelector('img');

    if (icon) {
        icon.src = isPlaying ? 'images/pause.png' : 'images/play.png';
        icon.alt = isPlaying ? 'Пауза' : 'Воспроизвести';
    }

    button.setAttribute('aria-pressed', String(isPlaying));
    button.classList.toggle('is-playing', isPlaying);
}

function setPlayingState(isPlaying) {
    player.classList.toggle('is-playing', isPlaying);
    setButtonPlaying(activeButton, isPlaying);
}

function resetPreview() {
    audio.pause();
    audio.currentTime = 0;
    playerTimer.textContent = '0:00';
    setPlayingState(false);
}

function startPlayback() {
    audio.play()
        .then(() => setPlayingState(true))
        .catch(() => setPlayingState(false));
}

function updatePlayerPosition() {
    playerPositionFrame = null;

    if (!footer || player.classList.contains('hidden')) {
        return;
    }

    player.classList.remove('player--at-footer');
    player.style.removeProperty('top');

    const footerTop = footer.getBoundingClientRect().top;
    const playerHeight = player.offsetHeight;
    const stickyLimit = window.innerHeight - playerHeight;
    const pageCanScroll = document.documentElement.scrollHeight > window.innerHeight;

    if (pageCanScroll && footerTop <= stickyLimit) {
        player.classList.add('player--at-footer');
        player.style.top = `${window.scrollY + footerTop - playerHeight}px`;
    }
}

function schedulePlayerPositionUpdate() {
    if (playerPositionFrame !== null) {
        return;
    }

    playerPositionFrame = window.requestAnimationFrame(updatePlayerPosition);
}

function openPlayer(button) {
    const isNewTrack = activeButton !== button;

    if (isNewTrack) {
        resetPreview();

        if (activeButton) {
            setButtonPlaying(activeButton, false);
        }

        audio.src = button.dataset.audio;
        infoImage.src = button.dataset.cover;
        infoImage.alt = button.dataset.title;
        infoName.textContent = button.dataset.title;
        playerTimer.textContent = '0:00';
        activeButton = button;
    }

    player.classList.remove('hidden');
    player.classList.add('active');
    schedulePlayerPositionUpdate();

    if (audio.ended || audio.currentTime >= PREVIEW_SECONDS) {
        audio.currentTime = 0;
    }

    startPlayback();
}

listenButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (activeButton !== button) {
            openPlayer(button);
            return;
        }

        if (audio.paused) {
            startPlayback();
        } else {
            audio.pause();
        }
    });
});

playButton.addEventListener('click', () => {
    if (activeButton) {
        startPlayback();
    }
});

pauseButton.addEventListener('click', () => {
    audio.pause();
});

audio.addEventListener('timeupdate', () => {
    if (audio.currentTime >= PREVIEW_SECONDS) {
        resetPreview();
        return;
    }

    updateTimer();
});

audio.addEventListener('loadedmetadata', updateTimer);

audio.addEventListener('play', () => {
    setPlayingState(true);
});

audio.addEventListener('pause', () => {
    setPlayingState(false);
});

audio.addEventListener('ended', resetPreview);

window.addEventListener('scroll', schedulePlayerPositionUpdate, { passive: true });
window.addEventListener('resize', schedulePlayerPositionUpdate);
