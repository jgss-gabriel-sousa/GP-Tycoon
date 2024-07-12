import { game } from "./game.js";
import { teamRankingUI, historicUI, seasonOverviewUI, UpdateDataInfo } from "./ui.js";
import { viewDriver } from "../views/viewDriver.js"
import { viewEng } from "../views/viewEng.js"
import { viewEmployees } from "../views/viewEmployees.js";
import { viewFinancialReport } from "../views/viewFinancialReport.js";
import { selectDatabase, loadGameScreen, saveGame, editorScreen } from "../views/start-load-save.js";
import { viewSelectEngine } from "../views/viewSelectEngine.js";
import { viewMarket, viewMarketEng } from "../views/viewMarket.js";
import { viewNews } from "../views/viewNews.js";
import { viewReputation } from "../views/viewReputation.js";
import { viewBank } from "../views/viewBank.js";
import { viewSponsors } from "../views/viewSponsors.js";
import { viewGameOptions } from "../views/viewGameOptions.js";

function addButtonEvent(selector, eventHandler){
    const button = document.querySelector(selector);
    if (button) {
        button.addEventListener("click", eventHandler);
    }
};

addButtonEvent("#btn-play", () => game.championship.RunRaceSimulation());
addButtonEvent("#btn-save-game", saveGame);
addButtonEvent("#btn-options", viewGameOptions);
addButtonEvent("#btn-standings", seasonOverviewUI);
addButtonEvent("#btn-team-standings", teamRankingUI);
addButtonEvent("#btn-news", viewNews);
addButtonEvent("#btn-bank", viewBank);
addButtonEvent("#btn-sponsors", viewSponsors);
addButtonEvent("#btn-historic", historicUI);
addButtonEvent("#money", () => viewFinancialReport(game.team));
addButtonEvent("#reputation", () => viewReputation(game.team));
addButtonEvent("#start-game", selectDatabase);
addButtonEvent("#load-game", loadGameScreen);
addButtonEvent("#editor", editorScreen);

function handleClassClick(event) {
    const btn = event.target;
    const classActionMap = {
        "view-driver": viewDriver,
        "view-eng": viewEng,
        "view-employees": viewEmployees,
        "select-engine": viewSelectEngine,
        "market": viewMarket,
        "market-eng": viewMarketEng,
    };

    for (let className in classActionMap) {
        if (btn.classList.contains(className)) {
            classActionMap[className](btn.value);
            break;
        }
    }
}

window.addEventListener("click", handleClassClick);

window.addEventListener("beforeunload", e => {
    e.returnValue = "\o/";
    localStorage.setItem("gp-tycoon-settings", JSON.stringify(game.settings));
});