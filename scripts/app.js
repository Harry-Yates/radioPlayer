const audio = document.querySelector("#stream");
const volumeControl = document.querySelector('[name="volume"]');

const currentlyPlayingLabel = document.querySelector(".currently-playing-label");
const currentlyPlaying = document.querySelector(".currently-playing-title");
const currentlyPlayingArtist = document.querySelector(".currently-playing-artist");

// const currentlyPlayingComposer = document.querySelector(".currently-playing-composer");
// const currentlyPlayingRecordLabel = document.querySelector(".currently-playing-recordLabel");

const volumeButton = document.querySelector('[name="mute"]');
const volumeButtonIcon = volumeButton.querySelector("i.fas");
const url = "https://api.sr.se/api/v2/playlists/rightnow?format=json&indent=true&channelid=164";

/*  play button */
const play = document.querySelector(".play");
const pause = document.querySelector(".pause");
const playBtn = document.querySelector(".circle__btn");
const wave1 = document.querySelector(".circle__back-1");
const wave2 = document.querySelector(".circle__back-2");

playBtn.addEventListener("click", function (e) {
  e.preventDefault();
  pause.classList.toggle("visibility");
  play.classList.toggle("visibility");
  playBtn.classList.toggle("shadow");
  wave1.classList.toggle("paused");
  wave2.classList.toggle("paused");
});

let isPlaying = false;
let fetchInterval = null;
let currentVolume = 0.2;

audio.volume = currentVolume;

// fetch("http://sverigesradio.se/topsy/direkt/132.mp3")
//   .then((response) => response.json())
//   .then((data) => console.log(data));

const fetchCurrentlyPlaying = () =>
  fetch("https://api.sr.se/api/v2/playlists/rightnow?format=json&indent=true&channelid=164")
    .then((response) => response.json())
    .then((data) => {
      currentlyPlayingLabel.innerText = `${data.playlist.channel.name}`;
      currentlyPlaying.innerText = `${data.playlist.song.title}`;
      currentlyPlayingArtist.innerText = `${data.playlist.song.artist}`;
      //   currentlyPlayingComposer.innerText = `${data.playlist.song.composer}`;
      //   currentlyPlayingRecordLabel.innerText = `${data.playlist.song.recordlabel}`;
    })
    .catch((err) => {
      fetch("https://api.sr.se/api/v2/playlists/rightnow?format=json&indent=true&channelid=164")
        .then((response) => response.json())
        .then((data) => {
          currentlyPlayingLabel.innerText = `${data.playlist.channel.name}`;
          currentlyPlaying.innerText = `${data.playlist.previoussong.title}`;
          currentlyPlayingArtist.innerText = `${data.playlist.previoussong.artist}`;
          //   currentlyPlayingComposer.innerText = `${data.playlist.previoussong.composer}`;
          //   currentlyPlayingRecordLabel.innerText = `${data.playlist.previoussong.recordlabel}`;
        });
    });

//fall back to previous song if song is empty.

function changeArtwork() {
  fetch(`https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=band`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.urls.regular);
      document.getElementById("album-container").innerHTML = `
      <img src=${data.urls.full} />
	  <div class="dot"></div>
      `;
    })
    .catch((err) => {
      document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1638211374179-3f34b71605c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzkyNTI4OTE&ixlib=rb-1.2.1&q=80&w=1080
      )`;
    });
}

navigator.geolocation.getCurrentPosition((position) => {
  fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
    .then((res) => {
      if (!res.ok) {
        throw Error("Weather data not available");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      document.querySelector(".weather").innerHTML = `
			<img class="weather__Icon" src=${iconUrl} />
			<p class="weather__location">${data.name}</p>
			<p class="weather__temperature">${Math.round(data.main.temp)}º</p>
		`;
    })
    .catch((err) => console.error(err));
});

setInterval(function () {
  changeArtwork();
}, 45000);

async function getRadioData() {
  try {
    let response = await fetch("https://api.sr.se/api/v2/playlists/rightnow?format=json&indent=true&channelid=164");
    let radioData = await response.json();
    // console.log(radioData);
    return radioData;
  } catch (error) {
    console.log("error :", error);
  }
}
// getRadioData();
async function doSmtnWithJsonData() {
  let quizData = await getRadioData();
  console.log(quizData);
}
doSmtnWithJsonData();

const adjustVolumeIcon = (volume) => {
  volumeButtonIcon.classList.remove("fa-volume-off");
  volumeButtonIcon.classList.remove("fa-volume-down");
  volumeButtonIcon.classList.remove("fa-volume-up");
  volumeButtonIcon.classList.remove("fa-volume-mute");

  if (volume >= 0.75) {
    volumeButtonIcon.classList.add("fa-volume-up");
  }

  if (volume < 0.75 && volume >= 0.2) {
    volumeButtonIcon.classList.add("fa-volume-down");
  }

  if (volume < 0.2 && volume > 0) {
    volumeButtonIcon.classList.add("fa-volume-off");
  }

  if (volume === 0) {
    volumeButtonIcon.classList.add("fa-volume-mute");
  }
};

volumeControl.addEventListener("input", () => {
  const volume = parseFloat(volumeControl.value);

  audio.volume = currentVolume = volume;
  currentVolume = volume;

  adjustVolumeIcon(volume);
});

volumeButton.addEventListener("click", () => {
  if (audio.volume > 0) {
    adjustVolumeIcon(0);
    audio.volume = 0;
    volumeControl.value = 0;
  } else {
    adjustVolumeIcon(currentVolume);
    audio.volume = currentVolume;
    volumeControl.value = currentVolume;
  }
});

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    document.getElementById("album-container").innerHTML = `
    <img src="../assets/images/albumCover.jpg")>
    <div class="dot"></div>
    `;

    clearInterval(fetchInterval);
    currentlyPlayingLabel.innerText = "Radio Station";
    currentlyPlaying.innerText = "PLAY";
    currentlyPlayingArtist.innerText = "Artist";
  } else {
    audio.play();
    changeArtwork();

    fetchCurrentlyPlaying();
    fetchInterval = setInterval(fetchCurrentlyPlaying, 3000);
  }

  isPlaying = !isPlaying;
});
