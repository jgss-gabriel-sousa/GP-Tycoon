import { Championship } from "../championship.js";
import { game } from "../game.js";
import { accentsTidy, timeConvert } from "../utils.js";


export const genRaceTableHTML = (status) => {
    if(Championship.race.finalResult.length == 0)
        Championship.RaceSim("start");
    else if(status != "podium" && status != "end")
        Championship.RaceSim();

    const finalResult = Championship.race.finalResult;
    const retires = Championship.race.retires;
    const rain = Championship.race.rain;
    const lap = Championship.race.lap;

    const raceName = Championship.tracks[Championship.actualRound-1];

    let TimeTableHTML = `
    <table><tr>
        <th>Pos</th>
        <th>Piloto</th>
        <th>Equipe</th>
        <th>Tempo</th>
        <th>Pneus</th>
    </tr>
    `;

    let pos = 1;

    for(const k in finalResult) {
        TimeTableHTML += `<tr><td>${pos++}º</td>`;
        TimeTableHTML += `<td>${finalResult[k].name}</td>`;
        const team = game.teams[game.drivers[finalResult[k].name].team];
        TimeTableHTML += `<td style="background-color: ${team.result_bg_color}; color: ${team.result_font_color}">${team.name}</td>`;

        if(k == 0){
            TimeTableHTML += `<td class="first-position">${lap} Voltas`;
            if(rain) TimeTableHTML += ` (Chuva)`;
            TimeTableHTML += "</td>";
        }
        else{
            let classPos;

            if(k == 1) classPos = "second-position";
            else if(k == 2) classPos = "third-position";
            else if(k < game.championship.pointsSystem.length) classPos = "scorer-position";
            else classPos = "non-scorer-position";

            if(status == "podium"){
                TimeTableHTML += `<td class="${classPos}">+${timeConvert(Number(finalResult[k].totalTime) - Number(finalResult[0].totalTime))}</td>`
            }
            else{
                TimeTableHTML += `<td class="${classPos}">+${timeConvert(Number(finalResult[k].totalTime) - Number(finalResult[k-1].totalTime))}</td>`
            }
        }

        TimeTableHTML += `<td class="tire-strategy">${finalResult[k].tireStrategy}</td>`;

        TimeTableHTML += `</tr>`;
    }

    for(const k in retires) {
        TimeTableHTML += `<tr><td>${pos++}º</td>`;
        TimeTableHTML += `<td>${retires[k].name}</td>`;
        const team = game.teams[game.drivers[retires[k].name].team];
        TimeTableHTML += `<td style="background-color: ${team.result_bg_color}; color: ${team.result_font_color}">${team.name}</td>`;
        TimeTableHTML += `<td class="retired-position">Volta ${retires[k].lap} (${retires[k].reason})</td>`
        TimeTableHTML += `</tr>`;
    }
    TimeTableHTML += "</table>";

    if(status == "podium"){
        TimeTableHTML = `
        <img class="podium-img" src="img/drivers/${game.drivers[finalResult[1].name].image}.webp" onerror="Championship.onerror=null;Championship.src='img/drivers/generic.webp';">
        <img class="podium-img" src="img/drivers/${game.drivers[finalResult[0].name].image}.webp" onerror="Championship.onerror=null;Championship.src='img/drivers/generic.webp';">
        <img class="podium-img" src="img/drivers/${game.drivers[finalResult[2].name].image}.webp" onerror="Championship.onerror=null;Championship.src='img/drivers/generic.webp';">
        <img class="podium-img" src="img/flags/${accentsTidy(game.drivers[finalResult[0].name].country)}.webp">
        `
    }

    return TimeTableHTML;
}