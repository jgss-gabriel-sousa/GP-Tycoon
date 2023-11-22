import { blankSpaceRmv, accentsTidy, NumberF, setBarProgress, rollDice, rand } from "./utils.js"
import { changeScreen } from "./screens.js"
import { genTeamHTML } from "./app.js"
import { Championship } from "./championship.js";
import { driversData } from "./data/driversData.js";
import { teamsData } from "./data/teamsData.js";
import { enginesData } from "./data/enginesData.js";
import { engineersData } from "./data/engineersData.js";
import { startDriversStats, YearUpdateDriversStats } from "./drivers.js";
import { selectEngine } from "./ui/selectEngine.js";
import { generateName } from "./data/nameData.js";
import { getRandomCountry } from "./data/countryRanking.js";

export const game = {
    activeScreen: "main-menu",
    uiTeamColors: true,
    team: "Red Bull",
    year: 2023,
    championship: new Championship(),
    drivers: {},
    teams: {},
    engines: {},
    engineers: {},
    contractsFailed: [],
}

function startGame(){
    changeScreen("main-menu");

    if(!localStorage.getItem("gpTycoon-ui-team-colors"))
        localStorage.setItem("gpTycoon-ui-team-colors","true");

    game.drivers = driversData;
    game.teams = teamsData;
    game.engines = enginesData;
    game.engineers = engineersData;
    StartEngStats();
    StartTeamsStats();
    startDriversStats();
} startGame();

function StartEngStats(){
    function genEng(){
        let name = "";
        let country = "";

        do {
            const r = rand(0,100);
            let gender = "";
            if(r < 90) gender = "male"
            else gender = "female"

            country = getRandomCountry();
            name = generateName(country, gender);

        } while(game.engineers.hasOwnProperty(name));

        let eng = {};
        eng.name = name;
        eng.country = country
        eng.age = rollDice("6d8+20");
        eng.aero = rollDice("5d8+60");
        eng.adm = rollDice("5d8+60");
        eng.eng = rollDice("5d8+60");
        eng.salary = Math.round(20 + (Math.pow(1+((eng.aero/100) * (eng.adm/100) * (eng.eng/100)), 10)));
        eng.team = "";
        eng.occupation = "";

        game.engineers[name] = eng;
    }
    
    for(let i = Object.keys(game.engineers).length; i <= 70; i++) {
        genEng();
    }

    for(const e in game.engineers) {
        const eng = game.engineers[e];

        eng.name = e;
        eng.salary = Math.round(20 + (Math.pow(1+((eng.aero/100) * (eng.adm/100) * (eng.eng/100)), 10)));
        eng.team = "";
        eng.occupation = "";
    }

    for(const t in game.teams) {
        const team = game.teams[t];
        const eng = game.engineers;

        function tryGet(name){
            if(!eng[name]){
                return "";
            }
            else{
                return eng[name].name;
            }
        }

        team.teamPrincipal = tryGet(team.teamPrincipal);
        team.engineers.technicalDirector = tryGet(team.engineers.technicalDirector);
        team.engineers.chiefAerodynamicist = tryGet(team.engineers.chiefAerodynamicist);
        team.engineers.chiefDesigner = tryGet(team.engineers.chiefDesigner);
        team.engineers.chiefEngineering = tryGet(team.engineers.chiefEngineering);

        if(team.teamPrincipal != "") {
            eng[team.teamPrincipal].occupation = "Chefe de Equipe";   
            eng[team.teamPrincipal].team = team.name;   
        }
        if(team.engineers.technicalDirector != ""){
            eng[team.engineers.technicalDirector].occupation = "Diretor Técnico";
            eng[team.engineers.technicalDirector].team = team.name; 
        } 
        if(team.engineers.chiefAerodynamicist != ""){
            eng[team.engineers.chiefAerodynamicist].occupation = "Aerodinamicista Chefe";
            eng[team.engineers.chiefAerodynamicist].team = team.name; 
        } 
        if(team.engineers.chiefDesigner != ""){
            eng[team.engineers.chiefDesigner].occupation = "Designer Chefe";
            eng[team.engineers.chiefDesigner].team = team.name; 
        } 
        if(team.engineers.chiefEngineering != ""){
            eng[team.engineers.chiefEngineering].occupation = "Engenheiro Chefe";
            eng[team.engineers.chiefEngineering].team = team.name; 
        } 
    }
}

