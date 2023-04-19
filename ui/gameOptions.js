import { game } from "../game.js";
import { genTeamHTML } from "../app.js";

export function gameOptions(){
    const volumeValue = localStorage.getItem("mv-volume");
    
    let html = `
    <div id="game-options">
        <label id="volume">
            Volume:
            <input type="range" min="0" max="1" value="${volumeValue}" step="0.05">
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
        title: "<strong>Opções do Jogo</strong>",
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