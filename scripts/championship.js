import { game } from "./game.js";
import { endSeason } from "./championship/end-season.js";
import { QualifySim } from "./championship/qualify-sim.js";
import { RaceSim } from "./championship/race-sim.js";
import { VisualRaceSim } from "./championship/visual-race-sim.js";
import { CreateStandings } from "./championship/create-standings.js";
import { genRaceTableHTML } from "./championship/race-table.js";
import { genGridTableHTML } from "./championship/grid-table.js";
import { RunRaceSimulation } from "./championship/run-race-simulation.js";

export const Championship = {
    teams: ["Red Bull","Mercedes","Ferrari","Aston Martin","AlphaTauri","Alfa Romeo","Alpine","Haas","Williams","McLaren"],
    tracks: ["Bahrein","Arábia Saudita","Austrália","Azerbaijão","Miami","Emília-Romanha","Mônaco","Espanha","Canadá","Áustria","Grã-Bretanha","Hungria","Bélgica","Países Baixos","Itália","Singapura","Japão","Catar","Estados Unidos","Cidade do México","São Paulo","Las Vegas","Abu Dhabi"],
    drivers: [],

    results: {},
    standings: [],
    teamStandings: [],
    actualRound: 1,
    
    pointsSystem: [25,18,15,12,10,8,6,4,2,1],
    budgetCap: 145000, //in Thousands
    race: {
        grid: {},
        qSection: "Q1",
        qDrivers: [],

        raceDrivers: [],
        finalResult: [],
        positions: [],
        condition: "",
        safetyCarLaps: 0,

        retires: [],
        rain: 0,
        lap: 0,
        simTick: 0,
        log: [],
    },
    
    historic: [
        {
            year: 2022,
            driverChampion: "Max Verstappen",
            driverCountry: "NL",
            driverTeam: "Red Bull",
            driverEngine: "Red Bull PowerTrains",

            constructorChampion: "Red Bull",
            constructorCountry: "AT",
            constructorEngine: "Red Bull PowerTrains",
        }
    ],
}


export function Championship_Init(db_data){    

    for(const key in db_data){
        Championship[key] = db_data[key];
    }

    Championship.teams

    Championship.teams.forEach(t => {
        const team = game.teams[t];

        Championship.drivers.push(game.drivers[team.driver1].name);
        Championship.drivers.push(game.drivers[team.driver2].name);
    });

    Championship["EndSeason"] = endSeason;

    Championship["QualifySim"] = QualifySim;
    Championship["RaceSim"] = RaceSim;

    Championship["VisualRaceSim"] = VisualRaceSim;
    Championship["CreateStandings"] = CreateStandings;
    Championship["genRaceTableHTML"] = genRaceTableHTML;
    Championship["genGridTableHTML"] = genGridTableHTML;
    Championship["RunRaceSimulation"] = RunRaceSimulation;
}