export function CalcTeamDevPoints(teamName){
    const eng = game.engineers;
    const team = game.teams[teamName];

    let aeroPts = (eng[team.teamPrincipal].adm + eng[team.teamPrincipal].aero)/2;
    aeroPts += (eng[team.engineers.technicalDirector].adm * eng[team.engineers.technicalDirector].aero)/100;
    aeroPts += eng[team.engineers.chiefDesigner].aero;
    aeroPts += eng[team.engineers.chiefAerodynamicist].aero * 2;
    aeroPts /= 5;
    aeroPts *= ((team.employees/1000)+1)/2;


    let engPts = (eng[team.teamPrincipal].adm + eng[team.teamPrincipal].eng)/2;
    engPts += (eng[team.engineers.technicalDirector].adm * eng[team.engineers.technicalDirector].eng)/100;
    engPts += eng[team.engineers.chiefDesigner].eng;
    engPts += eng[team.engineers.chiefEngineering].eng * 2;
    engPts /= 5;
    engPts *= ((team.employees/1000)+1)/2;

    if(team.brokeCostCap){
        aeroPts -= aeroPts * team.brokeCostCapPenalty;
        engPts -= engPts * team.brokeCostCapPenalty;
    }

    team.aeroPts = Math.round(aeroPts);
    team.engPts = Math.round(engPts);
}

function StartTeamsStats(){
    for(const t in game.teams) {
        const team = game.teams[t];
        const car = team.car;
        const engine = game.engines[team.engine];

        team.new1driver = "";
        team.new2driver = "";
        team.newTdriver = "";

        team.newEngine = "";

        car.weight = (car.downforce + car.speed)/2;
        car.aerodynamic = car.speed;
        car.chassisReliability = car.reliability;

        delete car.speed;
        
        car.corners = (((car.downforce + car.weight)/2)*engine.torque)/100;
        car.straights = (((car.aerodynamic + car.weight)/2)*engine.power)/100;
        car.reliability = (car.chassisReliability * engine.reliability)/100;

        team.newCar = {};
        team.newCar.aerodynamic = 0;
        team.newCar.downforce = 0;
        team.newCar.weight = 0;
        team.newCar.chassisReliability = 0;

        team.aeroPts = 0;
        team.engPts = 0;
        team.brokeCostCap = false;
        team.brokeCostCapPenalty = 0;
        team.devFocusActualSeason = team.devFocusActualSeason ?? 50;
        team.devFocusNextSeason = team.devFocusNextSeason ?? 50;

        team.factories = Math.ceil(team.employees/250);

        team.investments = team.investments ?? {};
        team.investments.aerodynamics = team.investments.aerodynamics ?? 500;
        team.investments.weight = team.investments.weight ?? 500;
        team.investments.downforce = team.investments.downforce ?? 500;
        team.investments.reliability = team.investments.reliability ?? 500;
        team.totalInvestments = 0;

        team.financialReport = {};
        team.financialReport["Prize per Point"] = 0;
        team.financialReport["Prize per Place"] = 0;
        team.financialReport["1st Driver"] = 0;
        team.financialReport["2nd Driver"] = 0;
        team.financialReport["Test Driver"] = 0;
        team.financialReport["Engineers"] = 0;
        team.financialReport["Employees"] = 0;
        team.financialReport["Development Investments"] = 0;
        team.financialReport["Major Sponsor"] = 0;
        team.financialReport["Sponsors"] = 0;
        team.financialReport["Factory Sponsor"] = 0;
        team.financialReport["Balance"] = 0;
        team.financialReport["Engine"] = 0;
        team.financialReport["Fines"] = 0;
        
        CalcTeamDevPoints(team.name);
    }
}

export function BeforeRaceUpdateTeamsStats(){
    for(const t in game.teams) {
        const team = game.teams[t];
        const car = team.car;
        const engine = game.engines[team.engine];

        car.corners = Math.round((((car.downforce + car.weight)/2)*engine.torque)/100);
        car.straights = Math.round((((car.aerodynamic + car.weight)/2)*engine.power)/100);
        car.reliability = Math.round((car.chassisReliability * engine.reliability)/100);
        
        team.totalInvestments += team.investments.aerodynamics+team.investments.downforce+team.investments.weight+team.investments.reliability;
    }
}

