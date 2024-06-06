import { audio } from "../scripts/audio.js";
import { game } from "../scripts/game.js";
import { genTeamMainMenu } from "./mainMenu.js";

export function viewGameOptions(){
    const raceSpeedValue = game.settings["race-simulation-speed"];
    const visualRaceSim = game.settings["visual-race-simulation"];
    const uiTeamColors = game.settings["ui-team-colors"];
    
    let html = `
    <div id="game-options">
        <div id="volume">
            <p>Volume:</p>
            <input type="range" min="0" max="1" value="${game.settings.volume}" step="0.05">
            <label>${game.settings.volume * 100}%</label>
        </div>
        <div id="visual-race-sim">
            <p>Simulação Visual de Corrida:</p>
            <input type="checkbox" ${visualRaceSim == true ? `checked="checked"` : ""}>
        </div>
        <div id="race-sim-speed">
            <p>Velocidade da Simulação de Corrida:</p>
            <input type="range" min="25" max="500" value="${525 - raceSpeedValue}" step="25">
            <label>${Math.round(((525 - raceSpeedValue) / 500)*100)}%</label>
        </div>

        <div id="ui-team-colors">
            <p>Interface com cores da equipe:</p>
            <input type="checkbox" ${uiTeamColors == true ? `checked="checked"` : ""}>
        </div>
    </div>
    `;
    html += `
            <span class="checkmark"></span>
        </label>
    </div>
    `;

    Swal.fire({
        title: "Opções do Jogo",
        html: html,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Ok",
    });

    document.querySelector("#volume input").addEventListener("input", () => {
        document.querySelector("#volume label").innerHTML = Math.round(document.querySelector("#volume input").value*100)+"%";
        game.settings.volume = document.querySelector("#volume input").value;
        audio.volume = game.settings.volume;
    });
    
    document.querySelector("#race-sim-speed input").addEventListener("input", () => {
        const speed = Math.round((document.querySelector("#race-sim-speed input").value / 500)*100);
        document.querySelector("#race-sim-speed label").innerHTML = speed+"%";
        game.settings["race-simulation-speed"] = 525 - document.querySelector("#race-sim-speed input").value;
    });

    document.querySelector("#visual-race-sim input").addEventListener("change", () => {
        game.settings["visual-race-simulation"] = document.querySelector("#visual-race-sim input").checked;
    });

    document.querySelector("#ui-team-colors input").addEventListener("change", () => {
        game.settings["ui-team-colors"] = document.querySelector("#ui-team-colors input").checked;
        genTeamMainMenu();
    });
}