import { game } from "./game.js"
import { circuitsData } from "./data/circuits.js"
import { gameOptions } from "./ui/gameOptions.js"
import { accentsTidy, NumberF } from "./utils.js"
import { genEngHTML } from "./app.js"

export function gameOptionsUI(){
    gameOptions();
}

export function UpdateDataInfo(e){
    const team = game.teams[game.team];

    if(e == "slider-dev-focus-actual-season"){
        team.devFocusActualSeason = document.getElementById("slider-dev-focus-actual-season").value;
        
        let nextValue = (100-team.devFocusActualSeason);

        team.devFocusNextSeason = nextValue;

        document.querySelector("#slider-dev-focus-actual-season").value = team.devFocusActualSeason;
        document.querySelector("#dev-focus-actual").innerHTML = team.devFocusActualSeason+"%";

        document.querySelector("#slider-dev-focus-next-season").value = nextValue;
        document.querySelector("#dev-focus-next").innerHTML = nextValue+"%";
    }
    if(e == "slider-dev-focus-next-season"){
        team.devFocusNextSeason = document.getElementById("slider-dev-focus-next-season").value;
        
        let actualValue = (100-team.devFocusNextSeason);
        
        team.devFocusActualSeason = actualValue;

        document.querySelector("#slider-dev-focus-actual-season").value = actualValue ;
        document.querySelector("#dev-focus-actual").innerHTML = actualValue+"%";

        document.querySelector("#slider-dev-focus-next-season").value = team.devFocusNextSeason;
        document.querySelector("#dev-focus-next").innerHTML = team.devFocusNextSeason+"%";
    }
    if(e == "slider-investment-aerodynamics"){
        team.investments.aerodynamics = Number(document.getElementById("slider-investment-aerodynamics").value);
        document.querySelector("#investment-aerodynamics").innerHTML = NumberF(team.investments.aerodynamics *1000,"ext-short",0);
    }
    if(e == "slider-investment-downforce"){
        team.investments.downforce = Number(document.getElementById("slider-investment-downforce").value);
        document.querySelector("#investment-downforce").innerHTML = NumberF(team.investments.downforce *1000,"ext-short",0);
    }
    if(e == "slider-investment-weight"){
        team.investments.weight = Number(document.getElementById("slider-investment-weight").value);
        document.querySelector("#investment-weight").innerHTML = NumberF(team.investments.weight *1000,"ext-short",0);
    }
    if(e == "slider-investment-reliability"){
        team.investments.reliability = Number(document.getElementById("slider-investment-reliability").value);
        document.querySelector("#investment-reliability").innerHTML = NumberF(team.investments.reliability *1000,"ext-short",0);
    }

    document.querySelector("#race-total-investment").innerHTML = NumberF((team.investments.aerodynamics+team.investments.downforce+team.investments.weight+team.investments.reliability) *1000,"ext-short",0);
}

export function historicUI(){
    let html = `<div id="historic-tables">`;

    html += `
    <div>
        <h1>Pilotos</h1>
        <table>
            <tr>
                <th>Ano</th>
                <th></th>
                <th>Campeão</th>
                <th>Equipe</th>
                <th>Motor</th>
            </tr>`;
                
    game.championship.historic.forEach(e => {
        html += `
        <tr>
            <td>${e.year}</td>
            <td><img class="country-flag" src="img/flags/${accentsTidy(e.driverCountry)}.webp"></td>
            <td>${e.driverChampion}</td>
            <td>${e.driverTeam}</td>
            <td>${e.driverEngine}</td>
        </tr>`;
    });
    html += `</table></div>`;

    html += `
    <div>
        <table>
            <h1>Construtores</h1>
            <tr>
                <th>Ano</th>
                <th></th>
                <th>Equipe</th>
                <th>Motor</th>
            </tr>`;
                
    game.championship.historic.forEach(e => {
        html += `
        <tr>
            <td>${e.year}</td>
            <td><img class="country-flag" src="img/flags/${accentsTidy(e.constructorCountry)}.webp"></td>
            <td>${e.constructorChampion}</td>
            <td>${e.constructorEngine}</td>
        </tr>`;
    });
    html += `</table></div></div>`;

    Swal.fire({
        title: `Histórico de Campeões`,
        html: html,
        width: "72em",
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Ok",
    });
}

export function teamRankingUI(){
    let html = ``;

    game.championship.createStandings();

    html += `<table id="team-standings">
                <tr>
                    <th>Pos</th>
                    <th colspan="2">Equipe</th>
                    <th>Motor</th>
                    <th>Pontos</th>
                    <th>Vitórias</th>
                    <th>Pódios</th>
                </tr>`;
                
    let pos = 1;
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

    Swal.fire({
        title: `Classificação do Campeonato de Construtores ${game.year}`,
        html: html,
        width: "75%",
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Ok",
    });
}

export function seasonOverviewUI(thenCall){
    let html = ``;

    game.championship.createStandings();

    html += `
    <div id="season-overview">
        <table>
            <tr>
                <th>Pos</th>
                <th>Piloto</th>
                <th>País</th>
                <th>Equipe</th>
    `;

    game.championship.tracks.forEach(e => {
        html += `<th><img class="country-flag" src="img/flags/${accentsTidy(circuitsData[e].country)}.webp"><br>${circuitsData[e].abbrev}</th>`;
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

    Swal.fire({
        title: `Classificação do Campeonato de Pilotos ${game.year}`,
        html: html,
        width: "100%",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    }).then(e => {
        if(thenCall == "end"){
            game.championship.EndSeason();
        }
    })
}