export function YearUpdateTeamsStats(){
    game.championship.drivers = [];

    for(const t in game.teams) {
        const team = game.teams[t];
        const car = team.car;
        const engine = game.engines[team.engine];

        team.driver1 = team.new1driver;
        team.driver2 = team.new2driver;
        team.test_driver = team.newTdriver;

        if(!team.driver1 || !team.driver2 || !team.test_driver){
            for(const d in game.drivers) {
                const driver = game.drivers[d];

                if(!driver.team && driver.newTeam != "Aposentadoria"){
                    if(team.driver1 == ""){
                        driver.team = team.name;
                        driver.status = "1º Piloto";
                        driver.contractRemainingYears = rollDice("1d4+0");
                        team.new1driver = driver.name;
                        team.driver1 = driver.name;
                        continue;
                    }
                    if(!team.driver2){
                        driver.team = team.name;
                        driver.status = "2º Piloto";
                        driver.contractRemainingYears = rollDice("1d4+0");
                        team.new2driver = driver.name;
                        team.driver2 = driver.name;
                        continue;
                    }
                    if(!team.test_driver){
                        driver.team = team.name;
                        driver.status = "Piloto de Testes";
                        driver.contractRemainingYears = rollDice("1d4+0");
                        team.newTdriver = driver.name;
                        team.test_driver = driver.name;
                        continue;
                    }
                }
            }
        }
        
        if(game.drivers[team.driver1].contractRemainingYears == 0)  team.new1driver = "";
        if(game.drivers[team.driver2].contractRemainingYears == 0)  team.new2driver = "";
        if(game.drivers[team.test_driver].contractRemainingYears == 0)  team.newTdriver = "";


        car.aerodynamic = team.newCar.aerodynamic;
        car.downforce = team.newCar.downforce;
        car.weight = team.newCar.weight;
        car.chassisReliability = team.newCar.chassisReliability;

        team.newCar.aerodynamic = 0;
        team.newCar.downforce = 0;
        team.newCar.weight = 0;
        team.newCar.chassisReliability = 0;

        team.engineContract--;

        if(team.engineContract < 0 && team.newEngine != ""){
            team.engine = team.newEngine;
            team.engineContract = team.newEngineContract;
            team.newEngine = "";
            team.newEngineContract = "";
        }
        else if(team.engineContract == -1 && team.newEngine == ""){
            if(team.name == game.team){
                selectEngine(true);
                team.newEngine = "";
                team.newEngineContract = "";
            }
            else{
                const possibles = [];

                for(const e in game.engines){
                    if(!game.engines[e].blackList.includes(team.name)){
                        possibles.push(e);
                    }
                }

                team.newEngine = possibles[rand(0, possibles.length)];
                team.newEngineContract = rand(1, 6);
            }
        }
            
        if((game.championship.budgetCap - team.totalInvestments) >= 0){
            team.brokeCostCap = false;
            team.brokeCostCapPenalty = 0;
        }
        else{
            team.brokeCostCap = true;
            team.brokeCostCapPenalty = (team.totalInvestments / game.championship.budgetCap) - 1;
            team.brokeCostCapPenalty = team.brokeCostCapPenalty > 0.95 ? 0.95 : team.brokeCostCapPenalty;

            if(team.name == game.team)
                Swal.fire(`<p>Sua equipe estourou o Teto de Gastos, seus Pontos de Desenvolvimento serão penalizados em ${Math.round(team.brokeCostCapPenalty*100)}%</p>`)
        }

        team.totalInvestments = 0;

        team.financialReport = {};
        team.financialReport["Prize per Point"] = 0;
        team.financialReport["Prize per Place"] = 0;
        team.financialReport["1st Driver"] = 0;
        team.financialReport["2nd Driver"] = 0;
        team.financialReport["Test Driver"] = 0;
        team.financialReport["Engineers"] = 0;
        team.financialReport["Employees"] = 0;
        team.financialReport["Development Investments"] = 0;
        team.financialReport["Major Sponsor"] = 0;
        team.financialReport["Sponsors"] = 0;
        team.financialReport["Factory Sponsor"] = 0;
        team.financialReport["Balance"] = 0;
        team.financialReport["Engine"] = 0;
        team.financialReport["Fines"] = 0;
        
        CalcTeamDevPoints(team.name);

        game.championship.drivers.push(team.driver1);
        game.championship.drivers.push(team.driver2);
    }
}

