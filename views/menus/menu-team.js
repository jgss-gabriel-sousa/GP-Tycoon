import { game } from "../../scripts/game.js";
import { LOC } from "../../scripts/translation.js";
import { UpdateDataInfo } from "../../scripts/ui.js";
import { accentsTidy, NumberF } from "../../scripts/utils.js";

export function initMenuTeam(){
    document.querySelector("#menu-container").innerHTML += `
    <div class="game-menu" id="menu-team">
        <div id="sidebar-infos">

            <div id="info">    
                <h1 id="year"></h1>
                <div id="team">
                    <div>
                        <img id="team-logo" class="logo" alt="Team Logo">
                        <h1 id="name"></h1>
                    </div>
                    <div id="reputation" class="no-select"></div>
                    <div id="money" class="view-financial-report no-select"></div>
                    <div id="supporters" class="no-select"><p></p></div>
                </div>
                <div id="next-race">
                    <h1>Próxima Corrida</h1>
                    <div id="next-race-name"></div>
                    <button id="btn-play"><span>Continuar</span></button>
                </div>
            </div>
        </div>

        <div id="team-details">
            <div id="drivers-section">
                <div id="drivers"></div>
                <div id="car" class="bars-table">
                    <div id="car-info"></div>
                    <div id="chassis"></div>
                    <div id="engine"></div>
                </div>
            </div>
        </div>

        
        <div id="menu-buttons">
            <button id="btn-save-game"><img src="./img/ui/save.png"> Salvar Jogo</button>
            <button id="btn-options"><img src="./img/ui/settings.png"> Opções</button>
        </div>
    </div>
    `
}


export function updateMenuTeam(){
    genDriversHTML();
    genCarHTML();

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
}


function genDriversHTML() {
    const el = document.querySelector("#drivers");
    const team = game.teams[game.team];
    let html = "";

    const getCareerStage = (driver) => {
        if (driver.age < driver.careerPeak - 1 && driver.experience < 5) return "Novato";
        if (driver.age < driver.careerPeak - 1) return "Em Ascensão";
        if (driver.age <= driver.careerPeak + 1) return "Ápice";
        return "Veterano";
    };

    const renderDriverSectionTitle = (index) => {
        switch (index) {
            case 0: return LOC("1st_driver");
            case 1: return LOC("2nd_driver");
            case 2: return LOC("test_driver");
            default: return "";
        }
    };

    const renderStatsTable = (driver, extraRow = "") => {
        return `
            <table class="bars-table">
                <tr>
                    <td>${LOC("speed")}:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${driver.speed}%;"><span>${driver.speed}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Ritmo:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${driver.pace}%;"><span>${driver.pace}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Constância:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${driver.constancy}%;"><span>${driver.constancy}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Experiência:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${driver.experience}%;"><span>${driver.experience}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Condição:</td>
                    <td class="no-border">${getCareerStage(driver)}</td>
                </tr>
                ${extraRow}
            </table>
        `;
    };

    const renderDriverCard = (driver, index) => {
        return `
        <div class="driver-card">
            <h1>${renderDriverSectionTitle(index)}</h1>
            <img class="driver-card-portrait" src="img/drivers/${driver.image}.webp" onerror="this.onerror=null;this.src='img/drivers/generic.webp';">
            <button class="btn-driver-name view-driver" value="${driver.name}">
                <img class="country-flag" src="img/flags/${accentsTidy(driver.country)}.webp"> ${driver.name}
            </button>
            ${renderStatsTable(driver)}
            ${driver.contractRemainingYears === 0 && driver.newTeam === "" ? "<p>Contrato encerrando</p>" : ""}
        </div>`;
    };

    // Pilotos principais
    [team.driver1, team.driver2].forEach((id, index) => {
        const driver = game.drivers[id];
        html += renderDriverCard(driver, index);
    });

    // Piloto de testes
    const testDriver = game.drivers[team.test_driver];
    const testAbility = Math.round((testDriver.speed + testDriver.pace) / 2);

    html += `
    <div class="driver-card">
        <div id="test-driver">
            <h1>Piloto de Testes</h1>
            <button class="btn-driver-name view-driver" value="${testDriver.name}">
                <img class="country-flag" src="img/flags/${accentsTidy(testDriver.country)}.webp"> ${testDriver.name}
            </button>
            <table class="bars-table">
                <tr>
                    <td>Hab. Média:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${testAbility}%;"><span>${testAbility}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Constância:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${testDriver.constancy}%;"><span>${testDriver.constancy}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Experiência:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${testDriver.experience}%;"><span>${testDriver.experience}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Condição:</td>
                    <td class="no-border">${getCareerStage(testDriver)}</td>
                </tr>
            </table>
        </div>
    `;

    // Academia de pilotos
    html += `<div id="academy-drivers"><h1>Academia de Pilotos</h1>`;
    team.driversAcademy.forEach(id => {
        const driver = game.drivers[id];
        html += `
            <button class="btn-driver-name view-driver" value="${driver.name}">
                <img class="country-flag" src="img/flags/${accentsTidy(driver.country)}.webp"> ${driver.name}
            </button>
        `;
    });
    html += `</div></div>`;

    el.innerHTML = html;
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