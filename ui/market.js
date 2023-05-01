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
            <th>Negociar</th>
        </tr>
    `

    for(const d in game.drivers) {
        const driver = game.drivers[d];
        
        html += `
        <tr>
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

    html += `
            <td>${driver.contractRemainingYears == 0 ? `<button class="negotiate" value="${driver.name}">Negociar</button>` : ""}</td>
        </tr>
        `
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
    
    for(let i = 0; i < document.querySelectorAll("#market td:nth-child(2)").length; i++){
        const el = document.querySelectorAll("#market td:nth-child(2)")[i];
        
        el.addEventListener("click", () => {
            viewDriver(el.innerHTML, true);
        });
    }
    for(let i = 0; i < document.querySelectorAll(".negotiate").length; i++){
        const el = document.querySelectorAll(".negotiate")[i];
        
        el.addEventListener("click", () => {
            negotiate(el.value);
        });
    }
}


function negotiate(driverName){
    let html = "";
    const driver = game.drivers[driverName];
    const team = game.teams[game.team];

    html += `
    <div id="negotiate-market">
        <img id="view-driver-driver-img" src="img/drivers/${driver.name}.webp" onerror="this.src='img/drivers/generic.webp';">
        
        <div>
            <div class="slidercontainer">
                <input id="slider-duration" class="slider" type="range" min="1" value="1" step="1" max="5">
            </div>
            
            <p id="years">1 Ano</p>
            <br>
            <p id="value">Salário: ${NumberF(driver.salary * 1000000,"ext-short",0)} por corrida</p>
            <br>
            <select>
                ${team.new1driver == "" ? "<option>1º Piloto</option>" : ""}
                ${team.new2driver == "" ? "<option>2º Piloto</option>" : ""}
                ${team.newTdriver == "" ? "<option>Piloto de Testes</option>" : ""}
            </select>
        </div>
    </div>
    `
    
    Swal.fire({
        title: `${driver.name}`,
        html: html,
        width: "40em",
        showCloseButton: false,
        focusConfirm: true,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if(result.isConfirmed){
            if(!document.querySelector("select").value){
                market();
            }
            else{
                ;
            }

        }else if(result.isDenied){
            market();
        }
    });

    document.querySelector("#slider-duration").addEventListener("input", () => {
        const sliderValue = Number(document.querySelector("#slider-duration").value);

        document.querySelector("#years").innerHTML = sliderValue == 1 ? sliderValue+" ano" : sliderValue+" anos";

        let value = driver.salary * sliderValue;

        document.querySelector("#value").innerHTML = "Salário: "+NumberF(value * 1000000,"ext-short",0)+" por corrida";
    });
}