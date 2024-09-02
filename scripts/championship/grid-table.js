import { Championship } from "../championship.js";
import { game } from "../game.js";
import { timeConvert } from "../utils.js";
import { QualifySim } from "./qualify-sim.js";

export const genGridTableHTML = (status) => {
    if(status != "end")
        game.championship.QualifySim();

    const grid = Championship.race.grid;

    let TimeTableHTML = `
    <table><tr>
        <th>Pos</th>
        <th>Piloto</th>
        <th>Equipe</th>
        <th>Tempo</th>
        <th>Diff ant.</th>
        <th>Diff 1º</th>
    </tr>`;

    let i = 0;
    for(const k in grid) {
        
        i++;
        if(i == 11 && Championship.race.qSection == "Q2"){
            TimeTableHTML += "<tr><td colspan='6'></td></tr>"
        }
        if(i == 16 && Championship.race.qSection == "Q1"){
            TimeTableHTML += "<tr><td colspan='6'></td></tr>"
        }

        if(status == "end"){
            if(k == 0)
                TimeTableHTML += `<tr class="grid-status-pole">`
            else if(grid[k].status == "done-Q2" || grid[k].status == "done-Q1"){
                TimeTableHTML += `<tr class="grid-status-${grid[k].status}">`
            }
            else
                TimeTableHTML += `<tr>`
        }
        else
            TimeTableHTML += `<tr class="grid-status-${grid[k].status}">`

        const teamName = game.drivers[grid[k].name].team;
        const bgColor = game.teams[teamName].result_bg_color;
        const textColor = game.teams[teamName].result_font_color;
        let time = Number(grid[k].time);

        if(time == 999){
            time = "";
        }
        else{
            time = timeConvert(time);
        }

        TimeTableHTML += `
            <td>${Number(k)+1}º</td>
            <td>${grid[k].name}</td>
            <td style="background-color: ${bgColor}; color:${textColor}">${teamName}</td>
            <td>${time}</td>`

        if(k == 0)
            TimeTableHTML += `<td colspan="2">Pole Position</td>`
        else
            TimeTableHTML += `<td>+${timeConvert(Number(grid[k].time) - Number(grid[k-1].time))}</td>`

        if(k != 0)
            TimeTableHTML += `<td>+${timeConvert(Number(grid[k].time) - Number(grid[0].time))}</td>`
            
        TimeTableHTML += `</tr>`
    }
    TimeTableHTML += "</table>";

    return TimeTableHTML;
}