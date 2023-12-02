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
import { CalcTeamDevPoints, YearUpdateTeamsStats } from "./teams.js";

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
        
        car.corners = (((car.downforce + car.weight)/2)*engine.drivability)/100;
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