import { NumberF, accentsTidy } from "../scripts/utils.js";
import { countryCodes } from "../data/countryCodes.js";
import { game } from "../scripts/game.js";
import { CalcTeamDevPoints } from "../scripts/teams.js";
import { genTeamHTML } from "../scripts/main.js";
import { marketEng } from "./market.js";
import { createTooltip } from "../scripts/tooltips.js";

export function viewEng(name, returnToMarket){
    let html = "";
    const eng = game.engineers[name];
    const team = game.teams[game.team];
    let contractButton = false;

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
                        <td colspan="2" style="text-align: center">${eng.gender}</td>
                    </tr>
                    <tr>
                        <td>Personalidade:</td>
                        <td class="persona-${eng.personality}">${eng.personality}</td>
                    </tr>
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
                    `

                    if(eng.occupation){
                        html += `
                        <tr>
                            <td>Função:</td>
                            <td>${eng.occupation}</td>
                        </tr>
                        <tr>
                            <td>Equipe:</td>
                            <td>${eng.team}</td>
                        </tr>
                        `
                    }

                    html += `
                    <tr>
                        <td>Salário:</td>
                        <td>${eng.salary} Mil por Corrida</td>
                    </tr>
                </table>
            </div>
            <div>`

            if(eng.team == game.team){
                html += `<button id="dismiss-eng" value="${name}">Demitir</button>`;
            }
            else if(
                team.teamPrincipal == "" ||
                team.engineers.technicalDirector == "" ||
                team.engineers.chiefAerodynamicist == "" ||
                team.engineers.chiefDesigner == "" ||
                team.engineers.chiefEngineering == ""
            ){
                html += `<button id="contract-eng" value="${name}">Contratar</button>`;
                contractButton = true;
            }
            
            if(eng.team == game.team)
                html +=`<button id="change-eng" value="${name}">Trocar de Função</button>`;
            
        html += `
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

        const personalities = [
            "Perfeccionista", "Inovador", "Líder Nato", "Colaborador",
            "Ambicioso", "Estrategista", "Comprometido", "Comunicativo",
            "Analítico", "Versátil", "Adaptável", "Resiliente",
            "Metódico", "Independente", "Diplomático", "Otimista", "Eficiente"
        ];
        for (let i = 0; i < personalities.length; i++) {
            const personality = personalities[i];
        }

        if(returnToMarket)
            marketEng();
    });

    if(eng.team == game.team){
        document.querySelector("#dismiss-eng").addEventListener("click", () => {
            dismissEng(name);
        });
    }
    if(contractButton){
        document.querySelector("#contract-eng").addEventListener("click", () => {
            contractEng(name);
        });
    }
    if(document.querySelector("#change-eng"))
    document.querySelector("#change-eng").addEventListener("click", () => {
        changeEng(name);
    });
    
    const personalities = [
        "Perfeccionista", "Inovador", "Líder Nato", "Colaborador",
        "Ambicioso", "Estrategista", "Comprometido", "Comunicativo",
        "Analítico", "Versátil", "Adaptável", "Resiliente",
        "Metódico", "Independente", "Diplomático", "Otimista", "Eficiente"
    ];
    for (let i = 0; i < personalities.length; i++) {
        const personality = personalities[i];
        
        if(document.querySelector(".persona-"+personality)){
            createTooltip(".persona-"+personality, personality+" é uma personalidade!!");
        }
    }
}



function dismissEng(name){
    const eng = game.engineers[name];

    const fine = Math.ceil(eng.salary*10);
    const html = `A multa rescisória vai ser de ${NumberF(fine * 1000,"ext-short",0)}`

    Swal.fire({
        html: html,
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
            
            const team = game.teams[game.team];
            team.financialReport["Fines"] += -fine;
            team.financialReport["Balance"] -= fine;
            team.cash -= fine;
        }
        else if(result.isDenied){
            ;
        }
        
        CalcTeamDevPoints(game.team);
        genTeamHTML();
    });
}

function contractEng(name){
    const eng = game.engineers[name];
    const team = game.teams[game.team];
    const engineers = game.teams[game.team].engineers;
    let fine = 0;

    let html = `<div id="contract-eng">
    <h3>${eng.name}</h3>
    <table id="eng-stats">
        <tr>
            <td>${eng.aero}</td>
            <td>${eng.eng}</td>
            <td>${eng.adm}</td>
        </tr>
        <tr>
            <td>Aerodinâmica</td>
            <td>Engenharia</td>
            <td>Administração</td>
        </tr>
    </table>
    <br>
    `
    
    if(eng.team != ""){
        fine = Math.ceil(eng.salary*20);
        html += `<p>A multa rescisória a ser paga para a ${eng.team} vai ser de ${NumberF(fine * 1000,"ext-short",0)}</p><br>`
    }
    
    html += `
    <p>Função: </p>
    <select id="select-function">`
    if(team.teamPrincipal == ""){
        html += `<option value="teamPrincipal">Chefe de Equipe</option>`
    }
    if(engineers.technicalDirector == ""){
        html += `<option value="technicalDirector">Diretor Técnico</option>`
    }
    if(engineers.chiefDesigner == ""){
        html += `<option value="chiefDesigner">Designer Chefe</option>`
    }
    if(engineers.chiefAerodynamicist == ""){
        html += `<option value="chiefAerodynamicist">Aerodinamicista Chefe</option>`
    }
    if(engineers.chiefEngineering == ""){
        html += `<option value="chiefEngineering">Engenheiro Chefe</option>`
    }
    html += `</select><br></div>`;

    Swal.fire({
        html: html,
        title: `Contratar Engenheiro`,
        width: "max-content",
        showCloseButton: false,
        focusConfirm: true,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if(result.isConfirmed){
            if(document.querySelector("#select-function").value == "teamPrincipal"){
                game.teams[game.team].teamPrincipal = eng.name;
                game.engineers[eng.name].occupation = "Chefe de Equipe";
            }
            if(document.querySelector("#select-function").value == "technicalDirector"){
                game.teams[game.team].engineers.technicalDirector = eng.name;
                game.engineers[eng.name].occupation = "Diretor Técnico";
            }
            if(document.querySelector("#select-function").value == "chiefDesigner"){
                game.teams[game.team].engineers.chiefDesigner = eng.name;
                game.engineers[eng.name].occupation = "Aerodinamicista Chefe";
            }
            if(document.querySelector("#select-function").value == "chiefAerodynamicist"){
                game.teams[game.team].engineers.chiefAerodynamicist = eng.name;
                game.engineers[eng.name].occupation = "Designer Chefe";
            }
            if(document.querySelector("#select-function").value == "chiefEngineering"){
                game.teams[game.team].engineers.chiefEngineering = eng.name;
                game.engineers[eng.name].occupation = "Engenheiro Chefe";
            }
            
            game.engineers[eng.name].team = game.team;
            team.financialReport["Fines"] += fine;
            team.financialReport["Balance"] -= fine;
            team.cash -= fine;

            genTeamHTML();
            marketEng();
        }
        if(result.isDenied){
            viewEng(name,true);
        }
        
        CalcTeamDevPoints(game.team);
        genTeamHTML();
    });


}

