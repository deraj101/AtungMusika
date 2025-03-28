// Audio Player Class
class MusicPlayer {
    constructor() {
      this.audio = document.getElementById('audio-player');
      this.playPauseBtn = document.getElementById('play-pause-btn');
      this.prevBtn = document.getElementById('prev-btn');
      this.nextBtn = document.getElementById('next-btn');
      this.progressBar = document.getElementById('progress-bar');
      this.currentTimeEl = document.getElementById('current-time');
      this.durationEl = document.getElementById('duration');
      this.nowPlayingTitle = document.getElementById('now-playing-title');
      this.nowPlayingArtist = document.getElementById('now-playing-artist');
      this.nowPlayingImg = document.getElementById('now-playing-img');
      this.volumeControl = document.querySelector('input[type="range"]');
      this.shuffleBtn = document.getElementById('shuffle-btn');
      this.repeatBtn = document.getElementById('repeat-btn');
      
      this.playlist = [];
      this.currentTrackIndex = 0;
      this.isPlaying = false;
      this.isShuffled = false;
      this.isRepeated = false;
      
      this.init();
    }
  
    init() {
      // Event Listeners
      this.playPauseBtn.addEventListener('click', () => this.togglePlay());
      this.prevBtn.addEventListener('click', () => this.prevTrack());
      this.nextBtn.addEventListener('click', () => this.nextTrack());
      this.audio.addEventListener('timeupdate', () => this.updateProgress());
      this.audio.addEventListener('ended', () => this.handleTrackEnd());
      this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
      this.audio.addEventListener('error', (e) => this.handleError(e));
      this.volumeControl.addEventListener('input', () => this.setVolume());
      this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
      this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
      
      // Initialize playlist from DOM
      this.initPlaylist();
      
      // Set initial volume
      this.audio.volume = this.volumeControl.value / 100;
    }
  
    initPlaylist() {
      const songElements = document.querySelectorAll('.song-card');
      songElements.forEach((song, index) => {
        this.playlist.push({
          title: song.dataset.title,
          artist: song.dataset.artist,
          src: song.dataset.src,
          img: song.dataset.img,
          element: song
        });
        
        // Add click event to each song
        song.addEventListener('click', () => {
          this.currentTrackIndex = index;
          this.loadTrack(this.currentTrackIndex);
          this.play();
        });
      });
    }
  
    loadTrack(index) {
      const track = this.playlist[index];
      if (!track) return;
      
      this.nowPlayingTitle.textContent = track.title;
      this.nowPlayingArtist.textContent = track.artist;
      this.nowPlayingImg.src = track.img;
      this.audio.src = track.src;
      
      // Highlight current track in playlist
      this.playlist.forEach((t, i) => {
        t.element.classList.toggle('bg-gray-800', i === index);
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
          this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        })
        .catch(error => {
          console.error('Playback failed:', error);
          this.handleError(error);
        });
    }
  
    pause() {
      this.audio.pause();
      this.isPlaying = false;
      this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
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
      this.progressBar.style.width = `${progressPercent}%`;
      
      // Update time display
      this.currentTimeEl.textContent = this.formatTime(currentTime);
    }
  
    updateDuration() {
      this.durationEl.textContent = this.formatTime(this.audio.duration);
    }
  
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  
    setVolume() {
      this.audio.volume = this.volumeControl.value / 100;
    }
  
    toggleShuffle() {
      this.isShuffled = !this.isShuffled;
      this.shuffleBtn.classList.toggle('text-purple-400', this.isShuffled);
      this.shuffleBtn.classList.toggle('text-gray-400', !this.isShuffled);
      
      if (this.isShuffled) {
        this.shufflePlaylist();
      } else {
        // Restore original order
        this.playlist.sort((a, b) => a.element.dataset.index - b.element.dataset.index);
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
      this.repeatBtn.classList.toggle('text-purple-400', this.isRepeated);
      this.repeatBtn.classList.toggle('text-gray-400', !this.isRepeated);
    }
  
    handleTrackEnd() {
      if (this.isRepeated) {
        this.audio.currentTime = 0;
        this.play();
      } else {
        this.nextTrack();
      }
    }
  
    handleError(error) {
      console.error('Audio error:', error);
      // Show error to user
      this.nowPlayingTitle.textContent = 'Error loading track';
      this.nowPlayingArtist.textContent = 'Please try another song';
      this.pause();
    }
  }
  
