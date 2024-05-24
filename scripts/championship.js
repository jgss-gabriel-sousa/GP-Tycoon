import { genTeamHTML } from "./main.js";
import { circuitsData } from "../data/circuits.js";
import { game, YearUpdate } from "./game.js";
import { BeforeRaceUpdateTeamsStats, UpdateTeamAfterRace } from "./teams.js";
import { seasonOverviewUI } from "./ui.js";
import { driversData } from "../data/driversData.js";
import { teamsData } from "../data/teamsData.js";
import { accentsTidy, genID, rand, rollDice } from "./utils.js";
import { simulateOthersSeries } from "./othersSeries.js";

const SIMULATION_TICKS = 3;

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
            //this.tracks = ["Bahrein"];
            
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
                    driverEngine: "Red Bull PowerTrains",
        
                    constructorChampion: "Red Bull",
                    constructorCountry: "AT",
                    constructorEngine: "Red Bull PowerTrains",
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
                log: [],
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

            let speed = game.drivers[driverName].speed;
            let constancyVar = rand(0, 100-game.drivers[driverName].constancy);
            speed -= constancyVar;
            speed /= 100;

            const driverF = (1 - speed) * (1 + (Math.random() * 1 - 0.75));
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
            
            if(Math.floor(Math.random() * 100) < circuitsData[raceName].rainChance) 
                this.race.rain = true;
    
            let i = 0;
            for(const k in grid) {
                raceDrivers.push({
                    name: grid[k].name,
                    actualLap: 0,
                    lapTime: 0,
                    totalTime: i++ / 60,
                    racing: true,
                    tireLap: 0,
                    tire: "M",
                    tireStrategy: "",
                });

                if(!this.race.rain){
                    const strategy = Math.floor(Math.random() * 100);

                    if(strategy > 50) raceDrivers[i-1].tire = "S";
                    else if(strategy < 25 && circuitsData[raceName].laps >= 60) raceDrivers[i-1].tire = "H";
                    else raceDrivers[i-1].tire = "M";
                }
                else{
                    raceDrivers[i-1].tire = "W";
                }

                raceDrivers[i-1].tireStrategy = raceDrivers[i-1].tire;
            }
        }

        let d = 0;
        let newRaceCondition = "";

        for(; d < raceDrivers.length; d++) {
            if(!raceDrivers[d].racing)  continue;

            const base = circuitsData[raceName].baseLapTime;
            const driverName = this.drivers[d];
            const team = game.drivers[driverName].team;
            const car = game.teams[team].car;
        
            const circuit = circuitsData[raceName];
            const circuitCorners = circuit.corners/100;
            const circuitStraights = circuit.straights/100;
            
            let rainF = 1;

            if(rain)
                rainF = 0.5;

            const randomF = 1;// + (Math.random() * (1*(1/rainF)) - 0.5*(1/rainF));
            
            let pace = game.drivers[driverName].pace;
            let constancyVar = rand(0, 100-game.drivers[driverName].constancy);
            pace -= constancyVar;
            pace /= 100;

            const driverF = (1 - pace) * randomF;

            const cornersF = (1 - (car.corners/100)) * randomF * circuitCorners * rainF;
            const straightF = (1 - (car.straights/100)) * randomF * circuitStraights * rainF;
            const carFactor = cornersF * straightF;
            
            let tireDivider = 0;
            let tire = raceDrivers[d].tire;

            if(tire == "H") tireDivider = 0;
            if(tire == "M") tireDivider = 0.1;
            if(tire == "S") tireDivider = 0.2;
            if(tire == "W") tireDivider = -0.2;

            let lapTime = (base/(55+tireDivider)) + (Math.pow(driverF,1) / (base*3*rainF));

            //TIRE CHANGE
            const lapsRemaining = (circuit.laps - Math.floor(raceDrivers[d].actualLap/SIMULATION_TICKS));
            const tireLap = raceDrivers[d].tireLap;

            function changeTireTo(t){
                raceDrivers[d].tire = t;
                raceDrivers[d].tireStrategy = raceDrivers[d].tireStrategy + t;
            }

            function changeTire(){
                let pitVar = (Math.floor(Math.random() * 6) - 2) * (1/60);

                if(Math.random() * 100 == 1){
                    pitVar *= Math.floor(Math.random() * 5)+1;
                    this.race.log.push(raceDrivers[d].name+" teve problemas no pit");
                } 

                lapTime += 0.33 + pitVar;
                raceDrivers[d].tireLap = 0;
                
                const tireStrategy = raceDrivers[d].tireStrategy;
                const ST = SIMULATION_TICKS;

                const rand = Math.random() * 100;

                //1-STOP
                if(tireStrategy.length == 1){
                    if(tireStrategy[0] == "S") changeTireTo("M");
                    else if(tireStrategy[0] == "M") changeTireTo("S");
                    else if(tireStrategy[0] == "H"){
                        if(lapsRemaining < 20*ST)  changeTireTo("S");
                        else if(lapsRemaining < 40*ST)  changeTireTo("M");
                        else changeTireTo("H");
                    }
                    else if(tireStrategy[0] == "W") changeTireTo("W");
                }
                //2-STOP
                else{
                    if(tireStrategy[0] != tireStrategy[1] && lapsRemaining < 20*ST)
                        changeTireTo("S");
                        
                    else if(tireStrategy[0] != tireStrategy[1] && lapsRemaining < 40*ST)
                        changeTireTo("M");

                    else if(tireStrategy[0] == "W")
                        changeTireTo("W");

                    else if(Array.from(tireStrategy).every(char => char === "H") && lapsRemaining <= 15*ST)
                        changeTireTo("S");

                    else
                        changeTireTo("H");
                }
            }
            
            const tireStrategy = raceDrivers[d].tireStrategy;

            if(this.race.condition == "sc" && tireLap > 10*SIMULATION_TICKS){
                changeTire();
            }
            if((lapsRemaining <= 15) && tireStrategy[0] != "W" && Array.from(tireStrategy).every(char => char === tireStrategy[0])){
                changeTire();
            }
            if(tire == "H" && tireLap > 60*SIMULATION_TICKS)  changeTire();
            if(tire == "M" && tireLap > 40*SIMULATION_TICKS)  changeTire();
            if(tire == "S" && tireLap > 20*SIMULATION_TICKS)  changeTire();
            if(tire == "W" && tireLap > 40*SIMULATION_TICKS)  changeTire();

            //

            if(d > 0){
                /*
                const diff = (raceDrivers[d].totalTime+lapTime) - raceDrivers[d-1].totalTime;
                
                if(diff <= 0.025 && diff >= 0){
                    const defender = game.drivers[raceDrivers[d-1].name];
                    const attacker = game.drivers[raceDrivers[d].name];

                    const overtakeRoll = rand(0, 1000);
                    let overtakeDC = defender.speed - attacker.speed;
                    
                    if(overtakeDC < 0){
                        overtakeDC = 500 + (Math.pow(overtakeDC, 1.5) * 20);
                    }

                    Math.round(overtakeDC);

                    if(overtakeDC < 250) overtakeDC = 250;
                    if(overtakeDC > 950) overtakeDC = 950;

                    console.log(`${defender.name} ultrapassa ${attacker.name}`)

                    if(overtakeRoll <= overtakeDC){
                        lapTime = raceDrivers[d-1].lapTime-diff-0.01;
                    }
                    else{
                        lapTime += 0.015;
                    }
                }*/
            }

            const failureChanceRoll = Math.floor(Math.random() * (4000 / (circuit.failureMulti ?? 1)));
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

            const crashChanceRoll = Math.floor(Math.random() * (18000 / (circuit.crashMulti ?? 1)));
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
                    this.race.log.push(raceDrivers[d]+" se acidentou e gerou "+this.race.safetyCarLaps+" voltas de safety car");
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
            
            if(this.race.condition != "sc" && this.race.condition != "vsc")
                raceDrivers[d].tireLap++;

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

        if(this.race.simTick >= SIMULATION_TICKS){
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
                    TimeTableHTML += `<td class="${classPos}">+${this.timeConvert(Number(finalResult[k].totalTime) - Number(finalResult[0].totalTime))}</td>`
                }
                else{
                    TimeTableHTML += `<td class="${classPos}">+${this.timeConvert(Number(finalResult[k].totalTime) - Number(finalResult[k-1].totalTime))}</td>`
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
            <img class="podium-img" src="img/drivers/${game.drivers[finalResult[1].name].image}.webp" onerror="this.onerror=null;this.src='img/drivers/generic.webp';">
            <img class="podium-img" src="img/drivers/${game.drivers[finalResult[0].name].image}.webp" onerror="this.onerror=null;this.src='img/drivers/generic.webp';">
            <img class="podium-img" src="img/drivers/${game.drivers[finalResult[2].name].image}.webp" onerror="this.onerror=null;this.src='img/drivers/generic.webp';">
            <img class="podium-img" src="img/flags/${accentsTidy(game.drivers[finalResult[0].name].country)}.webp">
            `
        }

        return TimeTableHTML;
    }

    carsHTML(status){
        const isVisualRaceSimDisabled = !game.settings["visual-race-simulation"];

        if(isVisualRaceSimDisabled){
            if(status == "start"){
                document.querySelector("#race-cars").style.display = "none";
            }
            return;
        }

        const finalResult = this.race.finalResult;
        const grid = this.race.grid;
        const raceCarsContainer = document.querySelector("#race-cars");
        const raceStatusImage = document.querySelector("#race-status");

        if(status == "start"){
            let TimeTableHTML = `<img id="race-status">`;

            grid.forEach(e => {
                const team = game.drivers[e.name].team;
                const bgColor = game.teams[team].result_bg_color || "#ffffff";
                let nameCode = e.name.split(" ");

                if(nameCode[1].length >= 3){
                    nameCode = nameCode[1];
                }
                else{
                    nameCode = nameCode[1] + nameCode[2];
                }
                nameCode = nameCode.replace(/['’]/g, '');
                nameCode = nameCode.substring(0,3);
                nameCode = accentsTidy(nameCode).toUpperCase();

                TimeTableHTML += `
                    <div id="car-race-${genID(e.name)}">
                        <p>${nameCode}</p>
                        <img class="car-icon" src="img/car/${team}.bmp" 
                            onerror="this.onerror=null;this.src='img/car.png'; this.style='background-color:${bgColor}'">
                    </div>
                `;
            });

            return TimeTableHTML;
        }
        else{
            const driversList = [];

            finalResult.forEach(d => {
                if(!driversList.includes(d.name)){
                    driversList.push(d.name);
                }
            });
            grid.forEach(d => {
                if(!driversList.includes(d.name)){
                    driversList.push(d.name);
                }
            });

            driversList.forEach(e => {
                const driverName = e;
                const el = document.querySelector(`#car-race-${genID(driverName)}`);

                let i = 0;
                for(; i < finalResult.length; i++){
                    if(finalResult[i].name == driverName)
                        break;
                }

                if(i != finalResult.length){
                    const max = document.querySelector("#race-cars").offsetHeight - 155;
                    const totalLaps = circuitsData[this.tracks[this.actualRound - 1]].laps;
                    
                    const diff = (finalResult[i].totalTime - finalResult[0].totalTime)*100;
                    const lapMove = max * ((this.race.lap / totalLaps));

                    if(!el.classList.contains("car-transition") && game.settings["race-simulation-speed"] >= 150)
                        el.classList.add("car-transition");

                    el.style.left = `${(max - (max - (lapMove) + diff)) + 40}px`;
                    el.style.top = `${25 + (i*20)}px`;
                    el.style.zIndex = `${(i*10) + this.race.lap}`;

                    let tire = "";

                    if(finalResult[i].tire == "H") tire = "tire-hard";
                    if(finalResult[i].tire == "M") tire = "tire-medium";
                    if(finalResult[i].tire == "S") tire = "tire-soft";
                    if(finalResult[i].tire == "W") tire = "tire-wet";

                    const elP = document.querySelector(`#car-race-${genID(driverName)} > p`);
                    elP.classList = "";
                    elP.classList.add(tire);
                }
                else{
                    const racingDrivers = [];
                    const allDrivers = [];

                    for(let i = 0; i < finalResult.length; i++){
                        racingDrivers.push(finalResult[i].name);
                    }
                    for(let i = 0; i < grid.length; i++){
                        allDrivers.push(grid[i].name);
                    }
                    const retiredPilots = allDrivers.filter(valor => !racingDrivers.includes(valor));

                    for(let i = 0; i < retiredPilots.length; i++){
                        if(!document.querySelector(`#car-race-${genID(retiredPilots[i])}`).classList.contains("retired")){
                            document.querySelector(`#car-race-${genID(retiredPilots[i])}`).classList.add("retired");
                        }
                    }
                }
            });

            const raceStatus = this.race.condition;
            raceStatusImage.style.display = "block";

            if (raceStatus === "vsc") raceStatusImage.src = "img/vsc_flag.webp";
            else if (raceStatus === "sc") raceStatusImage.src = "img/sc_flag.webp";
            else if (raceStatus === "" && this.race.safetyCarLaps >= -5) raceStatusImage.src = "img/green_flag.webp";
            else raceStatusImage.style.display = "none";
        }
    }

    RunRaceSimulation(){
        if(this.actualRound > this.tracks.length){
            seasonOverviewUI("end");
            simulateOthersSeries();
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
                }, game.settings["race-simulation-speed"]);
            },
        }

        const raceUI = {
            title: "GP "+raceName,
            html: `
            <div id="race">
                <div id="buttons-raceSim">
                    <button id="change-tire">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16.5 22c2.485 0 4.5-4.477 4.5-10S18.985 2 16.5 2M12 12c0 5.523-2.015 10-4.5 10S3 17.523 3 12S5.015 2 7.5 2S12 6.477 12 12ZM7.5 2h9m-9 20h9"/><path stroke-linecap="round" d="M9 12c0 3.314-.672 6-1.5 6S6 15.314 6 12s.672-6 1.5-6S9 8.686 9 12Zm0 0H8" opacity="0.5"/></g></svg>
                    </button>

                    <button id="driving-style">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.994 21q-1.852 0-3.491-.707q-1.64-.708-2.864-1.932t-1.932-2.864Q3 13.857 3 12.007q0-1.875.71-3.512q.711-1.637 1.93-2.856q1.218-1.218 2.862-1.928Q10.147 3 11.994 3q1.87 0 3.509.71q1.64.711 2.858 1.93q1.218 1.218 1.928 2.855q.711 1.637.711 3.511q0 1.852-.71 3.494q-.711 1.642-1.93 2.86q-1.218 1.219-2.855 1.93q-1.637.71-3.511.71M12 16.5q1.385 0 2.723.39q1.339.389 2.492 1.156q1.343-1.13 2.064-2.71Q20 13.755 20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 1.76.718 3.34q.719 1.581 2.067 2.706q1.153-.767 2.492-1.157Q10.615 16.5 12 16.5m.003 1q-1.143 0-2.234.308q-1.09.307-2.08.884q.951.635 2.053.971q1.101.337 2.26.337q1.158 0 2.258-.337q1.1-.336 2.052-.97q-.99-.578-2.078-.885q-1.088-.308-2.231-.308M7 10.808q.329 0 .568-.24q.24-.24.24-.568q0-.329-.24-.568q-.24-.24-.568-.24q-.329 0-.568.24q-.24.24-.24.568q0 .329.24.568q.24.24.568.24m3-3q.329 0 .568-.24q.24-.24.24-.568q0-.329-.24-.568q-.24-.24-.568-.24q-.329 0-.568.24q-.24.24-.24.568q0 .329.24.568q.24.24.568.24m7 3q.329 0 .568-.24q.24-.24.24-.568q0-.329-.24-.568q-.24-.24-.568-.24q-.329 0-.568.24q-.24.24-.24.568q0 .329.24.568q.24.24.568.24M12 13.5q.633 0 1.066-.434q.434-.433.434-1.066q0-.325-.129-.609t-.348-.514l1.58-3.977q.08-.188-.006-.384t-.277-.274q-.18-.079-.374.002q-.194.08-.27.28L12.059 10.5q-.635-.029-1.096.409q-.462.437-.462 1.091q0 .633.434 1.066q.433.434 1.066.434m0 4"/></svg>
                    </button>

                    <button id="play-anthem">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c-1 5-7 5-7 5H4c-1 0-2-1-2-1H1v4h1s1-1 2-1h.3c-.2.3-.3.6-.3 1v2c0 1.1.9 2 2 2h1v1h2v-1h1v1h2v-1h1v1h2v-1h1c1.1 0 2-.9 2-2v-2c0-.1 0-.3-.1-.4c1.7.6 3.5 1.8 4.1 4.4h1V6zM6 16.5c-.3 0-.5-.2-.5-.5v-2c0-.3.2-.5.5-.5h1v3zm3 0v-3h1v3zm3 0v-3h1v3zm4.5-.5c0 .3-.2.5-.5.5h-1v-3h1c.3 0 .5.2.5.5zM9 10H7V9h2zm3 0h-2V9h2zm3 0h-2V9h2z"/></svg>
                    </button>
                </div>

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

                let tickRate = game.settings["race-simulation-speed"];
                
                if(!game.settings["visual-race-simulation"])
                    tickRate /= 4;

                timerInterval = setInterval(e => {
                    timeTable.innerHTML = this.genRaceTableHTML();
                    this.carsHTML();

                    if(this.race.lap == circuitsData[raceName].laps){
                        clearInterval(timerInterval);
                        Swal.enableButtons();
                    }
                }, tickRate);
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

            UpdateTeamAfterRace();
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
                log: [],
            }
        });
    }

    createStandings(){
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
                if(pos < 3){
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