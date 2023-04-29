import { genTeamHTML } from "./app.js";
import { circuitsData } from "./data/circuits.js";
import { game, UpdateAfterRace, YearUpdate, BeforeRaceUpdateTeamsStats } from "./game.js";
import { seasonOverviewUI } from "./ui.js";
import { driversData } from "./data/driversData.js";
import { teamsData } from "./data/teamsData.js";
import { accentsTidy, genID, rollDice } from "./utils.js";

export class Championship {
    constructor(LoadedChampionship) {
        this.loaded = LoadedChampionship;

        if(this.loaded){
            this.teams = this.loaded.teams;
            this.tracks = this.loaded.tracks;
            this.results = this.loaded.results;
            this.standings = this.loaded.standings;
            this.teamStandings = this.loaded.teamStandings;
            this.actualRound = this.loaded.actualRound;
            this.pointsSystem = this.loaded.pointsSystem;
            this.budgetCap = this.loaded.budgetCap;
            this.historic = this.loaded.historic;
            this.drivers = this.loaded.drivers;
            this.teams = this.loaded.teams;
            this.race = this.loaded.race;
        }
        else{
            this.teams = ["Red Bull","Mercedes","Ferrari","Aston Martin","AlphaTauri","Alfa Romeo","Alpine","Haas","Williams","McLaren"];
            this.tracks = ["Bahrein","Arábia Saudita","Austrália","Azerbaijão","Miami","Emília-Romanha","Mônaco","Espanha","Canadá","Áustria","Grã-Bretanha","Hungria","Bélgica","Países Baixos","Itália","Singapura","Japão","Catar","Estados Unidos","Cidade do México","São Paulo","Las Vegas","Abu Dhabi"];
            //this.tracks = ["Bahrein","Arábia Saudita"];
            
            this.results = {};
            this.standings = [];
            this.teamStandings = [];
            this.actualRound = 1;
            this.pointsSystem = [25,18,15,12,10,8,6,4,2,1];
            this.budgetCap = 145000;

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

            this.race = {
                grid: {},
                qSection: "Q1",
                qDrivers: [],

                raceDrivers: [],
                finalResult: [],
                positions: [],
                condition: "",
                safetyCarLaps: 0,

                retires: [],
                rain: 0,
                lap: 0,
                simTick: 0,
            }
        }

        delete this.loaded;
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

    QualifySection(){
        let grid = {};
        const oldGrid = this.race.grid;
        
        const raceName = this.tracks[this.actualRound-1];
        let poleTime = 0;
        let poleName = "";

        if(this.race.qSection == "Q2" && this.race.qDrivers.length == 0){
            for(let i = 0; i < 15; i++) {
                this.race.qDrivers.push(oldGrid[i].name);
                oldGrid[i].time = 999;
            }
        }

        if(this.race.qSection == "Q3" && this.race.qDrivers.length == 15){
            this.race.qDrivers = [];
            for(let i = 0; i < 10; i++) {
                this.race.qDrivers.push(oldGrid[i].name);
                oldGrid[i].time = 999;
            }
        }

        for(const d in this.drivers){
            const driverName = this.drivers[d];

            if(this.race.qSection != "Q1" && !this.race.qDrivers.includes(driverName)){
                grid[driverName] = {
                    name: driverName,
                    time: -1,
                }
                continue;
            }

            const base = circuitsData[raceName].baseLapTime;
            const car = game.teams[game.drivers[driverName].team].car;
            const circuitCorners = circuitsData[raceName].corners/100;
            const circuitStraights = circuitsData[raceName].straights/100;
            const randomF = 1 + (Math.random() * 1.5 - 0.75);
            const driverF = (1 - game.drivers[driverName].speed/100) * (1 + (Math.random() * 1 - 0.75));
            const cornersF = (1 - (car.corners/100)) * randomF * circuitCorners ;
            const straightF = (1 - (car.straights/100)) * randomF * circuitStraights ;

            let divider;

            if(this.race.qSection == "Q1") divider = 59;
            if(this.race.qSection == "Q2") divider = 59.5;
            if(this.race.qSection == "Q3") divider = 60;

            let lapTime = base/divider + ((base*driverF*cornersF*straightF) / (base*Math.pow(0.8,3)));

            if((Math.random()*100) < 70){
                lapTime *= 1.5;
            }

            grid[driverName] = {
                name: driverName,
                time: lapTime,
                status: "",
                qSection: 3,
            }
        }
        
        if(oldGrid.length > 0){
            for(const d in grid) {
                let oldTime;
                let id;

                for(let i = 0; i < oldGrid.length; i++) {
                    const e = oldGrid[i];
                    
                    if(e.name == d){
                        oldTime = e.time;
                        id = i;
                    }
                }

                if(grid[d].time > oldTime){
                    grid[d] = oldGrid[id];
                }
                else if(grid[d].time == -1){
                    grid[d] = oldGrid[id];
                    
                    if(id > 9){
                        grid[d].status = "done-Q2";
                        grid[d].qSection = 2;
                    }
                    if(id > 14){
                        grid[d].status = "done-Q1";
                        grid[d].qSection = 1;
                    }
                }

                if(grid[d].time < poleTime || poleTime == 0){
                    poleTime = grid[d].time;
                    poleName = grid[d].name;
                }
            }
        }

        grid = Object.values(grid).sort((a, b) => a.time - b.time);
        grid = grid.sort((a, b) => b.qSection - a.qSection);
        this.race.grid = grid;
    }

    RaceSection(status){
        const raceDrivers = this.race.raceDrivers;
        const retires = this.race.retires;
        const meanLaptime = this.race.meanLaptime;
        const lap = this.race.lap;
        const rain = this.race.rain;

        const raceName = this.tracks[this.actualRound-1];

        if(status == "start"){
            let grid = this.race.grid;
            let aux = {};

            for (let i = 0; i < grid.length; i++) {
                aux[grid[i].name] = grid[i];
            }
            grid = aux;
    
            let i = 0
            for(const k in grid) {
                raceDrivers.push({
                    name: grid[k].name,
                    actualLap: 0,
                    lapTime: 0,
                    totalTime: i++ / 60,
                    racing: true,
                });
            }
            
            if(Math.floor(Math.random() * 100) < circuitsData[raceName].rainChance) 
                this.race.rain = true;
        }

        let d = 0;
        let newRaceCondition = "";

        for(; d < raceDrivers.length; d++) {
            if(!raceDrivers[d].racing)  continue;

            const base = circuitsData[raceName].baseLapTime;
            const driverName = this.drivers[d];
            const team = game.drivers[driverName].team;
            const car = game.teams[team].car;
        
            const circuitCorners = circuitsData[raceName].corners/100;
            const circuitStraights = circuitsData[raceName].straights/100;
            
            let rainF = 1;

            if(rain)
                rainF = 0.5;

            const randomF = 1 + (Math.random() * (1*(1/rainF)) - 0.5*(1/rainF));
            
            const driverF = (1 - game.drivers[driverName].pace/100) * randomF;

            const cornersF = (1 - (car.corners/100)) * randomF * circuitCorners * rainF;
            const straightF = (1 - (car.straights/100)) * randomF * circuitStraights * rainF;
            

            let lapTime = base/55 + ((base*driverF*cornersF*straightF) / (base*Math.pow(1,3)*rainF));

            if(d > 0){
                const diff = (raceDrivers[d].totalTime+lapTime) - raceDrivers[d-1].totalTime;
                
                if(diff <= 0.025 && diff >= 0){
                    const defender = game.drivers[raceDrivers[d-1].name];
                    const attacker = game.drivers[raceDrivers[d].name];
                    const teamDefender = game.drivers[raceDrivers[d-1].name].team;
                    const teamAttacker = game.drivers[raceDrivers[d].name].team;
                    const defenderCar = (game.teams[teamDefender].car.corners * game.teams[teamDefender].car.straights)/100;
                    const attackerCar = (game.teams[teamAttacker].car.corners * game.teams[teamAttacker].car.straights)/100;
                    
                    const overtakeRoll = Math.floor(Math.random() * 100);
                    let overtakeDC = Math.round(defender.speed+defenderCar - ((attackerCar + attacker.speed)/2)); 
                    if(overtakeDC <= 0) overtakeDC = 1;

                    if(overtakeRoll > overtakeDC){
                        lapTime = raceDrivers[d-1].lapTime-diff-0.0166;
                    }
                    else{
                        lapTime += 0.035;
                    }
                }
            }

            const failureChanceRoll = Math.floor(Math.random() * 1600);
            const failureRoll = Math.floor(Math.random() * 100);
            let failureChance = 5;

            if(retires.length < (raceDrivers.length-3) && failureChanceRoll <= failureChance && failureRoll >= car.reliability){
                raceDrivers[d].racing = false;

                const engineReliability = game.engines[game.teams[team].engine].reliability;
                let failureReason;

                if(failureRoll >= Math.round(car.chassisReliability/(car.chassisReliability+engineReliability))){
                    failureReason = ["Freios","Câmbio","Vazamento de Óleo","Radiador","Suspensão","Transmissão","Direção","Pane Elétrica","Pane Hidráulica"];
                }
                else{
                    failureReason = "Motor";
                }

                failureReason = failureReason[Math.floor(Math.random() * 100) % failureReason.length];

                if(Math.floor(Math.random() * 100) < 30){
                    newRaceCondition = "vsc";
                    this.race.safetyCarLaps = rollDice("2d4+0");
                }

                retires.unshift({
                    name: raceDrivers[d].name,
                    lap: lap+1,
                    reason: failureReason,
                })
                continue;
            }

            const crashChanceRoll = Math.floor(Math.random() * 18000);
            const crashRoll = Math.floor(Math.random() * 100);
            
            let driverExp = game.drivers[raceDrivers[d].name].experience / 100;
            if(driverExp == 0) driverExp = 0.05;
            const driverEscape = (1/driverExp)*2;

            let crashChance = 1;
            if(lap == 0) crashChance = 10;

            if(rain)
                crashChance *= 3;

            if(this.race.condition == "sc")
                crashChance = -1;

            if(retires.length < (raceDrivers.length-3) && crashChanceRoll <= crashChance && crashRoll >= driverEscape){
                raceDrivers[d].racing = false;

                if(Math.floor(Math.random() * 100) < 100){
                    newRaceCondition = "sc";
                    this.race.safetyCarLaps = rollDice("3d4+0");
                }

                retires.unshift({
                    name: raceDrivers[d].name,
                    lap: lap+1,
                    reason: "Acidente",
                })
                continue;
            }

            if(this.race.condition == "vsc" || this.race.condition == "sc"){
                lapTime = raceDrivers[0].lapTime;
            }

            raceDrivers[d].lapTime = lapTime;
            raceDrivers[d].totalTime += lapTime;
            raceDrivers[d].actualLap++;

            if(this.race.condition == "sc"){
                raceDrivers[d].totalTime = raceDrivers[0].totalTime+(d/60);
            }
        }

        //######################################################################

        let finalResult = raceDrivers.sort((a, b) => a.totalTime - b.totalTime);

        const aux = [];
        this.race.positions = [];
        for (let i = 0; i < finalResult.length; i++) {
            if(finalResult[i].racing){
                this.race.positions.push(finalResult[i].name);
                aux.push(finalResult[i]);
            }
        }
        finalResult = aux;
        this.race.finalResult = finalResult;

        this.race.simTick++;

        if(newRaceCondition != ""){
            this.race.condition = newRaceCondition;
        }


        if(this.race.simTick >= 3){
            this.race.lap++;
            this.race.simTick = 0;
            this.race.safetyCarLaps--;

            if(this.race.condition == "sc" && this.race.safetyCarLaps <= 0){
                this.race.condition = "";
            }
            if(this.race.condition == "vsc" && this.race.safetyCarLaps <= 0){
                this.race.condition = "";
            }
        }
    }
    
    timeConvert(minutes) {
        const minutesInt = Math.floor(minutes);
        const seconds = Math.floor((minutes - minutesInt) * 60);
        const milliseconds = Math.floor(((minutes - minutesInt) * 60 - seconds) * 1000);
        const secondsStr = seconds.toString().padStart(2, '0');
        const millisecondsStr = milliseconds.toString().padStart(3, '0');

        if(minutesInt <= 0)
            return secondsStr + ':' + millisecondsStr;
        if(minutesInt > 0)
            return minutesInt + ':' + secondsStr + ':' + millisecondsStr;
    }

    genGridTableHTML(status){
        if(status != "end")
            this.QualifySection();

        const grid = this.race.grid;

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
            if(i == 11 && this.race.qSection == "Q2"){
                TimeTableHTML += "<tr><td colspan='6'></td></tr>"
            }
            if(i == 16 && this.race.qSection == "Q1"){
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
                time = this.timeConvert(time);
            }

            TimeTableHTML += `
                <td>${Number(k)+1}º</td>
                <td>${grid[k].name}</td>
                <td style="background-color: ${bgColor}; color:${textColor}">${teamName}</td>
                <td>${time}</td>`

            if(k == 0)
                TimeTableHTML += `<td colspan="2">Pole Position</td>`
            else
                TimeTableHTML += `<td>+${this.timeConvert(Number(grid[k].time) - Number(grid[k-1].time))}</td>`

            if(k != 0)
                TimeTableHTML += `<td>+${this.timeConvert(Number(grid[k].time) - Number(grid[0].time))}</td>`
                
            TimeTableHTML += `</tr>`
        }
        TimeTableHTML += "</table>";

        return TimeTableHTML;
    }

