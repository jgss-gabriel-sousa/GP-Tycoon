import { circuitsData } from "../../data/circuits.js";
import { Championship } from "../championship.js";
import { game } from "../game.js";
import { accentsTidy, genID } from "../utils.js";

export const VisualRaceSim = (status) => {
    const isVisualRaceSimDisabled = !game.settings["visual-race-simulation"];

    if(isVisualRaceSimDisabled){
        if(status == "start"){
            document.querySelector("#race-cars").style.display = "none";
        }
        return;
    }

    const finalResult = Championship.race.finalResult;
    const grid = Championship.race.grid;
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
                        onerror="Championship.onerror=null;Championship.src='img/car.png'; Championship.style='background-color:${bgColor}'">
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
                const totalLaps = circuitsData[Championship.tracks[Championship.actualRound - 1]].laps;
                
                const diff = (finalResult[i].totalTime - finalResult[0].totalTime)*100;
                const lapMove = max * ((Championship.race.lap / totalLaps));

                if(!el.classList.contains("car-transition") && game.settings["race-simulation-speed"] >= 150)
                    el.classList.add("car-transition");

                el.style.left = `${(max - (max - (lapMove) + diff)) + 40}px`;
                el.style.top = `${25 + (i*20)}px`;
                el.style.zIndex = `${(i*10) + Championship.race.lap}`;

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

        const raceStatus = Championship.race.condition;
        raceStatusImage.style.display = "block";

        if (raceStatus === "vsc") raceStatusImage.src = "img/vsc_flag.webp";
        else if (raceStatus === "sc") raceStatusImage.src = "img/sc_flag.webp";
        else if (raceStatus === "" && Championship.race.safetyCarLaps >= -5) raceStatusImage.src = "img/green_flag.webp";
        else raceStatusImage.style.display = "none";
    }
}