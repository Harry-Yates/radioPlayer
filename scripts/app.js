const audio = document.querySelector("#stream")
const volumeControl = document.querySelector('[name="volume"]')

const currentlyPlayingLabel = document.querySelector(
    ".currently-playing-label",
)

// Artist
const currentlyPlayingArtistNext = document.querySelector(
    ".currently-playing-artist-next",
)
const currentlyPlayingArtist = document.querySelector(
    ".currently-playing-artist",
)
const currentlyPlayingArtistPrevious = document.querySelector(
    ".currently-playing-artist-previous",
)

//Song
const currentlyPlayingSongNext = document.querySelector(
    ".currently-playing-song-next",
)
const currentlyPlayingSong = document.querySelector(
    ".currently-playing-song",
)
const currentlyPlayingSongPrevious = document.querySelector(
    ".currently-playing-song-previous",
)

const volumeButton = document.querySelector('[name="mute"]')
const volumeButtonIcon = volumeButton.querySelector("i.fas")
const url =
    "https://api.sr.se/api/v2/playlists/rightnow?format=json&indent=true&channelid=164"

/*  play button */
const play = document.querySelector(".play")
const pause = document.querySelector(".pause")
const playBtn = document.querySelector(".circle__btn")
const wave1 = document.querySelector(".circle__back-1")
const wave2 = document.querySelector(".circle__back-2")

playBtn.addEventListener("click", function (e) {
    e.preventDefault()
    pause.classList.toggle("visibility")
    play.classList.toggle("visibility")
    playBtn.classList.toggle("shadow")
    wave1.classList.toggle("paused")
    wave2.classList.toggle("paused")
})

let isPlaying = false
let fetchInterval = null
let currentVolume = 0.2

audio.volume = currentVolume

const fetchCurrentlyPlaying = () =>
    fetch(
        "https://api.sr.se/api/v2/playlists/rightnow?format=json&indent=true&channelid=164",
    )
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            //Station
            currentlyPlayingLabel.innerText = `${data.playlist.channel.name}`
            //Song
            currentlyPlayingSongPrevious.innerText = `${data.playlist.previoussong.title}`
            //Artist
            currentlyPlayingArtistPrevious.innerText = `${data.playlist.previoussong.artist}`

            currentlyPlayingArtist.innerText = `DJ TALKING`
            currentlyPlayingSong.innerText = `DJ TALKING`
            // currentlyPlayingArtistNext.innerText = `ED SHEERAN`
            // currentlyPlayingSongNext.innerText = `BAD HABITS`

            currentlyPlayingSong.innerText =
                `${data.playlist.song.title}`
                    ? `${data.playlist.song.title}`
                    : `${data.playlist.previoussong.title}`
            currentlyPlayingArtist.innerText =
                `${data.playlist.song.artist}`
                    ? `${data.playlist.song.artist}`
                    : `${data.playlist.previoussong.artist}`

            // currentlyPlayingArtistNext.innerText = `${data.playlist.nextsong.artist}`
            // currentlyPlayingSongNext.innerText = `${data.playlist.nextsong.title}`
        })
        .catch(err => console.error(err))

// `http://api.sr.se/api/v2/playlists/getplaylistbychannelid?id=164&format=json`

const fetchCurrentlyPlayingPlaylist = () =>
    fetch(
        "http://api.sr.se/api/v2/playlists/getplaylistbychannelid?id=164&format=json",
    )
        .then(response => response.json())
        .then(dataPlay => {
            // console.log(dataPlay)
            currentlyPlayingArtistNext.innerText = `${dataPlay.song[5].title}`
            currentlyPlayingSongNext.innerText = `${dataPlay.song[5].artist}`
        })
        .catch(err => console.error(err))

//fall back to previous song if song is empty.

function changeArtwork() {
    fetch(
        `https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=band`,
    )
        .then(res => res.json())
        .then(data => {
            // console.log(data.urls.regular);
            document.getElementById("album-container").innerHTML = `
      <img src=${data.urls.full} />
	  <div class="dot"></div>
      `
        })
        .catch(err => {
            document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1638211374179-3f34b71605c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MzkyNTI4OTE&ixlib=rb-1.2.1&q=80&w=1080
      )`
        })
}

navigator.geolocation.getCurrentPosition(position => {
    fetch(
        `https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`,
    )
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.querySelector(".weather").innerHTML = `
			<img class="weather__Icon" src=${iconUrl} />
			<p class="weather__location">${data.name}</p>
			<p class="weather__temperature">${Math.round(data.main.temp)}º</p>
		`
        })
        .catch(err => console.error(err))
})

setInterval(function () {
    changeArtwork()
}, 45000)

async function getRadioData() {
    try {
        let response = await fetch(
            "https://api.sr.se/api/v2/playlists/rightnow?format=json&indent=true&channelid=164",
        )
        let radioData = await response.json()
        // console.log(radioData);
        return radioData
    } catch (error) {
        console.log("error :", error)
    }
}
getRadioData()

const adjustVolumeIcon = volume => {
    volumeButtonIcon.classList.remove("fa-volume-off")
    volumeButtonIcon.classList.remove("fa-volume-down")
    volumeButtonIcon.classList.remove("fa-volume-up")
    volumeButtonIcon.classList.remove("fa-volume-mute")

    if (volume >= 0.75) {
        volumeButtonIcon.classList.add("fa-volume-up")
    }

    if (volume < 0.75 && volume >= 0.2) {
        volumeButtonIcon.classList.add("fa-volume-down")
    }

    if (volume < 0.2 && volume > 0) {
        volumeButtonIcon.classList.add("fa-volume-off")
    }

    if (volume === 0) {
        volumeButtonIcon.classList.add("fa-volume-mute")
    }
}

volumeControl.addEventListener("input", () => {
    const volume = parseFloat(volumeControl.value)

    audio.volume = currentVolume = volume
    currentVolume = volume

    adjustVolumeIcon(volume)
})

volumeButton.addEventListener("click", () => {
    if (audio.volume > 0) {
        adjustVolumeIcon(0)
        audio.volume = 0
        volumeControl.value = 0
    } else {
        adjustVolumeIcon(currentVolume)
        audio.volume = currentVolume
        volumeControl.value = currentVolume
    }
})

document.getElementById("switch-2").addEventListener("click", () => {
    document.body.classList.toggle("dark")
    console.log("toggle clicked")
})

playBtn.addEventListener("click", () => {
    if (isPlaying) {
        audio.pause()
        document.getElementById("album-container").innerHTML = `
    <img style=" animation-play-state: paused;" src="./assets/images/album.jpg")>
    <div class="dot"></div>
    `

        clearInterval(fetchInterval)
        currentlyPlayingLabel.innerText = "RADIO STATION"
        currentlyPlayingSong.innerText = "PLAY"
        currentlyPlayingArtist.innerText = "Artist"
        currentlyPlayingSongNext.innerText = "NEXT"
        currentlyPlayingSongPrevious.innerText = "PREV"
        currentlyPlayingArtistNext.innerText = "NEXT"
        currentlyPlayingArtistPrevious.innerText = "PREV"
    } else {
        audio.play()
        changeArtwork()
        fetchCurrentlyPlaying()
        fetchCurrentlyPlayingPlaylist()
        fetchInterval = setInterval(fetchCurrentlyPlaying, 3000)
        fetchInterval = setInterval(
            fetchCurrentlyPlayingPlaylist,
            3000,
        )
    }

    isPlaying = !isPlaying
})
