import { blankSpaceRmv, accentsTidy, NumberF } from "../scripts/utils.js"
import { game } from "../scripts/game.js"
import { UpdateDataInfo } from "../scripts/ui.js";
import { tooltips } from "../scripts/tooltips.js";
import { display } from "../scripts/display.js";
import { CreateStandings } from "../scripts/championship/create-standings.js";
import { LOC } from "../scripts/translation.js";
import { MenuTeam } from "./menus/menu-team.js";
import { MenuCarDevelopment } from "./menus/menu-car-development.js";
import { viewGameOptions } from "./viewGameOptions.js";
import { saveGame } from "./start-load-save.js";
import { RunRaceSimulation } from "../scripts/championship/run-race-simulation.js";
import { viewFinancialReport } from "./viewFinancialReport.js";
import { viewReputation } from "./viewReputation.js";
import { addButtonEvent } from "../scripts/events.js";

export function startGameScreens(){
    setInterfaceColors();

    document.querySelector("#menu-container").innerHTML = ""

    MenuTeam();
    MenuCarDevelopment();

    document.querySelector(`#menu-team`).style.display = "flex";

    addButtonEvent("#btn-play", () => RunRaceSimulation());
    addButtonEvent("#btn-save-game", saveGame);
    addButtonEvent("#btn-options", viewGameOptions);
    addButtonEvent("#money", () => viewFinancialReport(game.team));
    addButtonEvent("#reputation", () => viewReputation(game.team));
}


function setInterfaceColors(){
    const teams = game.teams;
    const team = teams[game.team];

    if(game.settings["ui-team-colors"]){
        document.querySelector(":root").style.setProperty("--bg", team.bg_color);
        document.querySelector(":root").style.setProperty("--border", team.border_color);
        document.querySelector(":root").style.setProperty("--text", team.font_color);
        document.querySelector(":root").style.setProperty("--titles", team.titles_color);
    }
    else{
        document.querySelector(":root").style.setProperty("--bg", "#afafaf");
        document.querySelector(":root").style.setProperty("--border", "#222");
        document.querySelector(":root").style.setProperty("--text", "#000");
        document.querySelector(":root").style.setProperty("--titles", "#f0f0f0");
    }
}


export function genTeamMainMenu(){
    game.championship["CreateStandings"] = CreateStandings;
    genDriversHTML();
    genCarHTML();
    genEngHTML();
    genDevelopmentHTML();

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

    tooltips();
};