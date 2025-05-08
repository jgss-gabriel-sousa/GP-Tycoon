import { game } from "../../scripts/game.js";
import { LOC } from "../../scripts/translation.js";
import { accentsTidy } from "../../scripts/utils.js";

export function initMenuStandings(){
    document.querySelector("#menu-container").innerHTML += `
    <div class="game-menu" id="menu-standings">
    
    </div>
    `
}


export function updateMenuStandings(){
}
