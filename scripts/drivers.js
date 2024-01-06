import { getCountryEthnicity, getRandomCountry } from "../data/countryRanking.js";
import { generateName } from "../data/nameData.js";
import { game } from "./game.js"
import { rand, rollDice } from "./utils.js"

export function getSalary(driver){
    const ability = Math.pow((driver.speed*0.5 + driver.pace*0.5)/100, 2);
    let salary = ((Math.pow(ability*1.1, 6)) + (Math.pow(10, driver.titles/10) * 0.025)) * (ability*2);
    salary = salary.toFixed(2);
    return salary;
}

function genDriver(){
    let name = "";
    let country = "";
    let gender = "";

    do {
        const r = rand(0,100);
        if(r < 95) gender = "male"
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
    driver.careerPeak = rollDice("3d6+18");
    driver.experience = 0;
    driver.titles = 0;
    driver.gps = 0;
    driver.wins = 0;
    driver.podiums = 0;
    driver.poles = 0;
    driver.team = "";
    driver.status = "";
    driver.contractRemainingYears = 0;
    //driver.image = `generic/${rand(0,9)}`;

    const ethnicityData = getCountryEthnicity(country);

    driver.image = `generic/${ethnicityData.ethnicity}/${gender}${rand(0, ethnicityData[gender+"Imgs"])}`;

    driver.salary = getSalary(driver);

    if(gender = "male") gender = "Male";
    if(gender = "female") gender = "Female";
    driver.gender = gender;

    game.drivers[name] = driver;
}

export function startDriversStats(){

    for(let i = Object.keys(game.drivers).length; i < 60; i++) {
        genDriver();
    }

    for(const d in game.drivers){
        const driver = game.drivers[d];
        
        driver.contractInterest = [];
        if(!driver.gender) driver.gender = "M";
        if(!driver.image) driver.image = driver.name;
        if(!driver.newTeam) driver.newTeam = "";
        if(!driver.newStatus) driver.newStatus = "";
        if(!driver.newContractRemainingYears) driver.newContractRemainingYears = -1;
        if(!driver.contractRemainingYears) driver.contractRemainingYears = 0;
        if(!driver.years_in_f1) driver.years_in_f1 = 0;
        if(!driver.experience) driver.experience = 0;
        if(!driver.titles) driver.titles = 0;
        if(!driver.gps) driver.gps = 0;
        if(!driver.wins) driver.wins = 0;
        if(!driver.podiums) driver.podiums = 0;
        if(!driver.poles) driver.poles = 0;
        if(!driver.team) driver.team = "";
        if(!driver.status) driver.status = "";
        if(!driver.speed) driver.speed = rollDice("10d10+30");
        if(!driver.pace) driver.pace = rollDice("10d10+30");
        if(!driver.constancy) driver.constancy = rollDice("10d10+30");
        if(!driver.condition) driver.condition = "racing";

        if(driver.speed > 100) driver.speed = 100;
        if(driver.pace > 100) driver.pace = 100;
        if(driver.constancy > 100) driver.constancy = 100;

        if(driver.contractRemainingYears > 0){
            if(driver.status == "1º Piloto")
                game.teams[driver.team].new1driver = driver.name;
            if(driver.status == "2º Piloto")
                game.teams[driver.team].new2driver = driver.name;
            if(driver.status == "Piloto de Testes")
                game.teams[driver.team].newTdriver = driver.name;
        }

        if(driver.years_in_f1 > 10) driver.years_in_f1 = 10;
        driver.experience = Math.round(driver.years_in_f1*10 + driver.gps/5 + driver.titles*10);
        if(driver.experience > 100) driver.experience = 100;
        delete driver.years_in_f1;

        driver.motivation = rollDice("5d20+30");
        if(driver.motivation > 100) driver.motivation = 100;

        if(!driver.careerPeak) driver.careerPeak = rollDice("3d6+20");

        driver.salary = getSalary(driver);
    }
};

function driverSkillUpdate(driver){
    if(driver.age > driver.careerPeak){
        let rate = (driver.careerPeak - driver.age) / 10;

        driver.speed = Math.round(driver.speed * (1 - (rollDice("2d4+0") / (100 + rate))));
        driver.pace = Math.round(driver.pace * (1 - (rollDice("2d4+0") / (100 + rate))));
    }
    else if(driver.experience < 100){
        const timeToCareerPeak = Math.min(2,((driver.careerPeak - driver.age) / 10));
        const experience = (1 - (driver.experience / 100));
        const ability = (driver.speed * driver.pace) / 10000;

        let rate = Math.round((timeToCareerPeak * experience * ability)*100);

        if(rand(0, 100) < rate){
            driver.speed += rollDice("3d2+-3");
            driver.pace += rollDice("3d2+-3");
        }
    }

    if(driver.speed > 100) driver.speed = 100;
    if(driver.pace > 100) driver.pace = 100;
}

export function YearUpdateDriversStats(){
    for(const d in game.drivers){
        const driver = game.drivers[d];
        driver.age++;
        driver.motivation = rollDice("5d20+30");
        if(driver.motivation > 100) driver.motivation = 100;

        if(driver.team) driver.experience += 10;
        if(driver.experience > 100) driver.experience = 100;

        if(driver.newSalary) driver.salary = driver.newSalary;
        else driver.salary = getSalary(driver);

        if(driver.newContractRemainingYears > 0){
            driver.team = driver.newTeam;
            driver.status = driver.newStatus;
            driver.contractRemainingYears = driver.newContractRemainingYears;

            if(driver.newTeam == "Aposentadoria"){
                game.drivers[d].condition = "retired";
            }

            driver.newTeam = "";
            driver.newStatus = "";
            driver.newContractRemainingYears = 0;
        }
        else if(driver.contractRemainingYears <= 0){
            driver.team = "";
            driver.status = "";
        }
        driver.contractRemainingYears--;

        if(driver.contractRemainingYears <= 0 && driver.age > driver.careerPeak+10){
            driver.newTeam = "Aposentadoria";
            driver.newContractRemainingYears = 1;
        }

        driverSkillUpdate(driver);
    }

    for(let i = Object.keys(game.drivers).length; i < 50; i++) {
        genDriver();
    }
}