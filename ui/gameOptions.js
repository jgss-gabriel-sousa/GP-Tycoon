import { game } from "../game.js";
import { genTeamHTML } from "../app.js";

export function gameOptions(){
    const volumeValue = localStorage.getItem("gpTycoon-volume") ?? 0.25;
    const raceSpeedValue = localStorage.getItem("gpTycoon-race-sim-speed") ?? 100;
    const visualRaceSim = localStorage.getItem("gpTycoon-visual-race-sim") ?? true;
    const uiTeamColors = localStorage.getItem("gpTycoon-ui-team-colors") ?? true;
    console.log(visualRaceSim)
    console.log(uiTeamColors)
    
    let html = `
    <div id="game-options">
        <div id="volume">
            <p>Volume:</p>
            <input type="range" min="0" max="1" value="${volumeValue}" step="0.05">
            <label>${volumeValue*100}%</label>
        </div>
        <div id="visual-race-sim">
            <p>Simulação Visual de Corrida:</p>
            <input type="checkbox" ${visualRaceSim == "true" ? `checked="checked"` : ""}>
        </div>
        <div id="race-sim-speed">
            <p>Duração da Simulação de Corrida:</p>
            <input type="range" min="25" max="500" value="${raceSpeedValue}" step="25">
            <label>${raceSpeedValue}</label>
        </div>

        <div id="ui-team-colors">
            Interface com cores da equipe:
            <input type="checkbox" ${uiTeamColors == "true" ? `checked="checked"` : ""}>
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
    });
    document.querySelector("#volume input").addEventListener("change", () => {
        localStorage.setItem("gpTycoon-volume", document.querySelector("#volume input").value);
    });
    
    document.querySelector("#race-sim-speed input").addEventListener("input", () => {
        document.querySelector("#race-sim-speed label").innerHTML = document.querySelector("#race-sim-speed input").value;
    });
    document.querySelector("#race-sim-speed input").addEventListener("change", () => {
        localStorage.setItem("gpTycoon-race-sim-speed", document.querySelector("#race-sim-speed input").value);
    });

    document.querySelector("#visual-race-sim input").addEventListener("change", () => {
        localStorage.setItem("gpTycoon-visual-race-sim", document.querySelector("#visual-race-sim input").checked);
    });

    document.querySelector("#ui-team-colors input").addEventListener("change", () => {
        console.log(document.querySelector("#ui-team-colors input").checked)
        localStorage.setItem("gpTycoon-ui-team-colors", document.querySelector("#ui-team-colors input").checked);
        
        genTeamHTML();
    });
}