import { circuitsData } from "../../data/circuits.js";
import { Championship } from "../championship.js";
import { game } from "../game.js";
import { rand, rollDice } from "../utils.js";

const SIMULATION_TICKS = 3;

export const RaceSim = (status) => {
    const raceDrivers = Championship.race.raceDrivers;
    const retires = Championship.race.retires;
    const meanLaptime = Championship.race.meanLaptime;
    const lap = Championship.race.lap;
    const rain = Championship.race.rain;

    const raceName = Championship.tracks[Championship.actualRound-1];

    if(status == "start"){
        let grid = Championship.race.grid;
        let aux = {};

        for (let i = 0; i < grid.length; i++) {
            aux[grid[i].name] = grid[i];
        }
        grid = aux;
        
        if(Math.floor(Math.random() * 100) < circuitsData[raceName].rainChance) 
            Championship.race.rain = true;

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

            if(!Championship.race.rain){
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
        const driverName = Championship.drivers[d];
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
                Championship.race.log.push(raceDrivers[d].name+" teve problemas no pit");
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

        if(Championship.race.condition == "sc" && tireLap > 10*SIMULATION_TICKS){
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
                Championship.race.safetyCarLaps = rollDice("2d4+0");
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

        if(Championship.race.condition == "sc")
            crashChance = -1;

        if(retires.length < (raceDrivers.length-3) && crashChanceRoll <= crashChance && crashRoll >= driverEscape){
            raceDrivers[d].racing = false;

            if(Math.floor(Math.random() * 100) < 100){
                newRaceCondition = "sc";
                Championship.race.safetyCarLaps = rollDice("3d4+0");
                Championship.race.log.push(raceDrivers[d]+" se acidentou e gerou "+Championship.race.safetyCarLaps+" voltas de safety car");
            }

            retires.unshift({
                name: raceDrivers[d].name,
                lap: lap+1,
                reason: "Acidente",
            })
            continue;
        }

        if(Championship.race.condition == "vsc" || Championship.race.condition == "sc"){
            lapTime = raceDrivers[0].lapTime;
        }

        raceDrivers[d].lapTime = lapTime;
        raceDrivers[d].totalTime += lapTime;
        raceDrivers[d].actualLap++;
        
        if(Championship.race.condition != "sc" && Championship.race.condition != "vsc")
            raceDrivers[d].tireLap++;

        if(Championship.race.condition == "sc"){
            raceDrivers[d].totalTime = raceDrivers[0].totalTime+(d/60);
        }
    }

    //######################################################################

    let finalResult = raceDrivers.sort((a, b) => a.totalTime - b.totalTime);

    const aux = [];
    Championship.race.positions = [];
    for (let i = 0; i < finalResult.length; i++) {
        if(finalResult[i].racing){
            Championship.race.positions.push(finalResult[i].name);
            aux.push(finalResult[i]);
        }
    }
    finalResult = aux;
    Championship.race.finalResult = finalResult;

    Championship.race.simTick++;

    if(newRaceCondition != ""){
        Championship.race.condition = newRaceCondition;
    }

    if(Championship.race.simTick >= SIMULATION_TICKS){
        Championship.race.lap++;
        Championship.race.simTick = 0;
        Championship.race.safetyCarLaps--;

        if(Championship.race.condition == "sc" && Championship.race.safetyCarLaps <= 0){
            Championship.race.condition = "";
        }
        if(Championship.race.condition == "vsc" && Championship.race.safetyCarLaps <= 0){
            Championship.race.condition = "";
        }
    }
}