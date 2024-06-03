import { Championship } from "../championship.js";
import { game } from "../game.js";

export const CreateStandings = () => {
    const driverRanking = {};

    for (const d in Championship.drivers) {
        const driver = game.drivers[Championship.drivers[d]];

        driverRanking[driver.name] = {
            pts: 0,
            wins: 0,
            bestFinish: 999,
        };
    }

    for (const r in Championship.results) {
        const raceResult = Championship.results[r];

        for (let pos = 0; pos < raceResult.length; pos++) {
            const driver = driverRanking[raceResult[pos]];

            if(pos == 0){
                driver.wins++;
            }

            if(pos < Championship.pointsSystem.length)
                driver.pts += Championship.pointsSystem[pos];

            if(driver.bestFinish > pos+1){
                driver.bestFinish = pos+1;
            }
        }
    }

    Championship.standings = [];
    for (const k in driverRanking) {
        Championship.standings.push([k, driverRanking[k].pts, driverRanking[k].wins, driverRanking[k].bestFinish]);
    }

    Championship.standings.sort((a, b) => a[3] - b[3]);
    Championship.standings.sort((a, b) => b[1] - a[1]);

    //Team Standings
    const teamRanking = {};

    for (const t of Championship.teams) {
        const team = game.teams[t];

        teamRanking[team.name] = {
            pts: 0,
            wins: 0,
            podiums: 0,
            bestFinish: 999,
        };
    }

    for (const r in Championship.results) {
        const raceResult = Championship.results[r];

        for (let pos = 0; pos < raceResult.length; pos++) {
            const driver = game.drivers[raceResult[pos]];
            const team = teamRanking[driver.team];

            if(pos == 0){
                team.wins++;
            }
            if(pos < 3){
                team.podiums++;
            }

            if(pos < Championship.pointsSystem.length)
                team.pts += Championship.pointsSystem[pos];

            if(team.bestFinish > pos+1){
                team.bestFinish = pos+1;
            }
        }
    }
    
    Championship.teamStandings = [];
    for (const k in teamRanking) {
        Championship.teamStandings.push([
            k,
            teamRanking[k].pts,
            teamRanking[k].wins,
            teamRanking[k].podiums,
            teamRanking[k].bestFinish]);
    }

    Championship.teamStandings.sort((a, b) => a[4] - b[4]);
    Championship.teamStandings.sort((a, b) => b[1] - a[1]);
}