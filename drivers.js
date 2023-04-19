import { game } from "./game.js"
import { rollDice } from "./utils.js"

export function startDriversStats(){
    for(const d in game.drivers){
        const driver = game.drivers[d];

        if(driver.experience > 10) driver.experience = 10;
        driver.experience = Math.round((driver.experience/10)*100);

        driver.motivation = rollDice("5d20+30");
        if(driver.motivation > 100) driver.motivation = 100;
    }

    updateStats();
};

function updateStats(){
    for(const d in game.drivers){
        const driver = game.drivers[d];

        const ability = Math.pow((driver.speed*0.5 + driver.pace*0.5)/100, 2);
        driver.salary = ((Math.pow(ability*1.1, 6)) + (Math.pow(10, driver.titles/10) * 0.025)) * (ability*2);
        if(driver.function == "Piloto de Testes"){
            driver.salary /= 4;
        }
        driver.salary = driver.salary.toFixed(2);
    }
};

function newYearUpdateStats(){
    for(const d in game.drivers){
        const driver = game.drivers[d];
        driver.age++;
        driver.motivation = rollDice("5d20+30");
        if(driver.motivation > 100) driver.motivation = 100;
    }
}