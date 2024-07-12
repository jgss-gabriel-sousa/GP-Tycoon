import { game } from "../scripts/game.js";
import { genTeamMainMenu } from "./mainMenu.js";
import { NumberF } from "../scripts/utils.js";

export function viewSponsors(){
    let html = "";
    const team = game.teams[game.team];
    
    const totalSponsorsValue = (team.sponsor_value * team.sponsors.length) + team.majorSponsor_value + team.factorySponsor_value

    let majorSponsorValue = 0;
    if(team.majorSponsor){
        majorSponsorValue = team.majorSponsor_value;
    }


    let sponsorsHTML = `
        <div id="sponsors-list">
            <div id="major-sponsor">
    `;
    
    if(team.majorSponsor){
        sponsorsHTML += `
            <img src="./img/sponsors/${team.majorSponsor}.webp">
            <h1>${team.majorSponsor}</h1>
        `
    }
    else {
        sponsorsHTML += `
            <img src="./img/sponsors/no_sponsor.webp" onclick="alert('Test')">
        `
    }

    sponsorsHTML += `</div><p>${NumberF(majorSponsorValue*1000,"ext",0)}</p>`
    sponsorsHTML += `<div id="others-sponsors">`

    for(let i = 0; i < 3; i++) {
        if(i < team.sponsors.length){
            const sponsor = team.sponsors[i];
        
            sponsorsHTML += `
            <div>
                <img src="./img/sponsors/${sponsor}.webp">
                <h1>${sponsor}</h1>
            </div>
            `
        }
        else {
            sponsorsHTML += `
            <div>
                <img src="./img/sponsors/no_sponsor.webp">
            </div>
            `
        }
    }
    sponsorsHTML += `
        </div>
        <p>${NumberF(team.sponsor_value*1000,"ext",0)}`
        
        if(team.sponsors.length > 1){
            sponsorsHTML += `
                cada</p>
                <p>${NumberF((team.sponsor_value * team.sponsors.length)*1000,"ext",0)} somados</p>
            `
        }
        else {
            sponsorsHTML += `</p>`
        }

    sponsorsHTML += `</div>`;

    html += `
    <div id="sponsors-container">
        <div id="sponsors">
            <h2>Patrocinadores</h2>
            <p>Total: ${NumberF(totalSponsorsValue*1000,"ext",0)} por corrida</p>
            
            ${sponsorsHTML}
        </div>
        <div>
            <h2>Metas</h2>
        </div>
        <div>
            <h2>Bônus</h2>
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


    document.querySelectorAll("#others-sponsors > div").forEach(sponsor => {
        sponsor.addEventListener("click", (e) => {
            alert(JSON.stringify(sponsor))
        });
    });
}