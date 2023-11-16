import { NumberF, accentsTidy } from "../utils.js";
import { countryCodes } from "../data/countryCodes.js";
import { game, CalcTeamDevPoints } from "../game.js";
import { genTeamHTML } from "../app.js";
import { marketEng } from "./market.js";

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
            
            html +=
            `
                <button id="change-eng" value="${name}">Trocar de Função</button>
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
    document.querySelector("#change-eng").addEventListener("click", () => {
        changeEng(name);
    });
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
            team.financialReport["Fines"] += fine;
            team.cash -= fine;

        }
        else if(result.isDenied){
            ;
        }
        
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
            team.cash -= fine;

            console.log(game.teams[game.team])

            genTeamHTML();
            marketEng();
        }
        if(result.isDenied){
            viewEng(name,true);
        }
        
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
                    console.log(promoted)
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

            console.log(team.teamPrincipal)
            console.log(team.engineers)
/*
            const old_teamPrincipal = team.teamPrincipal;
            const old_technicalDirector = team.engineers.technicalDirector;
            const old_chiefDesigner = team.engineers.chiefDesigner;
            const old_chiefAerodynamicist = team.engineers.chiefAerodynamicist;
            const old_chiefEngineering = team.engineers.chiefEngineering;

            if(newOccupation == "Chefe de Equipe")          team.teamPrincipal = eng.name;
            if(newOccupation == "Diretor Técnico")          team.engineers.technicalDirector = eng.name;
            if(newOccupation == "Designer Chefe")           team.engineers.chiefDesigner = eng.name;
            if(newOccupation == "Aerodinamicista Chefe")    team.engineers.chiefAerodynamicist = eng.name;
            if(newOccupation == "Engenheiro Chefe")         team.engineers.chiefEngineering = eng.name;


            if(eng.occupation == "Chefe de Equipe"){ 
                changeOccupation(newOccupation,"Chefe de Equipe")

                if(newOccupation == "Chefe de Equipe"){
                    game.engineers[old_teamPrincipal].occupation = "Chefe de Equipe";
                    team.teamPrincipal = old_teamPrincipal;
                }     
                if(newOccupation == "Diretor Técnico"){
                    game.engineers[old_technicalDirector].occupation = "Chefe de Equipe";
                    team.engineers.technicalDirector = old_teamPrincipal;
                }     
                if(newOccupation == "Designer Chefe"){
                    game.engineers[old_chiefDesigner].occupation = "Chefe de Equipe";
                    team.engineers.chiefDesigner = old_teamPrincipal;
                }     
                if(newOccupation == "Aerodinamicista Chefe"){
                    game.engineers[old_chiefAerodynamicist].occupation = "Chefe de Equipe";
                    team.engineers.chiefAerodynamicist = old_teamPrincipal;
                }     
                if(newOccupation == "Engenheiro Chefe"){
                    game.engineers[old_chiefEngineering].occupation = "Chefe de Equipe";
                    team.engineers.chiefEngineering = old_teamPrincipal;
                }
            }        
            if(eng.occupation == "Diretor Técnico"){ 

            } 
            if(eng.occupation == "Designer Chefe"){ 

            } 
            if(eng.occupation == "Aerodinamicista Chefe"){ 

            } 
            if(eng.occupation == "Engenheiro Chefe"){ 

            } */
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