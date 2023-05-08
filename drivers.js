import { game } from "./game.js"
import { rollDice } from "./utils.js"

export function startDriversStats(){
    for(const d in game.drivers){
        const driver = game.drivers[d];
        
        driver.contractInterest = [];
        if(driver.newTeam == undefined)
            driver.newTeam = "";

        if(driver.contractRemainingYears > 0){
            if(driver.status == "1º Piloto")
                game.teams[driver.team].new1driver = driver.name;
            if(driver.status == "2º Piloto")
                game.teams[driver.team].new2driver = driver.name;
            if(driver.status == "Piloto de Testes")
                game.teams[driver.team].newTdriver = driver.name;
        }

        if(driver.experience > 10) driver.experience = 10;
        driver.experience = Math.round((driver.experience/10)*100);

        driver.motivation = rollDice("5d20+30");
        if(driver.motivation > 100) driver.motivation = 100;

        const ability = Math.pow((driver.speed*0.5 + driver.pace*0.5)/100, 2);
        driver.salary = ((Math.pow(ability*1.1, 6)) + (Math.pow(10, driver.titles/10) * 0.025)) * (ability*2);
        driver.salary = driver.salary.toFixed(2);
    }
};

export function YearUpdateDriversStats(){
    for(const d in game.drivers){
        const driver = game.drivers[d];
        driver.age++;
        driver.motivation = rollDice("5d20+30");
        if(driver.motivation > 100) driver.motivation = 100;

        driver.experience += 10;
        if(driver.titles > 1) driver.experience = 100;
        if(driver.experience > 100) driver.experience = 100;

        if(driver.newSalary) driver.salary = driver.newSalary;

        if(driver.contractRemainingYears == 0){
            driver.team = driver.newTeam;
            driver.status = driver.newStatus;
            driver.contractRemainingYears = driver.newContractRemainingYears;

            driver.newTeam = "";
            driver.newStatus = "";
            driver.newContractRemainingYears = 0;
        }
        driver.contractRemainingYears--;
    }
}