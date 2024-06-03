import { circuitsData } from "../../data/circuits.js";
import { Championship } from "../championship.js";
import { game } from "../game.js";
import { rand } from "../utils.js";

export const QualifySim = () => {
    let grid = {};
    const oldGrid = Championship.race.grid;
    
    const raceName = Championship.tracks[Championship.actualRound-1];
    let poleTime = 0;
    let poleName = "";

    if(Championship.race.qSection == "Q2" && Championship.race.qDrivers.length == 0){
        for(let i = 0; i < 15; i++) {
            Championship.race.qDrivers.push(oldGrid[i].name);
            oldGrid[i].time = 999;
        }
    }

    if(Championship.race.qSection == "Q3" && Championship.race.qDrivers.length == 15){
        Championship.race.qDrivers = [];
        for(let i = 0; i < 10; i++) {
            Championship.race.qDrivers.push(oldGrid[i].name);
            oldGrid[i].time = 999;
        }
    }

    for(const d in Championship.drivers){
        const driverName = Championship.drivers[d];

        if(Championship.race.qSection != "Q1" && !Championship.race.qDrivers.includes(driverName)){
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

        if(Championship.race.qSection == "Q1") divider = 59;
        if(Championship.race.qSection == "Q2") divider = 59.5;
        if(Championship.race.qSection == "Q3") divider = 60;

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
    Championship.race.grid = grid;
}