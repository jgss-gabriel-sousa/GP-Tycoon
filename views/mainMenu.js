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


export function genDevelopmentHTML(){
    const el = document.querySelector("#development");
    let html = "";

    const team = game.teams[game.team];
    const eng = game.engineers;

    html = `
    <div>
        <h1>Desenvolvimento</h1>
        <table>
            <tr><th colspan="2">Foco de Desenvolvimento</th></tr>
            <tr>
                <td colspan="2">Temporada Atual</td>
            </tr>
            <tr class="slidercontainer">
                <td><input id="slider-dev-focus-actual-season" class="slider" type="range" min="30" value="${team.devFocusActualSeason}" step="5" max="70"></td>
                <td id="dev-focus-actual">${team.devFocusActualSeason}%</td>
            </tr>

            <tr>
                <td colspan="2">Próxima Temporada</td>
            </tr>
            <tr class="slidercontainer">
                <td><input id="slider-dev-focus-next-season" class="slider" type="range" min="30" value="${team.devFocusNextSeason}" step="5" max="70"></td>
                <td id="dev-focus-next">${team.devFocusNextSeason}%</td>
            </tr>
        </table>

        <table id="investments">
            <tr><th colspan="2">Investimentos</th></tr>
            <tr>
                <td colspan="2">Aerodinâmica</td>
            </tr>
            <tr class="slidercontainer">
                <td><input id="slider-investment-aerodynamics" class="slider" type="range" min="500" value="${team.investments.aerodynamics}" step="250" max="5000"></td>
                <td id="investment-aerodynamics">${NumberF(team.investments.aerodynamics *1000,"ext-short",0)}</td>
            </tr>

            <tr>
                <td colspan="2">Downforce</td>
            </tr>
            <tr class="slidercontainer">
                <td><input id="slider-investment-downforce" class="slider" type="range" min="500" value="${team.investments.downforce}" step="250" max="5000"></td>
                <td id="investment-downforce">${NumberF(team.investments.downforce *1000,"ext-short",0)}</td>
            </tr>

            <tr>
                <td colspan="2">Peso</td>
            </tr>
            <tr class="slidercontainer">
                <td><input id="slider-investment-weight" class="slider" type="range" min="500" value="${team.investments.weight}" step="250" max="5000"></td>
                <td id="investment-weight">${NumberF(team.investments.weight *1000,"ext-short",0)}</td>
            </tr>

            <tr>
                <td colspan="2">Confiabilidade</td>
            </tr>
            <tr class="slidercontainer">
                <td><input id="slider-investment-reliability" class="slider" type="range" min="500" value="${team.investments.reliability}" step="250" max="5000"></td>
                <td id="investment-reliability">${NumberF(team.investments.reliability *1000,"ext-short",0)}</td>
            </tr>
            <tr>
                <td class="total-investments">Total da Próxima Corrida: </td>
                <th id="race-total-investment">${NumberF((team.investments.aerodynamics+team.investments.downforce+team.investments.weight+team.investments.reliability) *1000,"ext-short",0)}</th>
            </tr>
            <tr>
                <th class="total-investments">Total da Temporada: </th>
                <th id="total-investment">${NumberF(team.totalInvestments *1000,"ext-short",0)}</th>
            </tr>
            `
    
    if(game.championship.budgetCap > 0){
        html += `
            <tr>
                <th class="total-investments">Restante para o Teto: </th>
                <th id="total-investment">${NumberF((game.championship.budgetCap-team.totalInvestments) *1000,"ext-short",0)}</th>
            </tr>
            <tr>
                <th class="total-investments">Teto de Gastos: </th>
                <th id="budget-cap">${NumberF(game.championship.budgetCap *1000,"ext-short",0)}</th>
            </tr>
            `
    }
        
    html += `
        </table>
    </div>`;
    el.innerHTML = html;
}

export function genTeamMainMenu(){
    game.championship["CreateStandings"] = CreateStandings;
    //genEngHTML();
    //genDevelopmentHTML();

    const teams = game.teams;
    const team = teams[game.team];

    document.querySelector("#team-logo").src = "./img/teams/"+game.team+".png";

    document.querySelector("#year").innerText = `${game.year}`;
    document.querySelector("#name").innerHTML = `<img class="country-flag" src="img/flags/${accentsTidy(team.country)}.webp"> ${game.team}`;
    document.querySelector("#money").innerHTML = `<p><img class="icon" src="img/ui/money.png"> ${NumberF(team.cash * 1000,"ext",0)}</p>`;
    document.querySelector("#supporters").innerHTML = `<p><img class="icon" src="img/ui/supporters.png"> ${NumberF(team.supporters * 1000000,"ext-short",0)}</p>`;
    
    let reputationHTML = "<div>"
    let remainingStars = team.reputation;
    for(let i = 0; i < 5; i++, remainingStars -= 1) {
        if(remainingStars > 0 && remainingStars >= 1){
            reputationHTML += `<span><iconify-icon icon="fa:star"></iconify-icon></span>`;
        }
        else if(remainingStars == 0.5){
            reputationHTML += `<span><iconify-icon icon="fa:star-half-empty"></iconify-icon></span>`;
        }
        else{
            reputationHTML += `<span><iconify-icon icon="fa:star-o"></iconify-icon></span>`;
        }
    }
    reputationHTML += "</div>"
    document.querySelector("#reputation").innerHTML = reputationHTML;

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


    if(game.championship.actualRound <= game.championship.tracks.length){
        const nextRace = game.championship.tracks[game.championship.actualRound-1];
        let trackStyle;

        if(game.circuits[nextRace].straights > 60) trackStyle = "Retas";
        else if(game.circuits[nextRace].straights < 40) trackStyle = "Curvas";
        else trackStyle = "Equilibrado";

        document.querySelector("#next-race-name").innerHTML = `
        <h2><img class="country-flag" src="img/flags/${accentsTidy(game.circuits[nextRace].country)}.webp">GP ${nextRace}</h2>
        <img id="next-race-track-img" src="img/ui/tracks/${game.circuits[nextRace].circuit.toLowerCase()}.png" width="70px">
        <h2>${game.circuits[nextRace].circuit}</h2><small>${trackStyle}</small>`;
    }
    else{
        document.querySelector("#next-race-name").innerHTML = `Resumo da Temporada`;
    }
    
    for(let i = 0; i < document.querySelectorAll(".slider").length; i++){
        const el = document.querySelectorAll(".slider")[i];
        
        el.addEventListener("input", () => {
            UpdateDataInfo(el.id);
        });
    }
};