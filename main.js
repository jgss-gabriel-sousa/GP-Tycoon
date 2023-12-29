import { blankSpaceRmv, accentsTidy, NumberF } from "./utils.js"
import { game } from "./game.js"
import { circuitsData } from "./data/circuits.js";
import { enginesData } from "./data/enginesData.js";
import { UpdateDataInfo } from "./ui.js";
import { tooltips } from "./tooltips.js";

function genDriversHTML(){
    const el = document.querySelector("#drivers");
    let html = "";

    const team = game.teams[game.team];
    const driver = [
        game.drivers[team.driver1],
        game.drivers[team.driver2], 
        game.drivers[team.test_driver]
    ];

    let i = 0;
    driver.forEach(d => {

        let careerStage;
        if(d.age < d.careerPeak-1 && d.experience < 5){
            careerStage = "Estreante";
        }
        else if(d.age < d.careerPeak-1){
            careerStage = "Em Ascensão";
        }
        else if(d.age > d.careerPeak-1 && d.age < d.careerPeak+2){
            careerStage = "Ápice";
        }
        else{
            careerStage = "Veterano";
        }

        html += `
        <div class="driver-card" id="first-driver-card">`
            if(i == 0)
                html += "<h1>1º Piloto</h1>"
            if(i == 1)
                html += "<h1>2º Piloto</h1>"
            if(i == 2)
                html += "<h1>Piloto de Testes</h1>"
        html += `
            <img class="driver-card-portrait" src="img/drivers/${d.image}.webp" onerror="this.onerror=null;this.src='img/drivers/generic.webp';">
            <button class="btn-driver-name view-driver" value="${d.name}">
                <img class="country-flag" src="img/flags/${accentsTidy(d.country)}.webp"> ${d.name}
            </button>
        `
        
        html += `
            <table class="bars-table">
                <tr>
                    <td>Velocidade:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${d.speed}%;"><span>${d.speed}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Ritmo:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${d.pace}%;"><span>${d.pace}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Experiência:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${d.experience}%;"><span>${d.experience}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Condição: </td>
                    <td class="no-border">
                        ${careerStage}
                    </td>
                </tr>
            </table>
            `
        
        if(d.contractRemainingYears == 0){
            html += `<p>Contrato encerrando</p>`
        }

        html += `</div>`
        i++;
    });
    
    el.innerHTML = html;
};

function genCarHTML(){
    const elCarInfo = document.querySelector("#car-info");
    const elChassis = document.querySelector("#chassis");
    const elEngine = document.querySelector("#engine");
    let html = "";

    const team = game.teams[game.team];
    const car = team.car;

    html = `
    <table>
        <h1>Carro</h1>
        
        <tr>
            <td>Curvas:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${Math.round(car.corners)}%;"><span>${Math.round(car.corners)}%</span></div>
                </div>
            </td>
        </tr>
        <tr>
            <td>Retas:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${Math.round(car.straights)}%;"><span>${Math.round(car.straights)}%</span></div>
                </div>
            </td>
        </tr>
        <tr><td><span>&shy;</span></td></tr>
        <tr>
            <td>Confiabilidade:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar"style="width:${Math.round(car.reliability)}%;"><span>${Math.round(car.reliability)}%</span></div>
                </div>
            </td>
        </tr>
    </table>
    `
    elCarInfo.innerHTML = html;

    html = `
    <h1>Chassis</h1>
    <table>
        <tr>
            <td>Aerodinâmica:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${Math.round(car.aerodynamic)}%;"><span>${Math.round(car.aerodynamic)}%</span></div>
                </div>
            </td>
        </tr>
        <tr>
            <td>Downforce:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${Math.round(car.downforce)}%;"><span>${Math.round(car.downforce)}%</span></div>
                </div>
            </td>
        </tr>
        <tr>
            <td>Peso:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${Math.round(car.weight)}%;"><span>${Math.round(car.weight)}%</span></div>
                </div>
            </td>
        </tr>
        <tr><td><span>&shy;</span></td></tr>
        <tr>
            <td>Confiabilidade:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar"style="width:${Math.round(car.chassisReliability)}%;"><span>${Math.round(car.chassisReliability)}%</span></div>
                </div>
            </td>
        </tr>
    </table>
    `
    elChassis.innerHTML = html;
    
    const engine = enginesData[game.teams[game.team].engine];
    html = `
    <h1>Motor</h1>
    <table>
        <h2>${game.teams[game.team].engine}</h2>
        <tr>
            <td>Potência:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${Math.round(engine.power)}%;"><span>${Math.round(engine.power)}%</span></div>
                </div>
            </td>
        </tr>
        <tr>
            <td>Dirigibilidade:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${Math.round(engine.drivability)}%;"><span>${Math.round(engine.drivability)}%</span></div>
                </div>
            </td>
        </tr>
        <tr><td><span>&shy;</span></td></tr>
        <tr>
            <td>Confiabilidade:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar"style="width:${Math.round(engine.reliability)}%;"><span>${Math.round(engine.reliability)}%</span></div>
                </div>
            </td>
        </tr>
    </table>
    `
    elEngine.innerHTML = html;
}

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

