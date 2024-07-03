const audio = document.getElementById('piste');
const playPauseButton = document.getElementById('play-pause');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const nextButton = document.getElementById('suivant');
const prevButton = document.getElementById('precedent');

let files = [];
let currentIndex = 0;

audio.addEventListener('timeupdate', () => {
    const percentage = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percentage + '%';
});

progressBar.addEventListener('click', (e) => {
    const clickPosition = (e.offsetX / progressBar.offsetWidth) * audio.duration;
    audio.currentTime = clickPosition;
});

document.addEventListener('DOMContentLoaded', function() {
    const openFolderButton = document.getElementById('open-folder');
    const listesDiv = document.getElementById('listes');

    openFolderButton.addEventListener('click', async () => {
        try {
            const handle = await window.showDirectoryPicker();
            listesDiv.innerHTML = ''; // Clear existing list
            files = []; // Clear the existing files array

            for await (const entry of handle.values()) {
                if (entry.kind === 'file' && entry.name.endsWith('.mp3')) {
                    const file = await entry.getFile();
                    files.push(file);
                    const listItem = document.createElement('div');
                    listItem.textContent = entry.name;
                    listItem.addEventListener('click', () => {
                        currentIndex = files.indexOf(file);
                        playAudio(file);
                    });
                    listesDiv.appendChild(listItem);
                }
            }
        } catch (err) {
            console.error('Erreur:', err);
        }
    });

    playPauseButton.addEventListener('click', () => {
        try {
            if (audio.paused) {
                audio.play();
                playPauseButton.style.backgroundImage = 'url("Media/pause_bouton.png")';
                playPauseButton.style.backgroundColor = 'red';
            } else {
                audio.pause();
                playPauseButton.style.backgroundImage = 'url("Media/play_bouton.png")';
                playPauseButton.style.backgroundColor = 'green';
            }
        } catch (error) {
            console.error('Erreur lors du play/pause:', error);
        }
    });

    nextButton.addEventListener('click', () => {
        if (files.length > 0) {
            currentIndex = (currentIndex + 1) % files.length;
            playAudio(files[currentIndex]);
        }
    });

    prevButton.addEventListener('click', () => {
        if (files.length > 0) {
            currentIndex = (currentIndex - 1 + files.length) % files.length;
            playAudio(files[currentIndex]);
        }
    });

    audio.addEventListener('ended', () => {
        nextButton.click(); // Simuler un clic sur le bouton "Suivant"
    });

    function playAudio(file) {
        audio.src = URL.createObjectURL(file);
        audio.play();
        playPauseButton.style.backgroundImage = 'url("Media/pause_bouton.png")';
        playPauseButton.style.backgroundColor = 'red';
    }
});