  // Initialize player when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
  });

  const themeToggle = document.getElementById('theme-toggle');

  const themeIcon = document.getElementById('theme-icon');

  const body = document.body;


  themeToggle.addEventListener('click', () => {
      body.classList.toggle('bg-gray-900'); // Dark mode background
      body.classList.toggle('bg-white'); // Light mode backgroun
      body.classList.toggle('text-white');
      body.classList.toggle('text-black'); 
      themeIcon.classList.toggle('fa-moon'); 
      themeIcon.classList.toggle('fa-sun');
  });

  const songs = [
    { title: "Englishera", artist: "John Kyle Perez", src: "wwd.mp3juice.blog - Englishera - Missing Felimon(Lyrics) (320 KBps).mp3", img: "perez.png" },
    { title: "V-HIRE", artist: "Driver sa", src: "wwd.mp3juice.blog - V-hire with lyrics (320 KBps).mp3", img: "https://storage.googleapis.com/a1aa/image/LZK9ePUp6YhAR4iAyoYp1eSCEr8IS1Yfe5gwZn3dwPw.jpg" },
    { title: "Suroy Suroy", artist: "Missing - Felimon", src: "wwd.mp3juice.blog - Missing Filemon - Suroy-Suroy lyric video (320 KBps).mp3", img: "https://storage.googleapis.com/a1aa/image/a3vqg2seiRfUrUXIjc_2hXMnrBwnxnAL7YlKmAZYrHg.jpg" },
    { title: "Chinita", artist: "Perez", src: "wwd.mp3juice.blog - Chinita - Bisrock (Tiktok Lyric Video) (320 KBps).mp3", img: "https://storage.googleapis.com/a1aa/image/1ACEKnp84OGES5TYGpQPKAWOxAOXNqe22AobrYiZVhc.jpg" },
    { title: "Prinsipal", artist: "Fernandez", src: "wwd.mp3juice.blog - Missing Filemon - PRINSIPAL (Lyrics) (320 KBps).mp3", img: "https://storage.googleapis.com/a1aa/image/1ACEKnp84OGES5TYGpQPKAWOxAOXNqe22AobrYiZVhc.jpg" },
    { title: "Bisan pa", artist: "Unknown", src: "wwd.mp3juice.blog - bisan pa (lyrics) (320 KBps).mp3", img: "https://storage.googleapis.com/a1aa/image/1ACEKnp84OGES5TYGpQPKAWOxAOXNqe22AobrYiZVhc.jpg" },
    { title: "Istambay", artist: "Enchi", src: "wwd.mp3juice.blog - Istambay (Lyrics) - Enchi (320 KBps).mp3", img: "https://storage.googleapis.com/a1aa/image/1ACEKnp84OGES5TYGpQPKAWOxAOXNqe22AobrYiZVhc.jpg" },
    { title: "Palagot sa kontra", artist: "Unknown", src: "wwd.mp3juice.blog - PALAGOT SA KONTRA - Phylum (lyrics) bisrock (320 KBps).mp3", img: "https://storage.googleapis.com/a1aa/image/1ACEKnp84OGES5TYGpQPKAWOxAOXNqe22AobrYiZVhc.jpg" },
    { title: "Agay", artist: "Abscond", src: "wwd.mp3juice.blog - AGAY (lyrics) Abscond (320 KBps).mp3", img: "https://storage.googleapis.com/a1aa/image/1ACEKnp84OGES5TYGpQPKAWOxAOXNqe22AobrYiZVhc.jpg" }
];

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    searchResults.innerHTML = ''; // Clear previous results
    if (query) {
        const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(query));
        filteredSongs.forEach(song => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.textContent = `${song.title} - ${song.artist}`;
            resultItem.onclick = () => {
                // Handle song selection
                searchInput.value = song.title; // Set input value
                searchResults.innerHTML = ''; // Clear results
            };
            searchResults.appendChild(resultItem);
        });
        searchResults.classList.remove('hidden'); // Show results
    } else {
        searchResults.classList.add('hidden'); // Hide results if input is empty
    }
});

const audioPlayer = document.getElementById('audio-player');

searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    searchResults.innerHTML = ''; // Clear previous results
    if (query) {
        const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(query));
        filteredSongs.forEach(song => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item', 'flex', 'items-center', 'space-x-2', 'p-2', 'cursor-pointer');

            // Create an image element for the song cover
            const songImage = document.createElement('img');
            songImage.src = song.img; // Assuming you have the img in your song object
            songImage.alt = song.title;
            songImage.classList.add('h-10', 'w-10', 'rounded'); // Adjust size as needed

            // Create a text element for the song title and artist
            const songText = document.createElement('div');
            songText.textContent = `${song.title} - ${song.artist}`;
            songText.classList.add('flex-1');

            // Append image and text to the result item
            resultItem.appendChild(songImage);
            resultItem.appendChild(songText);

            resultItem.onclick = () => {
                // Set the audio source and play the song
                audioPlayer.src = song.src; // Assuming you have the src in your song object
                audioPlayer.play();
                
                // Update the now playing info
                document.getElementById('now-playing-title').textContent = song.title;
                document.getElementById('now-playing-artist').textContent = song.artist;
                document.getElementById('now-playing-img').src = song.img; // Assuming you have the img in your song object
                
                // Clear the search input and results
                searchInput.value = song.title; // Set input value
                searchResults.innerHTML = ''; // Clear results
                searchResults.classList.add('hidden'); // Hide results
            };

            searchResults.appendChild(resultItem);
        });
        searchResults.classList.remove('hidden'); // Show results
    } else {
        searchResults.classList.add('hidden'); // Hide results if input is empty
    }
});

