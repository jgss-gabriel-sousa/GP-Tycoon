import { blankSpaceRmv, accentsTidy, numberF, setBarProgress } from "./utils.js"
import { game } from "./game.js"
import { circuitsData } from "./data/circuits.js";
import { enginesData } from "./data/enginesData.js";

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
    driver.forEach(e => {
        html += `
        <div class="driver-card bars-table" id="first-driver-card">`
            if(i == 0)
                html += "<h1>1º Piloto</h1>"
            if(i == 1)
                html += "<h1>2º Piloto</h1>"
            if(i == 2)
                html += "<h1>Piloto de Testes</h1>"
        html += `
            <img class="driver-card-portrait" src="img/drivers/${e.name}.webp" onerror="this.src='img/drivers/generic.webp';">
            <button class="btn-driver-name view-driver" value="${e.name}">
                <img class="country-flag" src="img/flags/${accentsTidy(e.country)}.webp"> ${e.name}
            </button>
        `
        
        html += `
            <table>
                <tr>
                    <td>Velocidade:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${e.speed}%;"><span>${e.speed}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Ritmo:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${e.pace}%;"><span>${e.pace}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Experiência:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${e.experience}%;"><span>${e.experience}%</span></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Motivação:</td>
                    <td>
                        <div class="progress-bar-background">
                            <div class="progress-bar" style="width:${e.motivation}%;"><span>${e.motivation}%</span></div>
                        </div>
                    </td>
                </tr>
            </table>
            <br>
        `
        
        if(e.salary > 1){
            html += `<p>Salário: ${e.salary}M por Corrida</p>`
        }
        else{
            html += `<p>Salário: ${Math.floor(e.salary*1000)}K por Corrida</p>`
        }
        
        if(i < 2){
            let pos;
            let pts;
            for(const k in game.championship.standings) {
                if(game.championship.standings[k][0] == e.name){
                    pos = Number(k)+1;
                    pts = game.championship.standings[k][1];
                }
            }
    
            html += `
            <br>
            <p>${pos}º Lugar - ${pts} Pts</p>
            `
        }

        html += "</div>"
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
        <tr>
            <td>Curvas:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${car.corners}%;"><span>${car.corners}%</span></div>
                </div>
            </td>
        </tr>
        <tr>
            <td>Retas:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${car.straights}%;"><span>${car.straights}%</span></div>
                </div>
            </td>
        </tr>
        <tr><td><span>&shy;</span></td></tr>
        <tr>
            <td>Confiabilidade:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar"style="width:${car.reliability}%;"><span>${car.reliability}%</span></div>
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
            <td>Arrasto:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${car.drag}%;"><span>${car.drag}%</span></div>
                </div>
            </td>
        </tr>
        <tr>
            <td>Câmbio:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${car.gearbox}%;"><span>${car.gearbox}%</span></div>
                </div>
            </td>
        </tr>
        <tr>
            <td>Downforce:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${car.downforce}%;"><span>${car.downforce}%</span></div>
                </div>
            </td>
        </tr>
        <tr>
            <td>Peso:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${car.weight}%;"><span>${car.weight}%</span></div>
                </div>
            </td>
        </tr>
        <tr><td><span>&shy;</span></td></tr>
        <tr>
            <td>Confiabilidade:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar"style="width:${car.chassisReliability}%;"><span>${car.chassisReliability}%</span></div>
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
                    <div class="progress-bar" style="width:${engine.power}%;"><span>${engine.power}%</span></div>
                </div>
            </td>
        </tr>
        <tr>
            <td>Torque:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar" style="width:${engine.torque}%;"><span>${engine.torque}%</span></div>
                </div>
            </td>
        </tr>
        <tr><td><span>&shy;</span></td></tr>
        <tr>
            <td>Confiabilidade:</td>
            <td>
                <div class="progress-bar-background">
                    <div class="progress-bar"style="width:${engine.reliability}%;"><span>${engine.reliability}%</span></div>
                </div>
            </td>
        </tr>
    </table>
    `
    elEngine.innerHTML = html;
}

export function genTeamHTML(){
    game.championship.createStandings();
    genDriversHTML();
    genCarHTML();

    const teams = game.teams;

    if(game.uiTeamColors){
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

    document.querySelector("#year").innerText = `${game.championship.year}`;
    document.querySelector("#name").innerHTML = `<img class="country-flag" src="img/flags/${accentsTidy(teams[game.team].country)}.webp"> ${game.team}`;
    document.querySelector("#money").innerHTML = `<p><img id="money-icon" class="icon" src="img/money_icon.png" alt="Money Icon"> ${numberF(teams[game.team].cash*1000,"extended")}</p>`;;

    setBarProgress(teams[game.team].boardTrust,"#board-bar");
    setBarProgress(teams[game.team].fansTrust,"#fans-bar");

    if(game.championship.actualRound <= game.championship.tracks.length){
        const nextRace = game.championship.tracks[game.championship.actualRound-1];

        document.querySelector("#next-race-name").innerHTML = `<img class="country-flag" src="img/flags/${accentsTidy(circuitsData[nextRace].country)}.webp">`+nextRace;
    }
    else{
        document.querySelector("#next-race-name").innerHTML = `Resumo da Temporada`;
    }
};


function mainMenu(){
    document.querySelector("#main-menu").style.display = "flex";
}