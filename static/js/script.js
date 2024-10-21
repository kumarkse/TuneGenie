const playButton = document.getElementById('play-button');
const audio = document.getElementById('audio');
let isPlaying = false;

playButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playButton.textContent = '▶'; // Show play icon
    } else {
        audio.play();
        playButton.textContent = '||'; // Show pause icon
    }
    isPlaying = !isPlaying;
});

 