export function genTeamHTML(){
    game.championship.createStandings();
    genDriversHTML();
    genCarHTML();
    genEngHTML();
    genDevelopmentHTML();

    const teams = game.teams;

    if(localStorage.getItem("gpTycoon-ui-team-colors") == "true" ?? true){
        document.querySelector(":root").style.setProperty("--bg", teams[game.team].bg_color);
        document.querySelector(":root").style.setProperty("--border", teams[game.team].border_color);
        document.querySelector(":root").style.setProperty("--text", teams[game.team].font_color);
        document.querySelector(":root").style.setProperty("--titles", teams[game.team].titles_color);
    }
    else{
        document.querySelector(":root").style.setProperty("--bg", "#afafaf");
        document.querySelector(":root").style.setProperty("--border", "#222");
        document.querySelector(":root").style.setProperty("--text", "#000");
        document.querySelector(":root").style.setProperty("--titles", "#f0f0f0");
    }

    document.querySelector("#team-logo").src = "./img/teams/"+game.team+".png";

    document.querySelector("#year").innerText = `${game.year}`;
    document.querySelector("#name").innerHTML = `<img class="country-flag" src="img/flags/${accentsTidy(teams[game.team].country)}.webp"> ${game.team}`;
    document.querySelector("#money").innerHTML = `<p><img id="money-icon" class="icon" src="img/ui/money.png"> ${NumberF(teams[game.team].cash * 1000,"ext",0)}</p>`;
    
    let reputationHTML = "<div>"
    let remainingStars = teams[game.team].reputation;
    for(let i = 0; i < 5; i++) {
        if(remainingStars-- > 0){
            reputationHTML += `<span><i class="lni lni-star-fill"></i></span>`;
        }
        else{
            reputationHTML += `<span><i class="lni lni-star-empty"></i></span>`;
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
    document.querySelector("#btn-news span").innerHTML = newNews;

    if(newNews == 0){
        document.querySelector("#btn-news span").classList.add("no-news");
    }
    else{
        document.querySelector("#btn-news span").classList.remove("no-news");
    }


    if(game.championship.actualRound <= game.championship.tracks.length){
        const nextRace = game.championship.tracks[game.championship.actualRound-1];
        let trackStyle;

        if(circuitsData[nextRace].straights > 60) trackStyle = "Retas";
        else if(circuitsData[nextRace].straights < 40) trackStyle = "Curvas";
        else trackStyle = "Equilibrado";

        document.querySelector("#next-race-name").innerHTML = `
        <h2><img class="country-flag" src="img/flags/${accentsTidy(circuitsData[nextRace].country)}.webp">GP ${nextRace}</h2>
        <h2>${circuitsData[nextRace].circuit}</h2><small>${trackStyle}</small>`;
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

    tooltips();
};

function mainMenu(){
    document.querySelector("#main-menu").style.display = "flex";
}