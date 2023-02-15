const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const LOCAL_STORAGE_CONFIG_KEY = 'user_config';

// Elements
const dashboard = $('.dashboard');
const title = $('.dashboard .title');
const cd = $('.cd');
const cdThumbnail = $('.cd-thumbnail');
const btnRepeat = $('#btn-repeat');
const btnPrev = $('#btn-prev');
const btnPlay = $('#btn-play');
const iconPlay = $('.icon-play');
const iconPause = $('.icon-pause');
const btnNext = $('#btn-next');
const btnShuffle = $('#btn-shuffle');
const progress = $('.progress');
const playlist = $('.playlist');
const audio = $('#audio');

const app = {
	songs: [
		{
			id: 1,
			name: 'Burning',
			singer: 'Alexi Action',
			path: './assets/audio/burning.mp3',
			image: './assets/images/thumbnail-1.jpg',
		},
		{
			id: 2,
			name: 'Crackling Fireplace',
			singer: 'JuliusH',
			path: './assets/audio/crackling-fireplace-and-soft-piano-music.mp3',
			image: './assets/images/thumbnail-2.jpg',
		},
		{
			id: 3,
			name: 'Let It Go',
			singer: 'JuliusH',
			path: './assets/audio/let-it-go.mp3',
			image: './assets/images/thumbnail-3.jpg',
		},
		{
			id: 4,
			name: 'Muddy Joe',
			singer: 'Gvidon',
			path: './assets/audio/muddy-joe.mp3',
			image: './assets/images/thumbnail-4.jpg',
		},
		{
			id: 5,
			name: 'Phantom',
			singer: 'lemonmusicstudio',
			path: './assets/audio/phantom.mp3',
			image: './assets/images/thumbnail-5.jpg',
		},
		{
			id: 6,
			name: 'Relaxing Music E Major',
			singer: 'moonyzone',
			path: './assets/audio/relaxing-music-e-major.mp3',
			image: './assets/images/thumbnail-6.jpg',
		},
		{
			id: 7,
			name: 'The Destroyer',
			singer: 'lemonmusicstudio',
			path: './assets/audio/the-destroyer.mp3',
			image: './assets/images/thumbnail-7.jpg',
		},
		{
			id: 8,
			name: 'This Is War',
			singer: 'solbox',
			path: './assets/audio/this-is-war-loopable.mp3',
			image: './assets/images/thumbnail-8.jpg',
		},
		{
			id: 9,
			name: 'Wataboi FIYAH',
			singer: 'ItsWatR',
			path: './assets/audio/wataboi-fiyah.mp3',
			image: './assets/images/thumbnail-9.jpg',
		},
	],
	config: JSON.parse(localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY)) || {},
	currentIndex: 0,
	isPlaying: false,
	isRepeat: false,
	isShuffle: false,

	setConfig(key, value) {
		this.config[key] = value;
		localStorage.setItem(
			LOCAL_STORAGE_CONFIG_KEY,
			JSON.stringify(this.config),
		);
	},

	defineProperties() {
		Object.defineProperty(this, 'currentSong', {
			get: () => {
				return this.songs[this.currentIndex];
			},
		});
	},

	/**
	 * Load config from local storage
	 */
	loadConfig() {
		if (this.config?.isRepeat) this.isRepeat = this.config?.isRepeat;
		if (this.config?.isShuffle) this.isShuffle = this.config?.isShuffle;
	},

	/**
	 * Change button state first time loaded
	 */
	renderOption() {
		btnRepeat.classList.toggle('active', this.isRepeat);
		btnShuffle.classList.toggle('active', this.isShuffle);
	},

	/**
	 * Dynamic margin top to playlist
	 * Depends on dashboard's height
	 */
	marginTopPlaylist() {
		playlist.style.marginTop = dashboard.offsetHeight + 'px';
	},

	renderPlaylist() {
		let htmlBlock = '';
		this.songs.forEach((song, index) => {
			htmlBlock += `
				<div class="song-item ${
					index === this.currentIndex ? 'active' : ''
				}" data-index="${index}">
					<div class="thumbnail">
						<div class="image" style="background-image: url('${song.image}')"></div>
					</div>
					<div class="info">
						<h3 class="title">${song.name}</h3>
						<h5 class="artist">${song.singer}</h5>
					</div>
					<div class="option"><i class="fas fa-ellipsis-h"></i></div>
				</div>
			`;
		});
		playlist.innerHTML = htmlBlock;
	},

	loadCurrentSong() {
		title.textContent = this.currentSong.name;
		cdThumbnail.style.backgroundImage = `url('${this.currentSong.image}')`;
		audio.src = this.currentSong.path;
	},

	prevSong() {
		this.currentIndex--;
		if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
		this.loadCurrentSong();
	},
	nextSong() {
		this.currentIndex++;
		if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
		this.loadCurrentSong();
	},

	loadRandomSong() {
		let randomIndex;
		do {
			randomIndex = Math.floor(Math.random() * this.songs.length);
		} while (randomIndex === this.currentIndex);
		this.currentIndex = randomIndex;
		this.loadCurrentSong();
	},

	scrollActiveSongIntoView() {
		setTimeout(() => {
			$('.song-item.active').scrollIntoView({
				behavior: 'smooth',
				block: 'end',
			});
		}, 300);
	},
	handleChangeSong() {
		this.renderPlaylist();
		this.scrollActiveSongIntoView();
		audio.play();
	},

	/**
	 * Toggle play button's icon on play / pause
	 * @param {boolean} isPlaying
	 */
	changeButtonPlayIcon(isPlaying) {
		iconPlay.style.display = isPlaying ? 'none' : 'block';
		iconPause.style.display = isPlaying ? 'block' : 'none';
	},

	eventHandlers() {
		const _this = this;

		/**
		 * Show / hide CD thumbnail when scrolling playlist
		 */
		const cdWidth = cd.offsetWidth;
		document.onscroll = () => {
			const scrollTop =
				window.scrollY || document.documentElement.scrollTop;
			const newCdWidth = cdWidth - scrollTop;
			cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
			cd.style.opacity = newCdWidth / cdWidth;
		};

		/**
		 * CD Thumbnail rotate animation
		 */
		const cdThumbnailAnimation = cdThumbnail.animate(
			[
				{
					transform: 'rotate(360deg)',
				},
			],
			{
				duration: 10000,
				iterations: Infinity,
			},
		);
		cdThumbnailAnimation.pause();

		/**
		 * Handle play and pause
		 */
		btnPlay.onclick = () => {
			this.isPlaying ? audio.pause() : audio.play();
		};
		audio.onplay = () => {
			this.isPlaying = true;
			this.changeButtonPlayIcon(this.isPlaying);
			cdThumbnailAnimation.play();
		};
		audio.onpause = () => {
			this.isPlaying = false;
			this.changeButtonPlayIcon(this.isPlaying);
			cdThumbnailAnimation.pause();
		};

		/**
		 * Handle next and prev
		 */
		btnNext.onclick = () => {
			app.nextSong();
			_this.handleChangeSong();
		};
		btnPrev.onclick = () => {
			app.prevSong();
			_this.handleChangeSong();
		};

		/**
		 * Handle repeat & shuffle
		 */
		btnRepeat.onclick = () => {
			_this.isRepeat = !_this.isRepeat;
			_this.setConfig('isRepeat', _this.isRepeat);
			if (_this.isRepeat && _this.isShuffle) btnShuffle.click();
			btnRepeat.classList.toggle('active', _this.isRepeat);
		};
		btnShuffle.onclick = () => {
			_this.isShuffle = !_this.isShuffle;
			_this.setConfig('isShuffle', _this.isShuffle);
			if (_this.isShuffle && _this.isRepeat) btnRepeat.click();
			btnShuffle.classList.toggle('active', _this.isShuffle);
		};

		/**
		 * Handle song finished
		 */
		audio.onended = () => {
			if (!_this.isRepeat && !_this.isShuffle) {
				btnNext.click();
				return;
			}
			if (_this.isShuffle) _this.loadRandomSong();
			_this.handleChangeSong();
		};

		/**
		 * Tracking progress bar when playing
		 */
		audio.ontimeupdate = () => {
			if (audio.currentTime) {
				const progressPercent = Math.floor(
					(audio.currentTime / audio.duration) * 100,
				);
				progress.value = progressPercent;
			}
		};

		/**
		 * Handle seeking
		 */
		progress.oninput = (e) => {
			const seekingTime = (e.target.value * audio.duration) / 100;
			audio.currentTime = seekingTime;
		};

		/**
		 * Change song on click
		 */
		playlist.onclick = (e) => {
			const songItemElement = e.target.closest('.song-item:not(.active)');
			const optionElement = e.target.closest('.option');
			if (!songItemElement && !optionElement) return;
			if (optionElement) {
				return;
			}
			if (songItemElement) {
				_this.currentIndex = Number(songItemElement.dataset.index);
				_this.loadCurrentSong();
				_this.renderPlaylist();
				audio.play();
			}
		};
	},
	start() {
		this.loadConfig();
		this.defineProperties();
		this.eventHandlers();
		this.loadCurrentSong();
		this.marginTopPlaylist();
		this.renderOption();
		this.renderPlaylist();
	},
};

app.start();
