// Audio Player Class
class MusicPlayer {
    constructor() {
        this.audio = $('#audio-player')[0];
        this.playPauseBtn = $('#play-pause-btn');
        this.prevBtn = $('#prev-btn');
        this.nextBtn = $('#next-btn');
        this.progressBar = $('#progress-bar');
        this.currentTimeEl = $('#current-time');
        this.durationEl = $('#duration');
        this.nowPlayingTitle = $('#now-playing-title');
        this.nowPlayingArtist = $('#now-playing-artist');
        this.nowPlayingImg = $('#now-playing-img');
        this.volumeControl = $('input[type="range"]');
        this.shuffleBtn = $('#shuffle-btn');
        this.repeatBtn = $('#repeat-btn');
        
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isRepeated = false;
        
        this.init();
    }

    init() {
        this.playPauseBtn.on('click', () => this.togglePlay());
        this.prevBtn.on('click', () => this.prevTrack());
        this.nextBtn.on('click', () => this.nextTrack());
        $(this.audio).on('timeupdate', () => this.updateProgress());
        $(this.audio).on('ended', () => this.handleTrackEnd());
        $(this.audio).on('loadedmetadata', () => this.updateDuration());
        this.volumeControl.on('input', () => this.setVolume());
        this.shuffleBtn.on('click', () => this.toggleShuffle());
        this.repeatBtn.on('click', () => this.toggleRepeat());
        
        this.initPlaylist();
        this.audio.volume = this.volumeControl.val() / 100;
    }

    initPlaylist() {
        $('.song-card').each((index, song) => {
            const songData = {
                title: $(song).data('title'),
                artist: $(song).data('artist'),
                src: $(song).data('src'),
                img: $(song).data('img'),
                element: song
            };
            this.playlist.push(songData);
            
            $(song).on('click', () => {
                this.currentTrackIndex = index;
                this.loadTrack(this.currentTrackIndex);
                this.play();
            });
        });
    }

    loadTrack(index) {
        const track = this.playlist[index];
        if (!track) return;
        
        this.nowPlayingTitle.text(track.title);
        this.nowPlayingArtist.text(track.artist);
        this.nowPlayingImg.attr('src', track.img);
        this.audio.src = track.src;
        
        this.playlist.forEach((t, i) => {
            $(t.element).toggleClass('bg-gray-800', i === index);
        });
    }

    togglePlay() {
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.playPauseBtn.html('<i class="fas fa-pause"></i>');
            })
            .catch(console.error);
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playPauseBtn.html('<i class="fas fa-play"></i>');
    }

    prevTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) this.play();
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) this.play();
    }

    updateProgress() {
        const { currentTime, duration } = this.audio;
        const progressPercent = (currentTime / duration) * 100;
        this.progressBar.css('width', `${progressPercent}%`);
        this.currentTimeEl.text(this.formatTime(currentTime));
    }

    updateDuration() {
        this.durationEl.text(this.formatTime(this.audio.duration));
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    setVolume() {
        this.audio.volume = this.volumeControl.val() / 100;
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.toggleClass('text-purple-400 text-gray-400');
        
        if (this.isShuffled) {
            this.shufflePlaylist();
        } else {
            this.playlist.sort((a, b) => $(a.element).data('index') - $(b.element).data('index'));
        }
    }

    shufflePlaylist() {
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
    }

    toggleRepeat() {
        this.isRepeated = !this.isRepeated;
        this.repeatBtn.toggleClass('text-purple-400 text-gray-400');
    }

    handleTrackEnd() {
        if (this.isRepeated) {
            this.audio.currentTime = 0;
            this.play();
        } else {
            this.nextTrack();
        }
    }
}

// Initialize player when DOM is loaded
$(document).ready(() => {
    // Display user name
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        $('#userName').text(currentUser.username);
    }

    // Add logout functionality
    $('#logout-btn').on('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'auth.html';
    });

    const musicPlayer = new MusicPlayer();
    
    // Theme toggle
    $('#theme-toggle').on('click', () => {
        $('body').toggleClass('bg-gray-900 bg-white text-white text-black');
        $('#theme-icon').toggleClass('fa-moon fa-sun');
    });
    
    // Search functionality
    $('#search-input').on('input', function() {
        const query = $(this).val().toLowerCase();
        $('.song-card').each(function() {
            const title = $(this).data('title').toLowerCase();
            const artist = $(this).data('artist').toLowerCase();
            $(this).toggle(title.includes(query) || artist.includes(query));
        });
    });
});

