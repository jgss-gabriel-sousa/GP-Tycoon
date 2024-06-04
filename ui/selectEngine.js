import { NumberF } from "../scripts/utils.js";
import { game } from "../scripts/game.js";
import { genTeamMainMenu } from "./mainMenu.js";

export function selectEngine(endSeason){
    let html = "";
    const engines = game.engines;

    html += `
    <table id="select-engine">
        <tr>
            <th>Fabricante</th>
            <th>Potência</th>
            <th>Dirigibilidade</th>
            <th>Confiabilidade</th>
            <th>Valor Base Anual</th>
            <th></th>
        </tr>
    `

    for(const e in engines) {
        const engine = engines[e];
        
        html += `
        <tr>
            <td>${e}</td>
            <td>${engine.power}</td>
            <td>${engine.drivability}</td>
            <td>${engine.reliability}%</td>
            <td>${NumberF(engine.cost*1000,"ext",0)}</td>
            <td>${!engine.blackList.includes(game.team) ? `<button class="engine" value="${e}">Negociar</button>` : ""}</td>
        </tr>
        `
    }
    html += `</table>`
    
    Swal.fire({
        title: `Negociar Contrato de Motor`,
        html: html,
        width: "max-content",
        showCloseButton: !endSeason ?? true,
        allowOutsideClick: !endSeason ?? true,
        allowEscapeKey: !endSeason ?? true,
        focusConfirm: false,
        showConfirmButton: false,
    });
    
    for(let i = 0; i < document.querySelectorAll(".engine").length; i++){
        const el = document.querySelectorAll(".engine")[i];
        
        el.addEventListener("click", () => {
            negotiate(el.value, endSeason)
        });
    }
}


function negotiate(engineName, endSeason){
    let html = "";
    const engine = game.engines[engineName];
    let value = engine.cost;

    if(endSeason){
        value *= 1.25;
    }

    html += `
    <div id="negotiate">
        <div class="slidercontainer">
            <input id="slider-duration" class="slider" type="range" min="${engine.minContractLength}" value="${engine.minContractLength}" step="1" max="${endSeason ? 1 : 5}">
        </div>
        
        <p id="years">1 Ano</p>
        <br>
        <p id="value">${NumberF(value*1000,"ext",0)}</p>
        <p>${endSeason ? `Contrato 25% mais caro e limitado a 1 ano, por demora em confirmar` : ""}</p>
    </div>`
    
    Swal.fire({
        title: `Negociar Motores ${engineName}`,
        html: html,
        width: "max-content",
        showCloseButton: false,
        focusConfirm: true,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if(result.isConfirmed){
            if(!endSeason){
                game.teams[game.team].newEngineContract = Number(document.querySelector("#slider-duration").value);
                game.teams[game.team].newEngine = engineName;
                game.teams[game.team].cash -= value;
                game.teams[game.team].financialReport["Engine"] = -value;
                game.teams[game.team].financialReport["Balance"] -= value;
            }
            else{
                game.teams[game.team].engineContract = 0;
                game.teams[game.team].engine = engineName;
                game.teams[game.team].cash -= value;
                game.teams[game.team].financialReport["Engine"] = -value;
                game.teams[game.team].financialReport["Balance"] -= value;
            }
            
            genTeamMainMenu();
        }
        else if(result.isDenied){
            selectEngine();
        }
    });

    document.querySelector("#slider-duration").addEventListener("input", () => {
        const sliderValue = Number(document.querySelector("#slider-duration").value);

        document.querySelector("#years").innerHTML = sliderValue == 1 ? sliderValue+" ano" : sliderValue+" anos";

        value = engine.cost * sliderValue;

        value -= ((sliderValue-1) * engine.cost/4)

        document.querySelector("#value").innerHTML = NumberF(value*1000,"ext",0);
    });
}