export function UpdateAfterRace(){    
    game.championship.createStandings();

    let sumOfTeamsPows = 0;
    for (let i = 0; i < game.championship.teamStandings.length; i++) {
        sumOfTeamsPows += Math.pow((i+1),1.5);
    }

    game.contractsFailed = [];

    for(const t in game.teams) {
        const team = game.teams[t];
        const eng = game.engineers;

        const actualRace = game.championship.tracks[game.championship.actualRound-2];
        const raceResult = game.championship.results[actualRace];

        // BALANCE ###########################################################
        let balance = 0;
        let teamPoints = 0;

        for(let i = 0; i < game.championship.pointsSystem.length; i++){
            if(raceResult[i] == team.driver1 || raceResult[i] == team.driver2){
                teamPoints += game.championship.pointsSystem[i];
            }
        }
        balance += teamPoints * 200;
        team.financialReport["Prize per Point"] += teamPoints * 200;

        balance -= game.drivers[team.driver1].salary*1000;
        balance -= game.drivers[team.driver2].salary*1000;
        balance -= game.drivers[team.test_driver].salary*1000;
        team.financialReport["1st Driver"] += -game.drivers[team.driver1].salary*1000;
        team.financialReport["2nd Driver"] += -game.drivers[team.driver2].salary*1000;
        team.financialReport["Test Driver"] += -game.drivers[team.test_driver].salary*1000;

        let EngineersConst = 0;
        EngineersConst += eng[team.teamPrincipal].salary;
        EngineersConst += eng[team.engineers.technicalDirector].salary;
        EngineersConst += eng[team.engineers.chiefDesigner].salary;
        EngineersConst += eng[team.engineers.chiefAerodynamicist].salary;
        EngineersConst += eng[team.engineers.chiefEngineering].salary;
        team.financialReport["Engineers"] += -EngineersConst;
        balance -= EngineersConst;

        balance -= team.employees * 2.5;
        team.financialReport["Employees"] += -team.employees * 2.5;

        balance -= team.investments.aerodynamics+team.investments.downforce+team.investments.weight+team.investments.reliability;
        team.financialReport["Development Investments"] += -(team.investments.aerodynamics+team.investments.downforce+team.investments.weight+team.investments.reliability);

        if(team.majorSponsor != "")
            balance += team.majorSponsor_value;
        balance += team.sponsor_value * team.sponsors.length;
        balance += team.factorySponsor_value;

        team.financialReport["Major Sponsor"] += team.majorSponsor_value;
        team.financialReport["Sponsors"] += team.sponsor_value * team.sponsors.length;
        team.financialReport["Factory Sponsor"] += team.factorySponsor_value;

        for (let i = 0; i < game.championship.teamStandings.length; i++) {
            const teamName = game.championship.teamStandings[i][0];

            if(teamName == team.name){
                const value = ((3000000/(Math.pow(i+1,1.1)))/Math.pow(sumOfTeamsPows,1.08));
    
                team.financialReport["Prize per Place"] += value;
                balance += value;
                break;
            }
        }

        team.cash += balance;
        team.financialReport["Balance"] += balance;

        //#####################################################

        CalcTeamDevPoints(team.name);

        function calcUpgradeNew(aeroOrEng, investment){
            const rand = (2+(Math.random() + 1))/3;
            let up = (aeroOrEng/100)*(90*(investment/(investment+30))-80)*(team.devFocusNextSeason/100)*(23/game.championship.tracks.length);
            
            if(Math.random()*100 < 10){
                up *= ((game.drivers[team.test_driver].speed * game.drivers[team.test_driver].pace)/10000);
            }
            if(Math.random()*100 < 5){
                up *= -1;
            }
            if(Math.random()*100 < 5){
                up *= 0;
            }
            return up*rand;
        }
        function calcUpgradeActual(aeroOrEng, investment){
            let up = aeroOrEng*((investment/(investment+1))*investment*0.000005)*(team.devFocusActualSeason/100)*(23/game.championship.tracks.length);
            
            if(Math.random()*100 < 10){
                up *= ((game.drivers[team.test_driver].speed * game.drivers[team.test_driver].pace)/10000);
            }
            return up;
        }

        team.newCar.aerodynamic += calcUpgradeNew(team.aeroPts, team.investments.aerodynamics);
        team.newCar.downforce += calcUpgradeNew(team.aeroPts, team.investments.downforce);
        team.newCar.weight += calcUpgradeNew(team.engPts, team.investments.weight);
        team.newCar.chassisReliability += calcUpgradeNew(team.engPts, team.investments.reliability);

        team.car.aerodynamic += calcUpgradeActual(team.aeroPts, team.investments.aerodynamics);
        team.car.downforce += calcUpgradeActual(team.aeroPts, team.investments.downforce);
        team.car.weight += calcUpgradeActual(team.engPts, team.investments.weight);
        team.car.chassisReliability += calcUpgradeActual(team.engPts, team.investments.reliability);

        const properties = ['aerodynamic', 'downforce', 'weight', 'chassisReliability'];
        function limitPropertiesToRange(obj){
            for(const prop of properties){
                obj[prop] = Math.max(0, Math.min(100, obj[prop]));
            }
        }
        limitPropertiesToRange(team.newCar);
        limitPropertiesToRange(team.car);
    }
}

export function YearUpdate(){
    const driverName = game.championship.standings[0][0];
    const driver = game.drivers[driverName];
    const constructorName = game.championship.teamStandings[0][0];

    game.championship.historic.push({
        year: game.year,
        driverChampion: driverName,
        driverCountry: game.drivers[driverName].country,
        driverTeam:  game.drivers[driverName].team,
        driverEngine: game.teams[driver.team].engine,

        constructorChampion: constructorName,
        constructorCountry: game.teams[constructorName].country,
        constructorEngine: game.teams[constructorName].engine,
    });

    game.drivers[driverName].titles++;

    game.year++;

    game.championship.actualRound = 1;
    game.championship.standings = [];
    game.championship.results = {};
    game.championship.teamStandings = [];

    YearUpdateDriversStats();
    YearUpdateTeamsStats();
    genTeamHTML();
}