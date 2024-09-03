import { game, startGameData } from "../scripts/game.js";
import { changeScreen } from "../scripts/screens.js";
import { genTeamMainMenu } from "./mainMenu.js";

export function newGame(){
    startGameData();

    const teams = game.championship.teams;
    teams.sort();

    let html = `<select id="select-team">`;
    teams.forEach(t => {
        html += `<option value="${t}">${t}</option>`;
    });
    html += "</select>";

    Swal.fire({
        title: "Novo Jogo",
        html: html,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Ok",
    }).then((result) => {
        if(result.isConfirmed){
            game.team = document.querySelector("#select-team").value;

            game.news.unshift({
                headline: "Novidade na "+game.team,
                date: game.championship.actualRound-1,
                year: game.year,
                content: `A ${game.team} surpreende com a nomeação de um novo líder para sua direção, apesar de ser desconhecido é considerado uma grande promessa no gerenciamento, será ele capaz de fazer história?!`,
            });

            changeScreen("team-menu");
            genTeamMainMenu();
        }
    });
}