import { genTeamHTML } from "./app.js";
import { circuitsData } from "./data/circuits.js";
import { game, UpdateAfterRace, YearUpdate, UpdateTeamsStats } from "./game.js";
import { seasonOverviewUI } from "./ui.js";
import { driversData } from "./data/driversData.js";
import { teamsData } from "./data/teamsData.js";
import { accentsTidy } from "./utils.js";

export class Championship {
    constructor() {
        this.year = 2023;

        this.teams = ["Red Bull","Mercedes","Ferrari","Aston Martin","AlphaTauri","Alfa Romeo","Alpine","Haas","Williams","McLaren"];
        this.tracks = ["Bahrein","Arábia Saudita","Austrália","Azerbaijão","Miami","Emília-Romanha","Mônaco","Espanha","Canadá","Áustria","Grã-Bretanha","Hungria","Bélgica","Países Baixos","Itália","Singapura","Japão","Catar","Estados Unidos","Cidade do México","São Paulo","Las Vegas","Abu Dhabi"];
        
        this.results = {};
        this.standings = [];
        this.teamStandings = [];
        this.actualRound = 1;
        this.pointsSystem = [25,18,15,12,10,8,6,4,2,1];

        this.historic = [
            {
                year: 2022,
                driverChampion: "Max Verstappen",
                driverCountry: "NL",
                driverTeam: "Red Bull",
                driverEngine: "Red Bull",
    
                constructorChampion: "Red Bull",
                constructorCountry: "AT",
                constructorEngine: "Red Bull",
            }
        ];
        
        this.drivers = [];

        this.teams.forEach(t => {
            const team = teamsData[t];

            this.drivers.push(driversData[team.driver1].name);
            this.drivers.push(driversData[team.driver2].name);
        });
    }

