import { RunRaceSimulation } from "../../scripts/championship/run-race-simulation.js";
import { addButtonEvent } from "../../scripts/events.js";
import { game } from "../../scripts/game.js";
import { saveGame } from "../start-load-save.js";
import { viewFinancialReport } from "../viewFinancialReport.js";
import { viewGameOptions } from "../viewGameOptions.js";
import { viewReputation } from "../viewReputation.js";

export function MenuTeam(){
    document.querySelector("#menu-container").innerHTML += `
    <div class="game-menu" id="menu-team">
        <div id="sidebar-infos">
            <button id="btn-save-game"><img src="./img/ui/save.png"> Salvar Jogo</button>
            <button id="btn-options"><img src="./img/ui/settings.png"> Opções</button>

            <div id="info">    
                <h1 id="year"></h1>
                <div id="team">
                    <div>
                        <img id="team-logo" class="logo" alt="Team Logo">
                        <h1 id="name"></h1>
                    </div>
                    <div id="reputation"></div>
                    <div id="money" class="view-financial-report"></div>
                    <div id="supporters"><p></p></div>
                </div>
                <div id="next-race">
                    <h1>Próxima Corrida</h1>
                    <div id="next-race-name"></div>
                    <button id="btn-play"><span>Continuar</span></button>
                </div>
            </div>
        </div>

        <div id="team-menu">
            <div id="drivers-car-section">
                <div id="drivers"></div>
                <div id="car" class="bars-table">
                    <div id="car-info"></div>
                    <div id="chassis"></div>
                    <div id="engine"></div>
                </div>
            </div>
        </div>
    </div>
    `

    addButtonEvent("#btn-play", () => RunRaceSimulation());
    addButtonEvent("#btn-save-game", saveGame);
    addButtonEvent("#btn-options", viewGameOptions);
    addButtonEvent("#money", () => viewFinancialReport(game.team));
    addButtonEvent("#reputation", () => viewReputation(game.team));
}