import { game } from "../scripts/game.js";
import { genTeamMainMenu } from "./mainMenu.js";
import { NumberF } from "../scripts/utils.js";

export function viewSelectSponsor(){
    let html = "";

    html += `
    <div id="select-sponsors-container">
        
    </div>
    `;

    Swal.fire({
        title: `Patrocinadores`,
        html: html,
        width: "90%",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    }).then(e => {
        viewSponsors();
    });
}