    genRaceTableHTML(status){
        if(this.race.finalResult.length == 0)
            this.RaceSection("start");
        else if(status != "podium" && status != "end")
            this.RaceSection();

        const finalResult = this.race.finalResult;
        const retires = this.race.retires;
        const rain = this.race.rain;
        const lap = this.race.lap;

        const raceName = this.tracks[this.actualRound-1];

        let TimeTableHTML = `
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
                    TimeTableHTML += `<td class="${classPos}">+${this.timeConvert(Number(finalResult[k].totalTime) - Number(finalResult[0].totalTime))}</td>`
                }
                else{
                    TimeTableHTML += `<td class="${classPos}">+${this.timeConvert(Number(finalResult[k].totalTime) - Number(finalResult[k-1].totalTime))}</td>`
                }
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

        if(status == "podium"){
            TimeTableHTML = `
            <img class="podium-img" src="img/drivers/${finalResult[1].name}.webp" onerror="this.src='img/drivers/generic.webp';">
            <img class="podium-img" src="img/drivers/${finalResult[0].name}.webp" onerror="this.src='img/drivers/generic.webp';">
            <img class="podium-img" src="img/drivers/${finalResult[2].name}.webp" onerror="this.src='img/drivers/generic.webp';">
            <img class="podium-img" src="img/flags/${accentsTidy(game.drivers[finalResult[0].name].country)}.webp">
            `
        }

        return TimeTableHTML;
    }

    carsHTML(status){
        const finalResult = this.race.finalResult;
        const grid = this.race.grid;

        let TimeTableHTML;

        if(status == "start"){
            TimeTableHTML = "";

            TimeTableHTML += `
                <img id="race-status">
            `

            let i = 0;
            grid.forEach(e => {
                let nameCode = e.name.split(" ");

                if(nameCode[1].length >= 3){
                    nameCode = nameCode[1];
                }
                else{
                    nameCode = nameCode[1] + nameCode[2];
                }
                nameCode = nameCode.substring(0,3);
                nameCode = accentsTidy(nameCode).toUpperCase();

                TimeTableHTML += `
                <div id="car-race-${genID(e.name)}">
                    <img src="img/car/${game.drivers[e.name].team}.bmp" onerror="this.src='img/car.png'; this.style='background-color:${game.teams[game.drivers[e.name].team].result_bg_color}'">
                    <p>${nameCode}</p>
                </div>
                `;
            });

            return TimeTableHTML;
        }
        else{
            grid.forEach(e => {
                const el = document.querySelector(`#car-race-${genID(e.name)}`);
                
                let i = 0;
                for(; i < finalResult.length; i++){
                    if(finalResult[i].name == e.name)
                        break;
                }

                if(i != finalResult.length){
                    const max = document.querySelector("#race-cars").offsetHeight - 100;
                    const maxDiff = document.querySelector("#race-cars").offsetWidth - 36;
                    const totalLaps = circuitsData[this.tracks[this.actualRound - 1]].laps;
                    
                    const diff = (finalResult[i].totalTime - finalResult[0].totalTime)*100;
                    const lapMove = max * ((this.race.lap / totalLaps));
                    let leftDiff = (i*15) + Math.pow(diff*2,1.1);

                    if(leftDiff > maxDiff){
                        leftDiff = maxDiff;
                        el.childNodes[3].style.display = "none";
                    }
                    else{
                        el.childNodes[3].style.display = "block";
                    }

                    el.style.top = `${max - (lapMove) + diff}px`;
                    el.style.left = `${leftDiff}px`;
                    el.style.zIndex = `${-i*10}`;
                }
            });

            const el = document.querySelector("#race-status");
            const raceStatus = this.race.condition;

            el.style.display = "block";

            if(raceStatus == "vsc") el.src = "img/vsc_flag.webp";
            else if(raceStatus == "sc")  el.src = "img/sc_flag.webp";
            else if(raceStatus == "" && this.race.safetyCarLaps >= -5)   el.src = "img/green_flag.webp";
            else el.style.display = "none";
        }
    }

    RunRaceSimulation(){
        if(this.actualRound > this.tracks.length){
            seasonOverviewUI("end");
            return;
        }

        BeforeRaceUpdateTeamsStats();

        const raceName = this.tracks[this.actualRound-1];
        
        let TimeTableHTML = this.genGridTableHTML();

        let timerInterval;
        const qualifyUI = {
            title: `Classificação GP ${raceName}`,
            html: `
                <div id="time-table">${TimeTableHTML}</div>
            `,
            width: "50em",
            focusConfirm: true,
            allowOutsideClick: false,
            confirmButtonText: "Ok",
            didOpen: () => {
                Swal.disableButtons();
                const timeTable = Swal.getHtmlContainer().querySelector("#time-table")
                const qsection = Swal.getHtmlContainer().querySelector("#actual-qsection")
                let i = 0;

                timerInterval = setInterval(() => {
                    i++;
                    TimeTableHTML = this.genGridTableHTML();
                    timeTable.innerHTML = TimeTableHTML;

                    if(i == 10 && this.race.qSection == "Q1"){
                        this.race.qSection = "Q2";
                        i = 0;
                    }

                    if(i == 10 && this.race.qSection == "Q2"){
                        this.race.qSection = "Q3";
                        i = 0;
                    }

                    if(i == 10 && this.race.qSection == "Q3"){
                        clearInterval(timerInterval);
                        TimeTableHTML = this.genGridTableHTML("end");
                        timeTable.innerHTML = TimeTableHTML;
                        Swal.enableButtons();
                    }
                }, 500);
            },
        }

        const raceUI = {
            title: "GP "+raceName,
            html: `
            <div id="race">
                <div id="race-cars"></div>
                <div id="time-table"></div>
                <div id="podium" style="display: none;"></div>
            </div>
            `,
            width: "100%",
            focusConfirm: true,
            allowOutsideClick: false,
            confirmButtonText: "Ok",
            didOpen: () => {
                Swal.disableButtons();

                const timeTable = Swal.getHtmlContainer().querySelector("#time-table");
                const cars = Swal.getHtmlContainer().querySelector("#race-cars");
                const podium = Swal.getHtmlContainer().querySelector("#podium");

                cars.innerHTML = this.carsHTML("start");

                timerInterval = setInterval(() => {
                    timeTable.innerHTML = this.genRaceTableHTML();
                    this.carsHTML();
                    
                    if(this.race.lap == circuitsData[raceName].laps){
                        clearInterval(timerInterval);
                        Swal.enableButtons();
                    }
                }, localStorage.getItem("gpTycoon-race-sim-speed") ?? 250);
            },
        }
        

        Swal.fire(qualifyUI).
        then(e => Swal.fire(raceUI)).
        then(e => 
        Swal.fire({
            title: `Resultado GP ${raceName}`,
            html: `
            <div id="race">
                <div id="time-table"></div>
                <div id="podium"></div>
            </div>
            `,
            width: "100%",
            focusConfirm: true,
            allowOutsideClick: false,
            confirmButtonText: "Ok",
            didOpen: () => {
                const timeTable = Swal.getHtmlContainer().querySelector("#time-table");
                const podium = Swal.getHtmlContainer().querySelector("#podium");

                timeTable.innerHTML = this.genRaceTableHTML("end");
                podium.innerHTML = this.genRaceTableHTML("podium");
            },
        })).
        then(e => {
            //##############################################################
            // UPDATE STATS

            const grid = this.race.grid;
            grid.forEach(e => {
                game.drivers[e.name].gps++;
            });

            const finalResult = this.race.finalResult;

            game.drivers[grid[0].name].poles++;
            game.drivers[finalResult[0].name].wins++;
            game.drivers[finalResult[0].name].podiums++;
            game.drivers[finalResult[1].name].podiums++;
            game.drivers[finalResult[2].name].podiums++;

            //##############################################################

            this.results[raceName] = this.race.positions;
            this.actualRound++;

            UpdateAfterRace();
            genTeamHTML();

            this.race = {
                grid: {},
                qSection: "Q1",
                qDrivers: [],

                raceDrivers: [],
                finalResult: [],
                positions: [],
                condition: "",
                safetyCarLaps: 0,
    
                retires: [],
                rain: 0,
                lap: 0,
                simTick: 0,
            }
        });
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