import { game } from "./game.js";
import { rand } from "./utils.js"

export let audio = new Audio();
const NUMBER_OF_SONGS = 7;

const stylesNotSelected = [];
let lastPlayedSong = "";
const songs = {
    "Soundtrack": [
        "Stronger - Savfk"
    ],
    "EDM": [
        "Fast and Run - Nico Staf",
    ],
    "Rock": [
        "Wish You'd Come True - The 126ers",
        "Awakening - Silent Partner",
    ],
    "Progressive House": [
        "Calm Evening - Trellum",
    ],
}

export function SoundStart(){
    window.setTimeout(soundtrack, rand(1500,5000));
}

function selectSong(){
    const SONGS_PATH = "../audio/songs/";
    const SONGS_EXT = ".mp3";
    let song_name;

    if(stylesNotSelected.length == Object.keys(songs).length)
        return; //All music styles were deselected

    let themeID;
    let theme;
    do {
        themeID = rand(0, Object.keys(songs).length);
        theme = Object.keys(songs)[themeID];

    } while (stylesNotSelected.includes(theme));


    let songID;
    do { //Not repeat song
        songID = rand(0, songs[theme].length);
        song_name = songs[theme][songID];

    } while (songs[theme].length > 1 && song_name == lastPlayedSong);

    console.log("Song: "+song_name)
    
    lastPlayedSong = song_name;
    audio = new Audio(SONGS_PATH+song_name+SONGS_EXT);
}

export function soundtrack(){
    if(audio.paused){
        const SongID = rand(0,NUMBER_OF_SONGS);
        
        selectSong();
        
        audio.volume = game.settings.volume;

        const tryToPlay = setInterval(() => { 
            audio.play()
            .then(() => {
                clearInterval(tryToPlay);
            })
            .catch(error => {
                console.error(error);
            });

            audio.addEventListener('ended', soundtrack);

        }, 1000);
    }
}
