import { game } from "../game.js";
import { genTeamHTML } from "../app.js";

export function gameOptions(){
    const volumeValue = localStorage.getItem("gpTycoon-volume") ?? 0.25;
    const raceSpeedValue = localStorage.getItem("gpTycoon-race-sim-speed") ?? 100;
    
    let html = `
    <div id="game-options">
        <label id="volume">
            Volume:
            <input type="range" min="0" max="1" value="${volumeValue}" step="0.05">
        </label>
        <label id="race-sim-speed">
            Velocidade da Simulação de Corrida:
            <input type="range" min="50" max="500" value="${raceSpeedValue}" step="50">
        </label>

        <label id="ui-team-colors">
            Interface com cores da equipe:
    `;
    if(game.uiTeamColors)
        html += `<input type="checkbox" checked="checked">`;
    else
        html += `<input type="checkbox">`;
    html += `
            <span class="checkmark"></span>
        </label>
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

      
    document.querySelector("#volume input").addEventListener("change", () => {
        localStorage.setItem("mv-volume", volumeEl.value);
    });

    document.querySelector("#ui-team-colors input").addEventListener("click", () => {
        if(game.uiTeamColors)
            game.uiTeamColors = false;
        else
            game.uiTeamColors = true;

        genTeamHTML();
        console.log(game.uiTeamColors)
    });
}