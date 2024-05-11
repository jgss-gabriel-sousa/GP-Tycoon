import { game } from "./game.js";
import { rand } from "./utils.js"

export let audio = new Audio();
const NUMBER_OF_SONGS = 7;

const stylesNotSelected = [];
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

export function soundtrack(){
    if(audio.paused){
        const SongID = rand(0,NUMBER_OF_SONGS);
        //audio = new Audio("../audio/songs/"+SongID+".mp3");
        audio.volume = game.settings.volume;

        const tryToPlay = setInterval(() => { 
            console.log(SongID)

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
