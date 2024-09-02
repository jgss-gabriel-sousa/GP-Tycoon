import { Championship } from "../championship.js";
import { game, YearUpdate } from "../game.js";
import { accentsTidy } from "../utils.js";

export const endSeason = () => {
    let html = `
    <div id="end-season">
        <h1>Mundial de Pilotos</h1>
        <table>
            <tr>
                <th>Pos</th>
                <th></th>
                <th>Nome</th>
                <th>Equipe</th>
                <th>Pts</th>
            </tr>
            <tr class="first-position">
                <td>1º</td>
                <td><img class="country-flag" src="img/flags/${accentsTidy(game.drivers[Championship.standings[0][0]].country)}.webp"></td>
                <td>${Championship.standings[0][0]}</td>
                <td>${game.drivers[Championship.standings[0][0]].team}</td>
                <td>${Championship.standings[0][1]}</td>
            </tr>
            <tr class="second-position">
                <td>2º</td>
                <td><img class="country-flag" src="img/flags/${accentsTidy(game.drivers[Championship.standings[1][0]].country)}.webp"></td>
                <td>${Championship.standings[1][0]}</td>
                <td>${game.drivers[Championship.standings[1][0]].team}</td>
                <td>${Championship.standings[1][1]}</td>
            </tr>
            <tr class="third-position">
                <td>3º</td>
                <td><img class="country-flag" src="img/flags/${accentsTidy(game.drivers[Championship.standings[2][0]].country)}.webp"></td>
                <td>${Championship.standings[2][0]}</td>
                <td>${game.drivers[Championship.standings[2][0]].team}</td>
                <td>${Championship.standings[2][1]}</td>
            </tr>
        </table>

        <br>

        <h1>Mundial de Construtores</h1>
        <table>
            <tr>
                <th>Pos</th>
                <th></th>
                <th>Equipe</th>
                <th>Motor</th>
                <th>Pts</th>
            </tr>
            <tr class="first-position">
                <td>1º</td>
                <td><img class="country-flag" src="img/flags/${accentsTidy(game.teams[Championship.teamStandings[0][0]].country)}.webp"></td>
                <td>${Championship.teamStandings[0][0]}</td>
                <td>${game.teams[Championship.teamStandings[0][0]].engine}</td>
                <td>${Championship.teamStandings[0][1]}</td>
            </tr>
            <tr class="second-position">
                <td>2º</td>
                <td><img class="country-flag" src="img/flags/${accentsTidy(game.teams[Championship.teamStandings[1][0]].country)}.webp"></td>
                <td>${Championship.teamStandings[1][0]}</td>
                <td>${game.teams[Championship.teamStandings[1][0]].engine}</td>
                <td>${Championship.teamStandings[1][1]}</td>
            </tr>
            <tr class="third-position">
                <td>3º</td>
                <td><img class="country-flag" src="img/flags/${accentsTidy(game.teams[Championship.teamStandings[2][0]].country)}.webp"></td>
                <td>${Championship.teamStandings[2][0]}</td>
                <td>${game.teams[Championship.teamStandings[2][0]].engine}</td>
                <td>${Championship.teamStandings[2][1]}</td>
            </tr>
        </table>
    </div>`

    Swal.fire({
        title: "Fim de Temporada - "+game.year,
        html: html,
        width: "42em",
        focusConfirm: true,
        allowOutsideClick: false,
        confirmButtonText: "Ok",
    }).then(() => {
        YearUpdate();
    });
}