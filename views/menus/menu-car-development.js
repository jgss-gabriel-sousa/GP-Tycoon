import { RunRaceSimulation } from "../../scripts/championship/run-race-simulation.js";
import { addButtonEvent } from "../../scripts/events.js";
import { saveGame } from "../start-load-save.js";
import { viewGameOptions } from "../viewGameOptions.js";

export function MenuCarDevelopment(){
    document.querySelector("#menu-container").innerHTML += `
    <div class="game-menu" id="menu-car-development">
        <div id="car" class="bars-table">
            <div id="car-info"></div>
            <div id="chassis"></div>
            <div id="engine"></div>
            <div id="engineering"></div>
            <div id="development"></div>
        </div>
    </div>
    `

    addButtonEvent("#btn-play", () => RunRaceSimulation());
    addButtonEvent("#btn-save-game", saveGame);
    addButtonEvent("#btn-options", viewGameOptions);
}