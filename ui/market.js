import { NumberF, accentsTidy } from "../scripts/utils.js";
import { game } from "../scripts/game.js";
import { genTeamHTML } from "../scripts/main.js";
import { viewDriver } from "./viewDriver.js";
import { viewEng } from "./viewEng.js"

export function market(){
    let html = "";

    html += `
    <div id="market">
    <table>
        <tr>
            <th></th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Salário</th>
            <th>Equipe</th>
            <th>Próx.</th>
        </tr>
    `

    const drivers = Object.values(game.drivers);

    drivers.sort((a, b) => a.status.localeCompare(b.status));
    drivers.sort((a, b) => a.team.localeCompare(b.team));

    console.log(drivers)
    for(let i = 0; i < drivers.length; i++){
        const driver = drivers[i];

        if(driver.name == "") continue
        if(driver.team == "") continue
        if(driver.condition != "racing"){
            console.log(driver)
            continue
        }
        
        html += `
        <tr class="driver" id="${driver.name}">
            <td><img class="country-flag" src="img/flags/${accentsTidy(driver.country)}.webp"></td>
            <td>${driver.name}</td>
            <td>${driver.age} anos</td>
            <td>${driver.salary*1000}K</td>
            <td style="background-color: ${game.teams[driver.team].result_bg_color}; color: ${game.teams[driver.team].result_font_color}">
                ${driver.team} - ${driver.status}</td>
            `
            
        if(driver.contractRemainingYears == 0 && driver.newTeam && driver.newTeam != "Aposentadoria"){
            html += `
            <td style="background-color: ${game.teams[driver.newTeam].result_bg_color}; color: ${game.teams[driver.newTeam].result_font_color}">
                ${driver.newTeam} - ${driver.newStatus}
            </td>`
        }
        else if(driver.contractRemainingYears > 0 && driver.newTeam != "Aposentadoria"){
            html += `
            <td style="background-color: ${game.teams[driver.team].result_bg_color}; color: ${game.teams[driver.team].result_font_color}">
                ${driver.team} - ${driver.status}
            </td>`
        }
        else if(driver.newTeam == "Aposentadoria"){
            html += `
            <td>
                Aposentadoria
            </td>`
        }
        else{
            html += `<td></td>`
        }

        html += `</tr>`
    }
    html += `</table>
    <br>
    <table>
        <tr>
            <th></th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Salário</th>
            <th>Próx.</th>
        </tr>`

    for(let i = 0; i < drivers.length; i++){
        const driver = drivers[i];
        if(driver.name == "") continue
        if(driver.team != "") continue
        
        html += `
        <tr class="driver" id="${driver.name}">
            <td><img class="country-flag" src="img/flags/${accentsTidy(driver.country)}.webp"></td>
            <td>${driver.name}</td>
            <td>${driver.age} anos</td>
            <td>${driver.salary*1000}K</td>
            `
            
        if(driver.newContractRemainingYears >= 0 && driver.newTeam && driver.newTeam != "Aposentadoria"){
            html += `
            <td style="background-color: ${game.teams[driver.newTeam].result_bg_color}; color: ${game.teams[driver.newTeam].result_font_color}">
                ${driver.newTeam} - ${driver.newStatus}
            </td>`
        }
        else if(driver.newTeam == "Aposentadoria"){
            html += `
            <td>
                Aposentadoria
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

export function marketEng(){
    let html = "";

    html += `
    <div id="market-eng">
    <table>
        <tr>
            <th>Nome</th>
            <th>Idade</th>
            <th>Salário</th>
            <th>Função</th>
        </tr>
    `
    
    const engineers = Object.values(game.engineers);

    engineers.sort((a, b) => a.team.localeCompare(b.team));

    for(let i = 0; i < engineers.length; i++){
        const eng = engineers[i];
        if(eng.name == "") continue
        if(eng.team == "") continue
        
        html += `
        <tr class="driver" id="${eng.name}">
            <td>${eng.name}</td>
            <td>${eng.age} anos</td>
            <td>${eng.salary}K</td>
            <td style="background-color: ${game.teams[eng.team].result_bg_color}; color: ${game.teams[eng.team].result_font_color}">
                ${eng.team} - ${eng.occupation}
            </td>
        </tr>`
    }
    html += `</table>
    <br>
    <table>
        <tr>
            <th>Nome</th>
            <th>Idade</th>
            <th>Salário</th>
        </tr>`

    for(let i = 0; i < engineers.length; i++){
        const eng = engineers[i];
        if(eng.name == "") continue
        if(eng.team != "") continue
        
        html += `
        <tr class="driver" id="${eng.name}">
            <td>${eng.name}</td>
            <td>${eng.age} anos</td>
            <td>${eng.salary}K</td>
        </tr>`
    }
    html += `</table></div>`
    
    Swal.fire({
        title: `Mercado de Engenheiros`,
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
            viewEng(el.id, true);
        });
    }
}