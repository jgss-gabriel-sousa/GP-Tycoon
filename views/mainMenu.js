import { blankSpaceRmv, accentsTidy, NumberF } from "../scripts/utils.js"
import { game } from "../scripts/game.js"
import { UpdateDataInfo } from "../scripts/ui.js";
import { tooltips } from "../scripts/tooltips.js";
import { display } from "../scripts/display.js";
import { CreateStandings } from "../scripts/championship/create-standings.js";
import { LOC } from "../scripts/translation.js";
import { updateGameScreens } from "./gameMenus.js";


export function genEngHTML(){
    const el = document.querySelector("#engineering");
    let html = "";

    const team = game.teams[game.team];
    const eng = game.engineers;
    const newCar = team.newCar;

    html = `
    <div>
        <h1>Engenheiros</h1>
        <table id="engineers-name">
            <tr>
                <th>Chefe de Equipe:</th>`

    if(team.teamPrincipal != ""){
    html += `
                <td>
                    <button class="btn-eng-name view-eng" value="${team.teamPrincipal}">
                        ${team.teamPrincipal}
                    </button>
                </td>
            </tr>`
    }
    else{
        html += `
            <td>
                <button class="market-eng">
                    Contratar
                </button>
            </td>`
    }

    const engIDS = ["technicalDirector","chiefDesigner","chiefAerodynamicist","chiefEngineering"];
    const engIDSTexts = ["Diretor Técnico","Designer Chefe","Aerodinamicista Chefe","Engenheiro Chefe"];
    for(const k in engIDS) {
        const id = engIDS[k];

        html += `
        <tr>
            <th>${engIDSTexts[k]}:</th>`

        if(team.engineers[id] != ""){
            html += `
                <td>
                    <button class="btn-eng-name view-eng" value="${team.engineers[id]}">
                        ${team.engineers[id]}
                    </button>
                </td>`
        }
        else{
            html += `
                <td>
                    <button class="market-eng">
                        Contratar
                    </button>
                </td>`
        }

        html += "</tr>"
    }

    html += `
            <tr>
                <th>Empregados:</th>
                <td>
                    <button class="btn-eng-name view-employees" value="${team.name}">
                        ${NumberF(team.employees,"",0)}
                    </button>
                </td>
            </tr>
            <tr>
                <th>Moral da Equipe:</th>
                <td>
                    <div class="progress-bar-background">
                        <div class="progress-bar" style="width:${Math.round(team.teamMorale)}%;"><span>${Math.round(team.teamMorale)}%</span></div>
                    </div>
                </td>
            </tr>
        </table>
        
        <div id="dev-pts">
            <div>
                <h2 id="aero-pts-value">${team.aeroPts}</h2>
                <h2>Aero</h2>
            </div>
            <div>
                <h2 id="eng-pts-value">${team.engPts}</h2>
                <h2>Eng</h2>
            </div>
        </div>

        <table id="new-car">
            <th colspan="2">Novo Carro</th>
            <tr>
                <td>Aerodinâmica:</td>
                <td>
                    <div class="progress-bar-background">
                        <div class="progress-bar" style="width:${Math.round(newCar.aerodynamic)}%;"><span>${Math.round(newCar.aerodynamic)}%</span></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>Downforce:</td>
                <td>
                    <div class="progress-bar-background">
                        <div class="progress-bar" style="width:${Math.round(newCar.downforce)}%;"><span>${Math.round(newCar.downforce)}%</span></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>Peso:</td>
                <td>
                    <div class="progress-bar-background">
                        <div class="progress-bar" style="width:${Math.round(newCar.weight)}%;"><span>${Math.round(newCar.weight)}%</span></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>Confiabilidade:</td>
                <td>
                    <div class="progress-bar-background">
                        <div class="progress-bar"style="width:${Math.round(newCar.chassisReliability)}%;"><span>${Math.round(newCar.chassisReliability)}%</span></div>
                    </div>
                </td>
            </tr>
            <tr><td><span>&shy;</span></td></tr>
            <tr>
                <td>Motor Prox. Temp.:</td>`
                
                if((team.engineContract >= 1 || team.newEngine) && team.newEngine){
                    html += `<td>${team.newEngine} (${team.newEngineContract})</td>`
                }
                else if(team.engineContract >= 1){
                    html += `<td>${team.engine} (${team.engineContract})</td>`
                }
                else if(team.engineContract < 0){
                    html += `<td>${team.engine}</td>`
                }
                else{
                    html += `<td><button class="select-engine">Negociar</button></td>`
                }
                html += `
            </tr>
        </table>
    </div>`;
    el.innerHTML = html;
}

export function genTeamMainMenu(){
    game.championship["CreateStandings"] = CreateStandings;
    //genEngHTML();

    while(game.news.length > 99){
        game.news.pop();
    }
    let newNews = 0;
    game.news.forEach(e => {
        if(!e.viewed)
            newNews++;
    });
    //document.querySelector("#btn-news span").innerHTML = newNews;

    if(newNews == 0){
        //document.querySelector("#btn-news span").classList.add("no-news");
    }
    else{
        //document.querySelector("#btn-news span").classList.remove("no-news");
    }

    for(let i = 0; i < document.querySelectorAll(".slider").length; i++){
        const el = document.querySelectorAll(".slider")[i];
        
        el.addEventListener("input", () => {
            UpdateDataInfo(el.id);
        });
    }
};