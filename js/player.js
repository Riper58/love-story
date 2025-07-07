// Плейлист
const playlist = [
    {
        title: "Perfect",
        artist: "Ed Sheeran",
        src: "music/perfect.mp3",
        cover: "images/cover-1.jpg"
    },
    {
        title: "La Vie En Rose",
        artist: "Edith Piaf",
        src: "music/la-vie-en-rose.mp3",
        cover: "images/cover-2.jpg"
    },
    {
        title: "Ты моё счастье",
        artist: "Artik & Asti",
        src: "music/ty-moe-schastie.mp3",
        cover: "images/cover-3.jpg"
    },
    {
        title: "All of Me",
        artist: "John Legend",
        src: "music/all-of-me.mp3",
        cover: "images/cover-4.jpg"
    }
];

// Элементы плеера
const audio = new Audio();
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const coverImage = document.getElementById('coverImage');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playlistEl = document.getElementById('playlist');

let currentSongIndex = 0;
let isPlaying = false;

// Инициализация плеера
function initPlayer() {
    loadSong(currentSongIndex);
    renderPlaylist();
    
    // Обработчики событий
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
    progressBar.addEventListener('click', setProgress);
}

// Загрузка песни
function loadSong(index) {
    const song = playlist[index];
    audio.src = song.src;
    coverImage.src = song.cover;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    
    // Обновляем активный элемент в плейлисте
    updateActivePlaylistItem(index);
}

// Воспроизведение/пауза
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playSong() {
    isPlaying = true;
    playBtn.textContent = '⏸';
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playBtn.textContent = '▶';
    audio.pause();
}

// Следующая/предыдущая песня
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Обновление прогресса
function updateProgress() {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.setProperty('--progress', `${progressPercent}%`);
    
    // Время
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    
    if (durationSeconds) {
        durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    }
    
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
}

// Установка прогресса
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Рендер плейлиста
function renderPlaylist() {
    playlistEl.innerHTML = '';
    
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        
        // Получаем длительность аудио
        const audio = new Audio(song.src);
        audio.addEventListener('loadedmetadata', function() {
            const minutes = Math.floor(audio.duration / 60);
            let seconds = Math.floor(audio.duration % 60);
            if (seconds < 10) seconds = `0${seconds}`;
            
            const durationSpan = document.createElement('span');
            durationSpan.className = 'song-duration';
            durationSpan.textContent = `${minutes}:${seconds}`;
            li.querySelector('.song-info').appendChild(durationSpan);
        });
        
        li.innerHTML = `
            <span class="play-icon">${index === currentSongIndex && isPlaying ? '♫' : '♩'}</span>
            <div class="song-info">
                <strong>${song.title}</strong><br>
                <span>${song.artist}</span>
            </div>
        `;
        
        li.addEventListener('click', function() {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
        
        playlistEl.appendChild(li);
    });
}

// Обновление активного элемента плейлиста
function updateActivePlaylistItem(index) {
    const items = playlistEl.querySelectorAll('li');
    items.forEach((item, i) => {
        const icon = item.querySelector('.play-icon');
        if (i === index) {
            item.classList.add('playing');
            icon.textContent = isPlaying ? '♫' : '♩';
        } else {
            item.classList.remove('playing');
            icon.textContent = '♩';
        }
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initPlayer);