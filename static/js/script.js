// const playButton = document.getElementById('play-button');
// const audio = document.getElementById('audio');
// let isPlaying = false;
// const midiUrl = "{{ url_for('static', filename='audio/mele.mid') }}";
// playButton.addEventListener('click', () => {
//     if (isPlaying) {
//         MIDIjs.play(midiUrl);
//         playButton.textContent = '▶'; // Show play icon
//     } else {
//         MIDIjs.stop();
//         playButton.textContent = '||'; // Show pause icon
//     }
//     isPlaying = !isPlaying;
// });

const playButton = document.getElementById('play-button');
let isPlaying = false;
// const midiUrl = "{{ url_for('static', filename='audio/mele.mid') }}";

playButton.addEventListener('click', () => {
    if (!isPlaying) {
        MIDIjs.play(midiUrl);
        playButton.textContent = '||'; // Show pause icon
        isPlaying = true;
    } else {
        MIDIjs.stop();
        playButton.textContent = '▶'; // Show play icon
        isPlaying = false;
    }
});
