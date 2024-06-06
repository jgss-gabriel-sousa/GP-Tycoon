import { game } from "./game.js";
import { teamRankingUI, historicUI, seasonOverviewUI, UpdateDataInfo } from "./ui.js";
import { viewDriver } from "../views/viewDriver.js"
import { viewEng } from "../views/viewEng.js"
import { viewEmployees } from "../views/viewEmployees.js";
import { viewFinancialReport } from "../views/viewFinancialReport.js";
import { viewFinancialBalance } from "../views/viewFinancialBalance.js";
import { selectDatabase, loadGameScreen, saveGame } from "../views/start-load-save.js";
import { viewSelectEngine } from "../views/viewSelectEngine.js";
import { viewMarket, viewMarketEng } from "../views/viewMarket.js";
import { viewNews } from "../views/viewNews.js";
import { viewReputation } from "../views/viewReputation.js";
import { viewBank } from "../views/viewBank.js";
import { viewSponsors } from "../views/viewSponsors.js";
import { viewGameOptions } from "../views/viewGameOptions.js";

document.querySelector("#btn-play").addEventListener("click", () => {
    game.championship.RunRaceSimulation();
});

document.querySelector("#btn-options").addEventListener("click", () => {
    viewGameOptions();
});

document.querySelector("#btn-standings").addEventListener("click", () => {
    seasonOverviewUI();
});

document.querySelector("#btn-team-standings").addEventListener("click", () => {
    teamRankingUI();
});

document.querySelector("#btn-news").addEventListener("click", () => {
    viewNews();
});
document.querySelector("#btn-bank").addEventListener("click", () => {
    viewBank();
});
document.querySelector("#btn-sponsors").addEventListener("click", () => {
    viewSponsors();
});

document.querySelector("#btn-historic").addEventListener("click", () => {
    historicUI();
});
document.querySelector("#money").addEventListener("click", () => {
    viewFinancialReport(game.team);
});
document.querySelector("#reputation").addEventListener("click", () => {
    viewReputation(game.team);
});
document.querySelector("#start-game").addEventListener("click", () => {
    selectDatabase();
});
document.querySelector("#load-game").addEventListener("click", () => {
    loadGameScreen();
});
document.querySelector("#btn-save-game").addEventListener("click", () => {
    saveGame();
});

window.onclick = e => {

    if(e.target.classList.contains("view-driver")){
        const btn = e.target;

        viewDriver(btn.value);
    }
    if(e.target.classList.contains("view-eng")){
        const btn = e.target;

        viewEng(btn.value);
    }
    if(e.target.classList.contains("view-employees")){
        const btn = e.target;

        viewEmployees(btn.value);
    }
    if(e.target.classList.contains("dismiss-eng")){
        const btn = e.target;
        const name = btn.value;

        //game.teams[game.team].
    }
    if(e.target.classList.contains("select-engine")){
        viewSelectEngine();
    }
    if(e.target.classList.contains("market")){
        viewMarket();
    }
    if(e.target.classList.contains("market-eng")){
        viewMarketEng();
    }
}

window.addEventListener("beforeunload", e => {
    e.returnValue = "\o/";
    localStorage.setItem("gp-tycoon-settings", JSON.stringify(game.settings));
});