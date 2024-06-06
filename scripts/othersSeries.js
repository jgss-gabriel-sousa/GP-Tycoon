import { publishNews } from "../views/viewNews.js";
import { game } from "./game.js";
import { rand } from "./utils.js";

const championshipTiers = {
    "Fórmula 2": {
        tier: 3,
    },
    "Fórmula 3": {
        tier: 5,
        next: "Fórmula 2"
    },
    "FRECA": {
        tier: 6,
        next: "Fórmula 3"
    },
    "F1 Academy": {
        tier: 6,
    },
    "Fórmula 4": {
        tier: 7,
        next: "FRECA"
    },
    "Kart": {
        tier: 8,
        next: "Fórmula 4"
    },
    "Rally": {
        tier: 8,
        next: "Fórmula 4"
    },

    "IndyCar": {
        tier: 2,
    },
    "Indy NXT": {
        tier: 4,
        next: "IndyCar"
    },
    "USF PRO2000": {
        tier: 6,
        next: "Indy NXT"
    },

    "WEC": {
        tier: 2,
    },
    "Fórmula E": {
        tier: 2,
    },
    "Super Fórmula": {
        tier: 3,
    },
    "Super Fórmula Lights": {
        tier: 6,
        next: "Super Fórmula"
    },
}


export function simulateOthersSeries(){
    game.othersSeries = {}

    for(const d in game.drivers){
        const driver = game.drivers[d];
        
        if(driver.currentSeries){
            if(!game.othersSeries.hasOwnProperty(driver.currentSeries)){
                game.othersSeries[driver.currentSeries] = {
                    name: driver.currentSeries,
                    drivers: [d],
                };
            }
            else{
                game.othersSeries[driver.currentSeries].drivers.push(d);
            }
        }
    }

    for(const c in game.othersSeries) {
        const championship = game.othersSeries[c];
        let ranking = [];

        for(let j = 0; j < championship.drivers.length; j++){
            const driverName = championship.drivers[j];
            const result = rand(0, game.drivers[driverName].speed) * rand(0, game.drivers[driverName].pace) * rand(game.drivers[driverName].constancy, 100) * rand(0,100);

            ranking.push([driverName, result]);
        }
        
        ranking = ranking.sort((a, b) => b[1] - a[1]);
        championship.ranking = ranking;
    }

    console.log(game.othersSeries)
    
    publishNews("Other Series Results", [game.othersSeries]);

    for(const c in game.othersSeries) {
        const championship = game.othersSeries[c];
        const maxPromotedDrivers = Math.max(Math.round(championship.ranking.length*0.25), 1);

        for(let i = 0; i < maxPromotedDrivers && i < championship.ranking.length; i++){
            const driverName = championship.ranking[i][0];
            const driver = game.drivers[driverName];
            driver.currentSeries = getNextSeries(driverName, driver.currentSeries, i);
        }
    }
}

function getNextSeries(driverName, actualSeries, actualPosition){
    //console.log(driverName+"-"+actualSeries)
    const actualTier = championshipTiers[actualSeries].tier;

    if(championshipTiers[actualSeries].next){
        return championshipTiers[actualSeries].next;
    }
    else{
        const options = [];

        for(const c in championshipTiers){
            const championship = championshipTiers[c];

            if(championship.tier <= actualTier){
                if(championship.tier == actualTier && rand(0,100) < 20){
                    options.push(c);
                }
            }
        }

        return options[rand(0, options.length)];
    }
}