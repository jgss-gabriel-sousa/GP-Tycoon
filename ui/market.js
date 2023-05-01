import { NumberF, accentsTidy } from "../utils.js";
import { game } from "../game.js";
import { genTeamHTML } from "../app.js";
import { viewDriver } from "./viewDriver.js";

export function market(){
    let html = "";

    html += `
    <div id="market">
    <table>
        <tr>
            <th></th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Equipe</th>
            <th>Próx.</th>
        </tr>
    `

    for(const d in game.drivers) {
        const driver = game.drivers[d];
        
        html += `
        <tr class="driver" id="${driver.name}">
            <td><img class="country-flag" src="img/flags/${accentsTidy(driver.country)}.webp"></td>
            <td>${driver.name}</td>
            <td>${driver.age} anos</td>
            <td style="background-color: ${game.teams[driver.team].result_bg_color}; color: ${game.teams[driver.team].result_font_color}">
                ${driver.team} - ${driver.status}</td>
            `
            
        if(driver.contractRemainingYears == 0 && driver.newTeam != ""){
            html += `
            <td style="background-color: ${game.teams[driver.newTeam].result_bg_color}; color: ${game.teams[driver.newTeam].result_font_color}">
                ${driver.newTeam} - ${driver.newStatus}
            </td>`
        }
        else if(driver.contractRemainingYears > 0){
            html += `
            <td style="background-color: ${game.teams[driver.team].result_bg_color}; color: ${game.teams[driver.team].result_font_color}">
                ${driver.team} - ${driver.status}
            </td>`
        }
        else{
            html += `<td></td>`
        }

        html += `</tr>`
    }
    html += `</table></div>`
    
    Swal.fire({
        title: `Mercado de Pilotos`,
        html: html,
        width: "90%",
        showCloseButton: true,
        allowOutsideClick: true,
        focusConfirm: false,
        showConfirmButton: false,
    });
    
    for(let i = 0; i < document.querySelectorAll(".driver").length; i++){
        const el = document.querySelectorAll(".driver")[i];

        el.addEventListener("click", () => {
            viewDriver(el.id, true);
        });
    }
}