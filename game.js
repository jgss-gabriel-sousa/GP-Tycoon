import { blankSpaceRmv, accentsTidy, numberF, setBarProgress } from "./utils.js"
import { changeScreen } from "./screens.js"
import { genTeamHTML } from "./app.js"
import { Championship } from "./championship.js";
import { driversData } from "./data/driversData.js";
import { teamsData } from "./data/teamsData.js";
import { enginesData } from "./data/enginesData.js";
import { startDriversStats } from "./drivers.js";

export const game = {
    activeScreen: "main-menu",
    uiTeamColors: true,
    team: "Red Bull",
    year: 2023,
    championship: new Championship(),
    drivers: {},
    teams: {},
    engines: {},
}

function startGame(){
    changeScreen("main-menu");

    game.drivers = driversData;
    game.teams = teamsData;
    game.engines = enginesData;
    StartTeamsStats();
    startDriversStats()
} startGame();

export function StartTeamsStats(){
    for(const t in game.teams) {
        const team = game.teams[t];
        const car = team.car;
        const engine = game.engines[team.engine];

        car.weight = Math.round((car.downforce + car.speed)/2);
        car.aerodynamic = car.speed;
        car.chassisReliability = car.reliability;

        delete car.speed;
        
        car.corners = Math.round((car.downforce + car.weight)/2);
        car.straights = Math.round((car.aerodynamic + car.weight)/2);
        car.reliability = Math.round((car.chassisReliability * engine.reliability)/100);
    }
}

export function UpdateTeamsStats(){
    for(const t in game.teams) {
        const team = game.teams[t];
        const car = team.car;
        const engine = game.engines[team.engine];
        
        if(team.name == "Rred Bull"){
            car.aerodynamic = 100;
            car.weight = 100;
            car.downforce = 100;
        }
    }
}

export function UpdateAfterRace(){    
    for(const t in game.teams) {
        const team = game.teams[t];

        team.cash -= game.drivers[team.driver1].salary * 1000;
        team.cash -= game.drivers[team.driver2].salary * 1000;
        team.cash -= game.drivers[team.test_driver].salary * 1000;
    }
}

export function YearUpdate(){
    const driverName = this.standings[0][0];
    const driver = game.drivers[driverName];
    const constructorName = this.teamStandings[0][0];

    game.championship.historic.push({
        year: this.year,
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
    game.championship.results = {};
    game.championship.standings = [];
    game.championship.teamStandings = [];

    UpdateTeamsStats();
    genTeamHTML();
}