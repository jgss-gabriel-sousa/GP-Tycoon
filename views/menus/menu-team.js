import { game } from "../../scripts/game.js";
import { LOC } from "../../scripts/translation.js";
import { accentsTidy } from "../../scripts/utils.js";

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
}


function genDriversHTML(){
    const el = document.querySelector("#drivers");
    let html = "";

    const team = game.teams[game.team];
    const driver = [
        game.drivers[team.driver1],
        game.drivers[team.driver2],
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
        <div class="driver-card">`
            if(i == 0)
                html += `<h1>${LOC("1st_driver")}</h1>`
            if(i == 1)
                html += `<h1>${LOC("2nd_driver")}</h1>`
            if(i == 2)
                html += `<h1>${LOC("test_driver")}</h1>`
        html += `
            <img class="driver-card-portrait" src="img/drivers/${d.image}.webp" onerror="this.onerror=null;this.src='img/drivers/generic.webp';">
            <button class="btn-driver-name view-driver" value="${d.name}">
                <img class="country-flag" src="img/flags/${accentsTidy(d.country)}.webp"> ${d.name}
            </button>
        `
        
        html += `
            <table class="bars-table">
                <tr>
                    <td>${LOC("speed")}:</td>
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
                    <td>Constância:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${d.constancy}%;"><span>${d.constancy}%</span></div>
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
        
        if(d.contractRemainingYears == 0 && d.newTeam == ""){
            html += `<p>Contrato encerrando</p>`
        }

        html += `</div>`
        i++;
    });

    const testDriver = game.drivers[team.test_driver];
    const ability = Math.round((testDriver.speed + testDriver.pace)/2);
    let careerStage;
        if(testDriver.age < testDriver.careerPeak-1 && testDriver.experience < 5){
            careerStage = "Novato";
        }
        else if(testDriver.age < testDriver.careerPeak-1){
            careerStage = "Em Ascensão";
        }
        else if(testDriver.age > testDriver.careerPeak-1 && testDriver.age < testDriver.careerPeak+2){
            careerStage = "Ápice";
        }
        else{
            careerStage = "Veterano";
        }

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
                        <div class="progress-bar" style="width:${ability}%;"><span>${ability}%</span></div>
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
                <td>Condição: </td>
                <td class="no-border">
                    ${careerStage}
                </td>
            </tr>
        </table>
    </div>
    <div id="academy-drivers">
        <h1>Academia de Pilotos</h1>
    `
    
    team.driversAcademy.forEach(d => {
        const driver = game.drivers[d];

        html += `
        <button class="btn-driver-name view-driver" value="${driver.name}">
                <img class="country-flag" src="img/flags/${accentsTidy(driver.country)}.webp"> ${driver.name}
        </button>
        `
    });
    

    html += `
    </div>
    </div>
    `
    
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