// Initialize variables
let isPlaying = false;
let currentSongIndex = 0;
let playCounts = JSON.parse(localStorage.getItem('playCounts')) || {};

// Get DOM elements
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.querySelector('input[type="range"]');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const searchInput = document.getElementById('search-input');
const songCards = document.querySelectorAll('.song-card');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logout-btn');

// Check authentication
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }
    userName.textContent = currentUser.name;
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
}

// Navigation handling
function handleNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    function showSection(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.remove('hidden');
        }
        
        navLinks.forEach(link => {
            if (link.dataset.section === sectionId) {
                link.classList.add('text-purple-400');
            } else {
                link.classList.remove('text-purple-400');
            }
        });
        
        history.pushState(null, '', `#${sectionId}`);
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(link.dataset.section);
        });
    });
    
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1) || 'home';
        showSection(hash);
    });
    
    const initialHash = window.location.hash.substring(1) || 'home';
    showSection(initialHash);
}

// Play song function
function playSong(songCard) {
    const title = songCard.dataset.title;
    const artist = songCard.dataset.artist;
    const src = songCard.dataset.src;
    const img = songCard.dataset.img;

    updatePlayCount(title);
    updateNowPlaying(title, artist, img);
    
    audioPlayer.src = src;
    audioPlayer.play();
    isPlaying = true;
    updatePlayPauseButton();
}

// Update play count
function updatePlayCount(title) {
    playCounts[title] = (playCounts[title] || 0) + 1;
    localStorage.setItem('playCounts', JSON.stringify(playCounts));
    updatePopularSongs();
}

// Update now playing info
function updateNowPlaying(title, artist, img) {
    document.getElementById('now-playing-title').textContent = title;
    document.getElementById('now-playing-artist').textContent = artist;
    document.getElementById('now-playing-img').src = img;
}

// Update play/pause button
function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector('i');
    icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

// Update progress bar
function updateProgress() {
    const { currentTime, duration } = audioPlayer;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Update time display
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
}

// Format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update popular songs
function updatePopularSongs() {
    const popularContainer = document.getElementById('popular-songs');
    if (!popularContainer) return;

    const sortedSongs = Object.entries(playCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    popularContainer.innerHTML = '';
    
    sortedSongs.forEach(([title, count]) => {
        const songCard = document.querySelector(`.song-card[data-title="${title}"]`);
        if (songCard) {
            const artist = songCard.dataset.artist;
            const img = songCard.dataset.img;
            const src = songCard.dataset.src;

            const popularSong = document.createElement('div');
            popularSong.className = 'song-card rounded-lg p-3 sm:p-4 cursor-pointer';
            popularSong.setAttribute('data-title', title);
            popularSong.setAttribute('data-artist', artist);
            popularSong.setAttribute('data-src', src);
            popularSong.setAttribute('data-img', img);

            popularSong.innerHTML = `
                <div class="flex items-center space-x-3 sm:space-x-4">
                    <div class="relative">
                        <img alt="${title}" class="h-12 w-12 sm:h-16 sm:w-16 rounded" src="${img}"/>
                        <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                            <i class="fas fa-play text-white text-lg sm:text-xl"></i>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-medium text-sm sm:text-base">${title}</h3>
                        <p class="text-xs sm:text-sm text-gray-400">${artist}</p>
                        <p class="text-xs text-purple-400">Plays: ${count}</p>
                    </div>
                </div>
            `;

            popularSong.addEventListener('click', () => {
                playSong(popularSong);
            });

            popularContainer.appendChild(popularSong);
        }
    });
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    songCards.forEach(card => {
        const title = card.dataset.title.toLowerCase();
        const artist = card.dataset.artist.toLowerCase();
        
        if (title.includes(searchTerm) || artist.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    handleNavigation();
    updatePopularSongs();

    // Add logout event listener
    logoutBtn.addEventListener('click', handleLogout);

    // Add search event listener
    searchInput.addEventListener('input', handleSearch);

    // Add click event listeners to song cards
    songCards.forEach(card => {
        card.addEventListener('click', () => {
            playSong(card);
        });
    });

    // Audio player events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayPauseButton();
    });

    // Play/Pause button
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseButton();
    });

    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value / 100;
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('bg-white');
        document.body.classList.toggle('text-gray-900');
        themeIcon.className = document.body.classList.contains('bg-white') 
            ? 'fas fa-sun' 
            : 'fas fa-moon';
    });
});

