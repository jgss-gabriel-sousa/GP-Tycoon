import { game } from "./game.js";
import { genTeamHTML } from "./app.js"
import { changeScreen } from "./screens.js"
import { gameOptionsUI, teamRankingUI, historicUI, seasonOverviewUI, viewDriverUI } from "./ui.js";

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

document.querySelector("#start-game").addEventListener("click", () => {
    game.team = document.querySelector("#select-team").value;

    changeScreen("team-menu");
    genTeamHTML();
});

window.onclick = e => {

    if(e.target.classList.contains("view-driver")){
        const btn = e.target;

        viewDriverUI(btn.value);
    }
}