function changeEng(name){
    const eng = game.engineers[name];
    const team = game.teams[game.team];
    const engineers = game.teams[game.team].engineers;
    let newOccupation = "";

    let html = `
    <h3>${eng.name}</h3>
    <h4>${eng.occupation}</h4>

    <table id="change-eng-table">`

    if(eng.occupation != "Chefe de Equipe"){
        html += `
        <tr>
            <td>Chefe de Equipe</td>
            <td>${team.teamPrincipal}</td>
            <td><button class="hide-btn" id="changeTo-teamPrincipal">🔄</button></td>
        </tr>
        `
    }
    if(eng.occupation != "Diretor Técnico"){
        html += `
        <tr>
            <td>Diretor Técnico</td>
            <td>${engineers.technicalDirector}</td>
            <td><button class="hide-btn" id="changeTo-technicalDirector">🔄</button></td>
        </tr>
        `
    }
    if(eng.occupation != "Designer Chefe"){
        html += `
        <tr>
            <td>Designer Chefe</td>
            <td>${engineers.chiefDesigner}</td>
            <td><button class="hide-btn" id="changeTo-chiefDesigner">🔄</button></td>
        </tr>
        `
    }
    if(eng.occupation != "Aerodinamicista Chefe"){
        html += `
        <tr>
            <td>Aerodinamicista Chefe</td>
            <td>${engineers.chiefAerodynamicist}</td>
            <td><button class="hide-btn" id="changeTo-chiefAerodynamicist">🔄</button></td>
        </tr>
        `
    }
    if(eng.occupation != "Engenheiro Chefe"){
        html += `
        <tr>
            <td>Engenheiro Chefe</td>
            <td>${engineers.chiefEngineering}</td>
            <td><button class="hide-btn" id="changeTo-chiefEngineering">🔄</button></td>
        </tr>
        `
    }

    html += `</table>`;

    Swal.fire({
        html: html,
        title: `Trocar de Função`,
        width: "500px",
        showCloseButton: false,
        focusConfirm: true,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if(result.isConfirmed && newOccupation != ""){                        
            function changeOccupation(oldOccupation){
                const roles = {
                    "Diretor Técnico": "technicalDirector",
                    "Designer Chefe": "chiefDesigner",
                    "Aerodinamicista Chefe": "chiefAerodynamicist",
                    "Engenheiro Chefe": "chiefEngineering"
                };

                const promoted = eng.name;
                let demoted;

                if(newOccupation == "Chefe de Equipe"){
                    demoted = team.teamPrincipal;
                    team.teamPrincipal = promoted;
                    game.engineers[promoted].occupation = "Chefe de Equipe";
                }
                else{
                    demoted = team.engineers[roles[newOccupation]];
                    team.engineers[roles[newOccupation]] = promoted;
                    game.engineers[promoted].occupation = newOccupation;
                }

                if(oldOccupation == "Chefe de Equipe"){
                    team.teamPrincipal = demoted;
                    game.engineers[demoted].occupation = "Chefe de Equipe";
                }
                else{
                    team.engineers[roles[oldOccupation]] = demoted;
                    game.engineers[demoted].occupation = oldOccupation;
                }
            }

            changeOccupation(eng.occupation);
        }
        else if(result.isDenied){
            ;
        }
        
        CalcTeamDevPoints(game.team);
        genTeamHTML();
    });
    
    const buttonMappings = {
        "changeTo-teamPrincipal": "Chefe de Equipe",
        "changeTo-technicalDirector": "Diretor Técnico",
        "changeTo-chiefDesigner": "Designer Chefe",
        "changeTo-chiefAerodynamicist": "Aerodinamicista Chefe",
        "changeTo-chiefEngineering": "Engenheiro Chefe"
    };
    
    for(const buttonId in buttonMappings){
        const button = document.querySelector(`#${buttonId}`);
        
        if(button){
            button.addEventListener("click", () => {
                newOccupation = buttonMappings[buttonId];
                document.querySelector("#swal2-html-container > h4").innerHTML = `<h4>${eng.occupation} -> ${newOccupation}</h4>`;
            });
        }
    }
}