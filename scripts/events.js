import { game } from "./game.js";
import { gameOptionsUI, teamRankingUI, historicUI, seasonOverviewUI, UpdateDataInfo } from "./ui.js";
import { viewDriver } from "../views/viewDriver.js"
import { viewEng } from "../views/viewEng.js"
import { viewEmployees } from "../views/viewEmployees.js";
import { viewFinancialReport } from "../views/viewFinancialReport.js";
import { viewFinancialBalance } from "../views/viewFinancialBalance.js";
import { selectDatabase, loadGameScreen, saveGame } from "../views/start-load-save.js";
import { selectEngine } from "../views/selectEngine.js";
import { market, marketEng } from "../views/market.js";
import { newsUI } from "../views/news.js";
import { viewReputation } from "../views/viewReputation.js";
import { bankUI } from "../views/bank.js";
import { viewSponsors } from "../views/viewSponsors.js";

document.querySelector("#btn-play").addEventListener("click", () => {
    game.championship.RunRaceSimulation();
});

document.querySelector("#btn-options").addEventListener("click", () => {
    gameOptionsUI();
});

document.querySelector("#btn-standings").addEventListener("click", () => {
    seasonOverviewUI();
});

document.querySelector("#btn-team-standings").addEventListener("click", () => {
    teamRankingUI();
});

document.querySelector("#btn-news").addEventListener("click", () => {
    newsUI();
});
document.querySelector("#btn-bank").addEventListener("click", () => {
    bankUI();
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
        selectEngine();
    }
    if(e.target.classList.contains("market")){
        market();
    }
    if(e.target.classList.contains("market-eng")){
        marketEng();
    }
}

window.addEventListener("beforeunload", e => {
    e.returnValue = "\o/";
    localStorage.setItem("gp-tycoon-settings", JSON.stringify(game.settings));
});