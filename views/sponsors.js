import { game } from "../scripts/game.js";
import { genTeamMainMenu } from "../scripts/mainMenu.js";
import { NumberF } from "../scripts/utils.js";

export function sponsorsUI(){
    let html = "";
    const team = game.teams[game.team];
    
    const totalSponsorsValue = (team.sponsor_value * team.sponsors.length) + team.majorSponsor_value + team.factorySponsor_value

    let sponsorsHTML = `<div id="sponsors-list">`;
    sponsorsHTML += `
    <div id="major-sponsor">
        <img src="./img/sponsors/${team.majorSponsor}.webp">
        <h1>${team.majorSponsor}</h1>
    </div>
    <br>
    <div id="others-sponsors">
    `

    for(let i = 0; i < team.sponsors.length; i++) {
        const sponsor = team.sponsors[i];
        
        sponsorsHTML += `
        <div>
            <img src="./img/sponsors/${sponsor}.webp">
            <h1>${sponsor}</h1>
        </div>
        `
    }
    sponsorsHTML += "</div>";

    html += `
    <div id="sponsors-container">
        <div>
            <h2>Ofertas</h2>
        </div>
        <div>
            <h2>Carro</h2>
        </div>
        <div id="sponsors">
            <h2>Patrocinadores</h2>
            <p>Total: ${NumberF(totalSponsorsValue*1000,"ext",0)}</p>
            
            ${sponsorsHTML}
        </div>
    `;

    html += `</div>`;

    Swal.fire({
        title: `Patrocinadores`,
        html: html,
        width: "90%",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    }).then(e => {
        ;
    });


}