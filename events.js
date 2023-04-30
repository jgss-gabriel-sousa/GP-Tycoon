import { game } from "./game.js";
import { gameOptionsUI, teamRankingUI, historicUI, seasonOverviewUI, UpdateDataInfo } from "./ui.js";
import { viewDriver } from "./ui/viewDriver.js"
import { viewEng } from "./ui/viewEng.js"
import { viewEmployees } from "./ui/viewEmployees.js";
import { viewFinancialReport } from "./ui/viewFinancialReport.js";
import { newGame, loadGame, saveGame } from "./ui/start-load-save.js";
import { selectEngine } from "./ui/selectEngine.js";

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

document.querySelector("#btn-historic").addEventListener("click", () => {
    historicUI();
});
document.querySelector("#money").addEventListener("click", () => {
    viewFinancialReport(game.team);
});
document.querySelector("#start-game").addEventListener("click", () => {
    newGame();
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
}