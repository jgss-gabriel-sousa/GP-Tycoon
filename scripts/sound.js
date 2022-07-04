import { rand } from "./funcs.js"

var audio = new Audio();
const NUMBER_OF_SONGS = 8;

export function soundtrack(){
    if(audio.paused){
        const newSongID = rand(0,NUMBER_OF_SONGS);
        audio = new Audio("songs/"+newSongID+".mp3");
        audio.play();
    }

    audio.volume = Number(document.getElementById("volume").value)/4;
    
    window.setTimeout(soundtrack, 500);
}

