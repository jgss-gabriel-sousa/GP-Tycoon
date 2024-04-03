import { game } from "./game.js";
import { gameOptionsUI, teamRankingUI, historicUI, seasonOverviewUI, UpdateDataInfo } from "./ui.js";
import { viewDriver } from "../ui/viewDriver.js"
import { viewEng } from "../ui/viewEng.js"
import { viewEmployees } from "../ui/viewEmployees.js";
import { viewFinancialReport } from "../ui/viewFinancialReport.js";
import { viewFinancialBalance } from "../ui/viewFinancialBalance.js";
import { selectDatabase, loadGame, saveGame } from "../ui/start-load-save.js";
import { selectEngine } from "../ui/selectEngine.js";
import { market, marketEng } from "../ui/market.js";
import { newsUI } from "../ui/news.js";
import { viewReputation } from "../ui/viewReputation.js";
import { bankUI } from "../ui/bank.js";
import { sponsorsUI } from "../ui/sponsors.js";

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
    sponsorsUI();
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
    loadGame();
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
});