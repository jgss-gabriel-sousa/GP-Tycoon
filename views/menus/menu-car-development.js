import { game } from "../../scripts/game.js";
import { NumberF } from "../../scripts/utils.js";

export function initMenuCarDevelopment(){
    document.querySelector("#menu-container").innerHTML += `
    <div class="game-menu" id="menu-car-development">
        <div id="car" class="bars-table">
            <div id="car-info"></div>
            <div id="chassis"></div>
            <div id="engine"></div>
        </div>
        <div id="engineering" class="bars-table"></div>
        <div id="development" class="bars-table"></div>
    </div>
    `
}


export function updateMenuCarDevelopment(){
    genDevelopmentHTML();
    genCarHTML();
}


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
    
    const engine = game.engines[game.teams[game.team].engine];
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


function genDevelopmentHTML(){
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
                <td class="total-investments">Próxima Corrida: </td>
                <th id="race-total-investment">${NumberF((team.investments.aerodynamics+team.investments.downforce+team.investments.weight+team.investments.reliability) *1000,"ext-short",0)}</th>
            </tr>
            <tr>
                <th class="total-investments">Total de Gastos da Temporada: </th>
                <th id="total-investment">${NumberF(team.totalInvestments *1000,"ext-short",0)}</th>
            </tr>
            `
    
    if(game.championship.budgetCap > 0){
        const totalRaces = game.championship.tracks.length;
        const pastRaces = game.championship.actualRound - 1;
        const budgetPrediction = (team.totalInvestments/pastRaces)*totalRaces;

        html += `
            <tr>
                <th class="total-investments">Previsão de Total de Gastos: </th>
                <th id="budget-prediction">${NumberF((budgetPrediction == null ?? budgetPrediction | 0) *1000,"ext-short",0)}</th>
            </tr>
            <tr>
                <th class="total-investments">Restante para o Teto: </th>
                <th id="budget-remaining">${NumberF((game.championship.budgetCap-team.totalInvestments) *1000,"ext-short",0)}</th>
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