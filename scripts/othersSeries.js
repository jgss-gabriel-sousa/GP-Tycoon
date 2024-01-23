import { game } from "./game.js";
import { rand } from "./utils.js";

export function simulateOthersSeries(){
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
        
        ranking.sort((a, b) => b.points - a.points);

        console.log(ranking)
    }
}