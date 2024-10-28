const playButton = document.getElementById('play-button');
const progressBar = document.querySelector('.progress');
const currentTimeElement = document.querySelector('.current-time');
const totalTimeElement = document.querySelector('.total-time');
// const midiUrl = "{{ url_for('static', filename='audio/mel.mid') }}";
let isPlaying = false;
let isPaused = false;
let midiEndTimer;
let midiDuration = 0;

// Fetch and log the duration of the MIDI file, and set total time display
MIDIjs.get_duration(midiUrl, function(seconds) {
    midiDuration = seconds;
    console.log("Duration: " + seconds + " seconds");
    totalTimeElement.textContent = formatTime(seconds);
});

// Function to handle play, pause, and resume
playButton.addEventListener('click', () => {
    if (!isPlaying && !isPaused) {
        MIDIjs.play(midiUrl);
        playButton.textContent = '||'; // Show pause icon
        isPlaying = true;
        isPaused = false;
        setMidiEndListener(); // Start the listener for playback end
        updateProgress(); // Start updating the progress bar
    } else if (isPlaying && !isPaused) {
        MIDIjs.pause();
        playButton.textContent = '▶'; // Show play icon
        isPlaying = false;
        isPaused = true;
        clearTimeout(midiEndTimer); // Pause the end timer
    } else if (isPaused) {
        MIDIjs.resume();
        playButton.textContent = '||'; // Show pause icon
        isPlaying = true;
        isPaused = false;
        setMidiEndListener(midiDuration - getCurrentTime()); // Resume end timer from current position
        updateProgress(); // Resume updating the progress bar
    }
});

// Stop playback when the user clicks a stop button or song ends
function stopPlayback() {
    MIDIjs.stop();
    playButton.textContent = '▶'; // Show play icon
    isPlaying = false;
    isPaused = false;
    clearTimeout(midiEndTimer); // Stop the timer
    progressBar.style.width = '0%'; // Reset progress bar
    currentTimeElement.textContent = '00:00'; // Reset current time display
}

// Listener to switch back to the play icon when playback ends
function setMidiEndListener(time = midiDuration) {
    clearTimeout(midiEndTimer);
    midiEndTimer = setTimeout(() => {
        stopPlayback();
    }, time * 1000);
}

// Update the progress bar dynamically
function updateProgress() {
    if (isPlaying) {
        MIDIjs.player_callback = function(event) {
            let currentTime = event.time;
            let progressPercentage = (currentTime / midiDuration) * 100;
            progressBar.style.width = progressPercentage + '%'; // Update the progress bar width
            currentTimeElement.textContent = formatTime(currentTime); // Update current time display
        };
    }
}

// Get current playback time using MIDIjs player callback
function getCurrentTime() {
    let currentTime = 0;
    MIDIjs.player_callback = function(event) {
        currentTime = event.time;
    };
    return currentTime;
}

// Format time from seconds to mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Example usage: Add an event listener for a stop button if available
const stopButton = document.getElementById('stop-button');
if (stopButton) {
    stopButton.addEventListener('click', stopPlayback);
}



document.getElementById('create-button').addEventListener('click', function() {
    // Get the input value
    const inputText = document.querySelector('.inputbox').value;

    // Check if the input is not empty
    if (inputText.trim() !== "") {
        // Send the input to the Flask backend
        fetch('/create-song', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ seed: inputText }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            
            // Generate and set a new random name for the track title
            const randomName = generateRandomName();
            localStorage.setItem('trackTitle', randomName); // Store the random name in local storage
            
            // Optionally reload or perform any other actions
            location.reload(); // Reload the page to reflect the changes
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } else {
        alert('Please enter a valid input.');
    }
});

function generateRandomName() {
    const prefixes = ["Ar", "El", "Ka", "Ri", "Sa", "Da", "Ti", "Ze", "Fa", "Lo"];
    const infixes = ["ma", "ra", "lo", "fi", "na", "re", "ko", "ti", "la", "za"];
    const suffixes = ["ron", "dor", "len", "nia", "dar", "lon", "tar", "xis", "bel", "vis"];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const infix = infixes[Math.floor(Math.random() * infixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return prefix + infix + suffix;
}

// Display the track title from local storage when the page loads
window.addEventListener('load', function() {
    const savedTrackTitle = localStorage.getItem('trackTitle');
    if (savedTrackTitle) {
        const trackTitleElement = document.getElementById("random");
        if (trackTitleElement) {
            trackTitleElement.textContent = savedTrackTitle;
        }
    }
});
