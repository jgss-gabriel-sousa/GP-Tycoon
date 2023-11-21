import { getRandomCountry } from "./data/countryRanking.js";
import { generateName } from "./data/nameData.js";
import { game } from "./game.js"
import { rand, rollDice } from "./utils.js"

function genDriver(){
    let name = "";
    let country = "";

    do {
        const r = rand(0,100);
        let gender = "";
        if(r < 90) gender = "male"
        else gender = "female"

        country = getRandomCountry();
        name = generateName(country, gender);

    } while(game.drivers.hasOwnProperty(name));

    let driver = {};
    driver.name = name;
    driver.country = country
    driver.age = rollDice("8d4+0");
    if(driver.age < 18) driver.age = 18;
    driver.speed = rollDice("5d8+60");
    driver.pace = rollDice("5d8+60");
    driver.experience = 0;
    driver.titles = 0;
    driver.gps = 0;
    driver.wins = 0;
    driver.podiums = 0;
    driver.poles = 0;
    driver.team = "";
    driver.status = "";
    driver.contractRemainingYears = -1;

    game.drivers[name] = driver;
}


export function startDriversStats(){

    for(let i = Object.keys(game.drivers).length; i < 50; i++) {
        genDriver();
    }

    for(const d in game.drivers){
        const driver = game.drivers[d];
        
        driver.contractInterest = [];
        if(driver.newTeam == undefined) driver.newTeam = "";
        if(driver.newStatus == undefined) driver.newStatus = "";
        if(driver.newContractRemainingYears == undefined) driver.newContractRemainingYears = -1;

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

        if(!driver.careerPeak) driver.careerPeak = rollDice("3d6+18");

        const ability = Math.pow((driver.speed*0.5 + driver.pace*0.5)/100, 2);
        driver.salary = ((Math.pow(ability*1.1, 6)) + (Math.pow(10, driver.titles/10) * 0.025)) * (ability*2);
        driver.salary = driver.salary.toFixed(2);
    }
};

function driverSkillUpdate(driver){
    if(driver.age > driver.careerPeak){
        driver.speed = Math.round(driver.speed * 0.95);
    }
}

export function YearUpdateDriversStats(){
    for(const d in game.drivers){
        const driver = game.drivers[d];
        driver.age++;
        driver.motivation = rollDice("5d20+30");
        if(driver.motivation > 100) driver.motivation = 100;

        if(driver.team) driver.experience += 10;
        if(driver.titles > 1) driver.experience = 100;
        if(driver.experience > 100) driver.experience = 100;

        if(driver.newSalary) driver.salary = driver.newSalary;

        if(driver.newContractRemainingYears > 0){
            driver.team = driver.newTeam;
            driver.status = driver.newStatus;
            driver.contractRemainingYears = driver.newContractRemainingYears;

            console.log(driver.name);

            driver.newTeam = "";
            driver.newStatus = "";
            driver.newContractRemainingYears = 0;
        }
        else if(driver.contractRemainingYears <= 0){
            driver.team = "";
            driver.status = "";
        }
        driver.contractRemainingYears--;

        driverSkillUpdate(driver);
    }
}