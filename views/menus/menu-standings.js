import { game } from "../../scripts/game.js";
import { LOC } from "../../scripts/translation.js";
import { accentsTidy } from "../../scripts/utils.js";

export function initMenuStandings(){    
    game.championship.CreateStandings();

    document.querySelector("#menu-container").innerHTML += `
    <div class="game-menu" id="menu-standings">
        <div id="drivers-standings-container"></div>
        <div id="teams-standings-container"></div>
    </div>
    `;
}


export function updateMenuStandings(){
    game.championship.CreateStandings();

    const driverStandingsElement = document.querySelector("#drivers-standings-container");
    const teamStandingsElement = document.querySelector("#teams-standings-container");

    let html = `
    <div id="season-overview">
        <table>
            <tr>
                <th>Pos</th>
                <th>Piloto</th>
                <th>País</th>
                <th>Equipe</th>
    `;

    game.championship.tracks.forEach(circuit => {
        html += `<th><img class="country-flag" src="img/flags/${accentsTidy(game.circuits[circuit].country)}.webp"><br>${game.circuits[circuit].abbrev}</th>`;
    });
    html += "<th>Pts</th></th>";
                
    let pos = 1;
    game.championship.standings.forEach(e => {
        const team = game.drivers[e[0]].team;

        html += `
        <tr>
            <td>${pos}</td>
            <td>${e[0]}</td>
            <td><img class="country-flag" src="img/flags/${accentsTidy(game.drivers[e[0]].country)}.webp"></td> 
            <td style="background-color: ${game.teams[team].result_bg_color}; color: ${game.teams[team].result_font_color}">${team}</td>
        `;

        game.championship.tracks.forEach(track => {
            let pos = "Ret";
            
            if(game.championship.results[track]){
                for(let i = 0; i < game.championship.results[track].length; i++) {
                    if(game.championship.results[track][i] == e[0]){
                        pos = i+1;
                        pos = pos.toString();
                        break;
                    }
                }
                if(pos == "1")          html += `<td class="first-position">${pos}</td>`;
                else if(pos == "2")     html += `<td class="second-position">${pos}</td>`;
                else if(pos == "3")     html += `<td class="third-position">${pos}</td>`;
                else if(pos == "Ret")   html +=  `<td class="retired-position">${pos}</td>`;
                else if(Number(pos) <= game.championship.pointsSystem.length)    
                                        html +=  `<td class="scorer-position">${pos}</td>`;
                else                    html +=  `<td class="non-scorer-position">${pos}</td>`;
            }
            else{
                html += `<td></td>`;
            }
        });

        if(pos == 1){
            html += `<td class="first-position">${e[1]}</td>`;
        }
        else if(pos == 2){
            html += `<td class="second-position">${e[1]}</td>`;
        }
        else if(pos == 3){
            html += `<td class="third-position">${e[1]}</td>`;
        }
        else{
            html += `<td>${e[1]}</td>`;
        }

        pos++;
    });
    html += `</table></div>`;

    driverStandingsElement.innerHTML = html;

    html = `<table id="team-standings">
                <tr>
                    <th>Pos</th>
                    <th>Equipe</th>
                    <th>País</th>
                    <th>Motor</th>
                    <th>Pontos</th>
                    <th>Vitórias</th>
                    <th>Pódios</th>
                </tr>`;
                
    pos = 1;
    game.championship.teamStandings.forEach(e => {
        html += `
        <tr>
            <td>${pos++}º</td>  
            <td style="background-color: ${game.teams[e[0]].result_bg_color}; color: ${game.teams[e[0]].result_font_color}">${e[0]}</td>
            <td><img class="country-flag" src="img/flags/${accentsTidy(game.teams[e[0]].country)}.webp"></td>  
            <td>${game.teams[e[0]].engine}</td>
            <td>${e[1]}</td>
            <td>${e[2]}</td>
            <td>${e[3]}</td>
        </tr>`;
    });
    html += `</table>`;

    teamStandingsElement.innerHTML = html;
}
