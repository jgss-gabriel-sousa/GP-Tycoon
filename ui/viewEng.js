import { accentsTidy } from "../utils.js";
import { countryCodes } from "../data/countryCodes.js";
import { game } from "../game.js";
import { genTeamHTML } from "../app.js";
import { marketEng } from "./market.js";

export function viewEng(name, returnToMarket){
    let html = "";
    const eng = game.engineers[name];

    html += `
    <div id="view-driver">
        <div id="view-eng">
            <div>
                <div id="eng-stats">
                    <div>
                        <h1>${eng.aero}</h1>
                        Aerodinâmica</h2>
                    </div>
                    <div>
                        <h1>${eng.eng}</h1>
                        Engenharia</h2>
                    </div>
                    <div>
                        <h1>${eng.adm}</h1>
                        Administração</h2>
                    </div>
                </div>
                <table id="view-driver-infos">
                    <th colspan="2">Dados Pessoais</th>
                    <tr>
                        <td>País:</td>
                        <td>
                            <img class="country-flag" src="img/flags/${accentsTidy(eng.country)}.webp">
                            ${countryCodes[eng.country]}
                        </td>
                    </tr>
                    <tr>
                        <td>Idade:</td>
                        <td>${eng.age} anos</td>
                    </tr>
                    <tr>
                        <td>Função:</td>
                        <td>${eng.occupation}</td>
                    </tr>
                    <tr>
                        <td>Salário:</td>
                        <td>${eng.salary} Mil por Corrida</td>
                    </tr>
                </table>
            </div>

            <div>
                <button id="dismiss-eng" value="${name}">Demitir</button>
                <!--
                <button id="change-eng" value="${name}">Trocar de Função</button>
                -->
            </div>    
        </div>
    </div>`;
    
    Swal.fire({
        title: `${name}`,
        html: html,
        width: "max-content",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    }).then(r => {
        if(returnToMarket)
            marketEng();
    });

    document.querySelector("#dismiss-eng").addEventListener("click", () => {
        dismissEng(name);
    });
    /*
    document.querySelector("#change-eng").addEventListener("click", () => {
        changeEng(name);
    });*/
}

function dismissEng(name){
    const eng = game.engineers[name];

    Swal.fire({
        title: `Demitir Engenheiro`,
        width: "max-content",
        showCloseButton: false,
        focusConfirm: true,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if(result.isConfirmed){
            if(eng.occupation == "Chefe de Equipe")         game.teams[eng.team].teamPrincipal = "";      
            if(eng.occupation == "Diretor Técnico")         game.teams[eng.team].engineers.technicalDirector = "";
            if(eng.occupation == "Designer Chefe")          game.teams[eng.team].engineers.chiefDesigner = "";
            if(eng.occupation == "Aerodinamicista Chefe")   game.teams[eng.team].engineers.chiefAerodynamicist = "";
            if(eng.occupation == "Engenheiro Chefe")        game.teams[eng.team].engineers.chiefEngineering = "";
            
            eng.team = "";
        }
        else if(result.isDenied){
            ;
        }
        
        genTeamHTML();
    });
}

function changeEng(name){
    const eng = game.engineers[name];
    const team = game.teams[game.team];
    const engineers = game.teams[game.team].engineers;

    let html = `
    <h3>${eng.name} (${eng.occupation})</h3>

    <table id="change-eng-table">`

    if(eng.occupation != "Chefe de Equipe"){
        html += `
        <tr>
            <td>Chefe de Equipe</td>
            <td>${team.teamPrincipal}</td>
            <td><button class="hide-btn">🔄</button></td>
        </tr>
        `
    }
    if(eng.occupation != "Diretor Técnico"){
        html += `
        <tr>
            <td>Diretor Técnico</td>
            <td>${engineers.technicalDirector}</td>
            <td><button class="hide-btn">🔄</button></td>
        </tr>
        `
    }
    if(eng.occupation != "Designer Chefe"){
        html += `
        <tr>
            <td>Designer Chefe</td>
            <td>${engineers.chiefDesigner}</td>
            <td><button class="hide-btn">🔄</button></td>
        </tr>
        `
    }
    if(eng.occupation != "Aerodinamicista Chefe"){
        html += `
        <tr>
            <td>Aerodinamicista Chefe</td>
            <td>${engineers.chiefAerodynamicist}</td>
            <td><button class="hide-btn">🔄</button></td>
        </tr>
        `
    }
    if(eng.occupation != "Engenheiro Chefe"){
        html += `
        <tr>
            <td>Engenheiro Chefe</td>
            <td>${engineers.chiefEngineering}</td>
            <td><button class="hide-btn">🔄</button></td>
        </tr>
        `
    }

    html += `</table>`;

    Swal.fire({
        html: html,
        title: `Trocar de Função`,
        width: "max-content",
        showCloseButton: false,
        focusConfirm: true,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if(result.isConfirmed){
            console.log(eng)
            console.log(eng)

            if(eng.occupation == "Chefe de Equipe")         game.teams[game.team].teamPrincipal = "";
            if(eng.occupation == "Diretor Técnico")         game.teams[game.team].engineers.technicalDirector = "";
            if(eng.occupation == "Designer Chefe")          game.teams[game.team].engineers.chiefDesigner = "";
            if(eng.occupation == "Aerodinamicista Chefe")   game.teams[game.team].engineers.chiefAerodynamicist = "";
            if(eng.occupation == "Engenheiro Chefe")        game.teams[game.team].engineers.chiefEngineering = "";
        }
        else if(result.isDenied){
            ;
        }
        
        genTeamHTML();
    });
}