    EndSeason(){
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
                    <td><img class="country-flag" src="img/flags/${accentsTidy(game.drivers[this.standings[0][0]].country)}.webp"></td>
                    <td>${this.standings[0][0]}</td>
                    <td>${game.drivers[this.standings[0][0]].team}</td>
                    <td>${this.standings[0][1]}</td>
                </tr>
                <tr class="second-position">
                    <td>2º</td>
                    <td><img class="country-flag" src="img/flags/${accentsTidy(game.drivers[this.standings[1][0]].country)}.webp"></td>
                    <td>${this.standings[1][0]}</td>
                    <td>${game.drivers[this.standings[1][0]].team}</td>
                    <td>${this.standings[1][1]}</td>
                </tr>
                <tr class="third-position">
                    <td>3º</td>
                    <td><img class="country-flag" src="img/flags/${accentsTidy(game.drivers[this.standings[2][0]].country)}.webp"></td>
                    <td>${this.standings[2][0]}</td>
                    <td>${game.drivers[this.standings[2][0]].team}</td>
                    <td>${this.standings[2][1]}</td>
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
                    <td><img class="country-flag" src="img/flags/${accentsTidy(game.teams[this.teamStandings[0][0]].country)}.webp"></td>
                    <td>${this.teamStandings[0][0]}</td>
                    <td>${game.teams[this.teamStandings[0][0]].engine}</td>
                    <td>${this.teamStandings[0][1]}</td>
                </tr>
                <tr class="second-position">
                    <td>2º</td>
                    <td><img class="country-flag" src="img/flags/${accentsTidy(game.teams[this.teamStandings[1][0]].country)}.webp"></td>
                    <td>${this.teamStandings[1][0]}</td>
                    <td>${game.teams[this.teamStandings[1][0]].engine}</td>
                    <td>${this.teamStandings[1][1]}</td>
                </tr>
                <tr class="third-position">
                    <td>3º</td>
                    <td><img class="country-flag" src="img/flags/${accentsTidy(game.teams[this.teamStandings[2][0]].country)}.webp"></td>
                    <td>${this.teamStandings[2][0]}</td>
                    <td>${game.teams[this.teamStandings[2][0]].engine}</td>
                    <td>${this.teamStandings[2][1]}</td>
                </tr>
            </table>
        </div>
        `


        Swal.fire({
            title: "<strong>Fim de Temporada - "+this.year+"</strong>",
            html: html,
            width: "42em",
            focusConfirm: true,
            allowOutsideClick: false,
            confirmButtonText: "Ok",
        }).then(() => {
            game.YearUpdate();
        });
    }

    RunRaceSimulation(){
        UpdateTeamsStats();

        if(this.actualRound > this.tracks.length){
            seasonOverviewUI("end");
            return;
        } 

        const raceName = this.tracks[this.actualRound-1];
        const totalLaps = 50;

        //##############################################################
        //QUALIFY

        let grid = {};

        for (const d in this.drivers) {
            const base = circuitsData[raceName].baseLapTime;
            const driverName = this.drivers[d];
            const car = game.teams[game.drivers[driverName].team].car;
            
            const circuitCorners = circuitsData[raceName].corners/100;
            const circuitStraights = circuitsData[raceName].straights/100;
            
            const randomF = 1 + (Math.random() * 0.6 - 0.3);

            const driverF = (1 - game.drivers[driverName].speed/100) * randomF;
            
            const cornersF = (1 - (car.corners/100)) * randomF * circuitCorners;
            const straightF = (1 - (car.straights/100)) * randomF * circuitStraights;

            const rainF = 1;//1 - car.speed/100;

            const lapTime = base/51 + ((base*driverF*cornersF*straightF*rainF) / (base*Math.pow(0.5,3)*rainF));

            grid[d] = {
                name: driverName,
                time: lapTime,
            }
        }
        grid = Object.values(grid).sort((a, b) => a.time - b.time);

        //##############################################################
        //RACE

        const raceDrivers = [];
        let i = 0;
        for(const k in grid) {
            raceDrivers.push({
                name: grid[k].name,
                actualLap: 0,
                lapTime: 0,
                totalTime: i++ / 80,
                racing: true,
            });
        }

        let fastestLap = -1;
        let fastestLapDriver = "";
        const retires = [];
        let sumLaptime = 0;
        let meanLaptime = 0;

        let rain = false;
        if(Math.floor(Math.random() * 100) < circuitsData[raceName].rainChance) 
            rain = true;

        for (let lap = 0; lap < totalLaps; lap++) {
            sumLaptime = 0;
            let d = 0;
            for(; d < raceDrivers.length; d++) {
                if(!raceDrivers[d].racing)  continue;

                const base = circuitsData[raceName].baseLapTime;
                const driverName = this.drivers[d];
                const car = game.teams[game.drivers[driverName].team].car;
            
                const circuitCorners = circuitsData[raceName].corners/100;
                const circuitStraights = circuitsData[raceName].straights/100;
                
                let rainF = 1;

                if(rain)
                    rainF = 0.5;

                const randomF = 1 + (Math.random() * (3*(1/rainF)) - 1.5*(1/rainF));
                
                const driverF = (1 - game.drivers[driverName].pace/100) * randomF;

                const cornersF = (1 - (car.corners/100)) * randomF * circuitCorners * rainF;
                const straightF = (1 - (car.straights/100)) * randomF * circuitStraights * rainF;
                

                let lapTime = base/55 + ((base*driverF*cornersF*straightF) / (base*Math.pow(0.5,3)*rainF));

                sumLaptime += lapTime;
                if(meanLaptime != 0){

                    const delta = 0.01;

                    if(lapTime <= meanLaptime*(1-delta) || lapTime >= meanLaptime*(1+delta)){
                        lapTime = meanLaptime;
                    }
                }

                const failureChanceRoll = Math.floor(Math.random() * 1000);
                const failureRoll = Math.floor(Math.random() * 100);
                let failureChance = 5;

                if(retires.length < (raceDrivers.length-3) && failureChanceRoll <= failureChance && failureRoll >= car.reliability){
                    raceDrivers[d].racing = false;

                    const engineReliability = game.engines[game.teams[game.drivers[driverName].team].engine].reliability;
                    let failureReason;

                    if(failureRoll >= Math.round(car.chassisReliability/(car.chassisReliability+engineReliability))){
                        failureReason = ["Freios","Câmbio","Vazamento de Óleo","Radiador","Pneus","Suspensão","Transmissão","Direção","Pane Hidráulica"];
                    }
                    else{
                        failureReason = "Motor";
                    }

                    failureReason = failureReason[Math.floor(Math.random() * 100) % failureReason.length];

                    retires.push({
                        name: raceDrivers[d].name,
                        lap: lap+1,
                        reason: failureReason,
                    })
                    continue;
                }

                const crashChanceRoll = Math.floor(Math.random() * 1800);
                const crashRoll = Math.floor(Math.random() * 100);
                
                let driverExp = game.drivers[raceDrivers[d].name].experience / 100;
                if(driverExp == 0) driverExp = 0.05;
                const driverEscape = (1/driverExp)*2;

                let crashChance = 1;
                if(lap == 0) crashChance = 10;

                if(rain)
                    crashChance *= 2;

                if(retires.length < (raceDrivers.length-3) && crashChanceRoll <= crashChance && crashRoll >= driverEscape){
                    raceDrivers[d].racing = false;

                    retires.push({
                        name: raceDrivers[d].name,
                        lap: lap+1,
                        reason: "Acidente",
                    })
                    continue;
                }

                raceDrivers[d].lapTime = lapTime;
                raceDrivers[d].totalTime += lapTime;
                raceDrivers[d].actualLap++;

                if(fastestLap > lapTime || fastestLap == -1){
                    fastestLap = lapTime;
                    fastestLapDriver = raceDrivers[d].name;
                }
            }
            meanLaptime = sumLaptime/d;
        }
        let finalResult = raceDrivers.sort((a, b) => a.totalTime - b.totalTime);
        retires.reverse();

        //##############################################################
        
        const race = [];
        const aux = [];
        for (let i = 0; i < finalResult.length; i++) {
            if(finalResult[i].racing){
                race.push(finalResult[i].name);
                aux.push(finalResult[i]);
            }
        }

        finalResult = aux;
        
        //##############################################################4
        //UI

        let TimeTableHTML = `
        <table><tr>
            <th>Pos</th>
            <th>Piloto</th>
            <th>Tempo</th>
            <th>Diff ant.</th>
            <th>Diff 1º</th>
        </tr>`;
        
        function timeConvert(minutes) {
            const minutesInt = Math.floor(minutes);
            const seconds = Math.floor((minutes - minutesInt) * 60);
            const milliseconds = Math.floor(((minutes - minutesInt) * 60 - seconds) * 1000);
            const secondsStr = seconds.toString().padStart(2, '0');
            const millisecondsStr = milliseconds.toString().padStart(3, '0');
            return minutesInt + ':' + secondsStr + ':' + millisecondsStr;
        }

        for(const k in grid) {
            TimeTableHTML += `
            <tr>
                <td>${Number(k)+1}º</td>
                <td>${grid[k].name}</td>
                <td>${timeConvert(Number(grid[k].time))}</td>`
        
            if(k == 0)
                TimeTableHTML += `<td colspan="2">Pole Position</td>`
            else
                TimeTableHTML += `<td>+${timeConvert(Number(grid[k].time) - Number(grid[k-1].time))}</td>`

            if(k != 0)
                TimeTableHTML += `<td>+${timeConvert(Number(grid[k].time) - Number(grid[0].time))}</td>`
                
            TimeTableHTML += `</tr>`
        }
        TimeTableHTML += "</table>";

        Swal.fire({
            title: "<strong>Classificação GP <b>"+raceName+"</b></strong>",
            html: `
            <div id="time-table">${TimeTableHTML}</div>
            `,
            width: "42em",
            focusConfirm: true,
            allowOutsideClick: false,
            confirmButtonText: "Ok",
        }).then(e => {
            TimeTableHTML = `
                <table><tr>
                    <th>Pos</th>
                    <th>Piloto</th>
                    <th>Equipe</th>
                    <th>Tempo</th>
                </tr>
            `;

            let pos = 1;

            for(const k in finalResult) {
                TimeTableHTML += `<tr><td>${pos++}º</td>`;
                TimeTableHTML += `<td>${finalResult[k].name}</td>`;
                const team = game.teams[game.drivers[finalResult[k].name].team];
                console.log()
                TimeTableHTML += `<td style="background-color: ${team.result_bg_color}; color: ${team.result_font_color}">${team.name}</td>`;

                if(k == 0){
                    TimeTableHTML += `<td class="first-position">${circuitsData[raceName].laps} Voltas`;
                    if(rain) TimeTableHTML += ` (Chuva)`;
                    TimeTableHTML += "</td>";
                }
                else{
                    let classPos;

                    if(k == 1) classPos = "second-position";
                    else if(k == 2) classPos = "third-position";
                    else if(k < game.championship.pointsSystem.length) classPos = "scorer-position";
                    else classPos = "non-scorer-position";

                    TimeTableHTML += `<td class="${classPos}">+${timeConvert(Number(finalResult[k].totalTime) - Number(finalResult[0].totalTime))}</td>`
                }

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

            Swal.fire({
                title: "<strong>Resultado GP "+raceName+"</strong>",
                html: `
                <div id="race">
                    <div id="time-table">
                        ${TimeTableHTML}
                    </div>
                    <div id="podium">
                        <img class="podium-img" src="img/drivers/${finalResult[1].name}.webp">
                        <img class="podium-img" src="img/drivers/${finalResult[0].name}.webp">
                        <img class="podium-img" src="img/drivers/${finalResult[2].name}.webp">
                        <img class="podium-img" src="img/flags/${accentsTidy(game.drivers[finalResult[0].name].country)}.webp">
                    </div>
                </div>
                `,
                width: "100%",
                focusConfirm: true,
                allowOutsideClick: false,
                confirmButtonText: "Ok",
            }).then(e => {
                genTeamHTML();
            });
        });

        //##############################################################
        // UPDATE STATS

        grid.forEach(e => {
            game.drivers[e.name].gps++;
        });

        game.drivers[grid[0].name].poles++;
        game.drivers[finalResult[0].name].wins++;
        game.drivers[finalResult[0].name].podiums++;
        game.drivers[finalResult[1].name].podiums++;
        game.drivers[finalResult[2].name].podiums++;

        //##############################################################

        this.results[raceName] = race;
        this.actualRound++;

        UpdateAfterRace();
        genTeamHTML();
    }

    createStandings() {
        const driverRanking = {};

        for (const d in this.drivers) {
            const driver = game.drivers[this.drivers[d]];

            driverRanking[driver.name] = {
                pts: 0,
                wins: 0,
                bestFinish: 999,
            };
        }

        for (const r in this.results) {
            const raceResult = this.results[r];

            for (let pos = 0; pos < raceResult.length; pos++) {
                const driver = driverRanking[raceResult[pos]];

                if(pos == 0){
                    driver.wins++;
                }

                if(pos < this.pointsSystem.length)
                    driver.pts += this.pointsSystem[pos];

                if(driver.bestFinish > pos+1){
                    driver.bestFinish = pos+1;
                }
            }
        }

        this.standings = [];
        for (const k in driverRanking) {
            this.standings.push([k, driverRanking[k].pts, driverRanking[k].wins, driverRanking[k].bestFinish]);
        }

        this.standings.sort((a, b) => a[3] - b[3]);
        this.standings.sort((a, b) => b[1] - a[1]);

        //Team Standings
        const teamRanking = {};

        for (const t of this.teams) {
            
            const team = game.teams[t];

            teamRanking[team.name] = {
                pts: 0,
                wins: 0,
                podiums: 0,
                bestFinish: 999,
            };
        }


        for (const r in this.results) {
            const raceResult = this.results[r];

            for (let pos = 0; pos < raceResult.length; pos++) {
                const driver = game.drivers[raceResult[pos]];
                const team = teamRanking[driver.team];

                if(pos == 0){
                    team.wins++;
                }
                if(pos <= 3){
                    team.podiums++;
                }

                if(pos < this.pointsSystem.length)
                    team.pts += this.pointsSystem[pos];

                if(team.bestFinish > pos+1){
                    team.bestFinish = pos+1;
                }
            }
        }
        
        this.teamStandings = [];
        for (const k in teamRanking) {
            this.teamStandings.push([
                k,
                teamRanking[k].pts,
                teamRanking[k].wins,
                teamRanking[k].podiums,
                teamRanking[k].bestFinish]);
        }

        this.teamStandings.sort((a, b) => a[4] - b[4]);
        this.teamStandings.sort((a, b) => b[1] - a[1]);
    }
}