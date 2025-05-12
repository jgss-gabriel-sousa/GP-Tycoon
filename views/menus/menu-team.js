import { game } from "../../scripts/game.js";
import { LOC } from "../../scripts/translation.js";
import { starsRating, UpdateDataInfo } from "../../scripts/ui.js";
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
            </div>
            <div id="next-race">
                <h1>Próxima Corrida</h1>
                <div id="next-race-name"></div>
                <button id="btn-play"><span>Continuar</span></button>
            </div>
        </div>

        <div id="drivers-section">
            <div id="principal-drivers"></div>
            <div id="secundary-drivers">
                <div id="test-drivers-container"></div>
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
    genPrincipalDriversHTML();
    genSecondaryDriversHTML();
    //genCarHTML();
    genTeamInfosHTML();
    genNextRaceHTML();
}


function genNextRaceHTML(){
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


function genTeamInfosHTML(){
    const teams = game.teams;
    const team = teams[game.team];

    document.querySelector("#team-logo").src = "./img/teams/"+game.team+".png";

    document.querySelector("#year").innerText = `${game.year}`;
    document.querySelector("#name").innerHTML = `<img class="country-flag" src="img/flags/${accentsTidy(team.country)}.webp"> ${game.team}`;
    document.querySelector("#money").innerHTML = `<p><img class="icon" src="img/ui/money.png"> ${NumberF(team.cash * 1000,"ext",0)}</p>`;
    document.querySelector("#supporters").innerHTML = `<p><img class="icon" src="img/ui/supporters.png"> ${NumberF(team.supporters * 1000000,"ext-short",0)}</p>`;
    document.querySelector("#reputation").innerHTML = starsRating(team.reputation);
}


function genPrincipalDriversHTML() {
    const el = document.querySelector("#principal-drivers");
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
    
    el.innerHTML = html;
}


function genSecondaryDriversHTML() {
    const el = document.querySelector("#test-drivers-container");
    const team = game.teams[game.team];
    let html = "";

    const getCareerStage = (driver) => {
        if (driver.age < driver.careerPeak - 1 && driver.experience < 5) return "Novato";
        if (driver.age < driver.careerPeak - 1) return "Em Ascensão";
        if (driver.age <= driver.careerPeak + 1) return "Ápice";
        return "Veterano";
    };

    // Piloto de testes
    const testDriver = game.drivers[team.test_driver];
    const testAbility = Math.round((testDriver.speed + testDriver.pace) / 2);

    html += `
        <div id="test-driver" class="driver-card">
            <h1>${LOC("test_driver")}</h1>
            <img class="driver-card-portrait" src="img/drivers/${testDriver.image}.webp" onerror="this.onerror=null;this.src='img/drivers/generic.webp';">
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
    html += `<div id="academy-drivers" class="driver-card"><h1>Academia de Pilotos</h1>`;
    team.driversAcademy.forEach(id => {
        const driver = game.drivers[id];
        html += `
            <button class="btn-driver-name view-driver" value="${driver.name}">
                <img class="country-flag" src="img/flags/${accentsTidy(driver.country)}.webp"> ${driver.name}
            </button>
        `;
    });
    html += `</div>`;

    el.innerHTML = html;
}

