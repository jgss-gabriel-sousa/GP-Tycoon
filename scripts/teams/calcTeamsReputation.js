import { publishNews } from "../../views/news.js";
import { game } from "../game.js";
import { roundToMultiple } from "../utils.js";

export function calcTeamsReputation(){
    let teamsPerformance = {};

    for(const t in game.teams){
        const team = game.teams[t];

        for(const year in team.history.lastResults){
            if(parseInt(year) < game.year-3) continue;

            if(!teamsPerformance[year])
                teamsPerformance[year] = {maxPts:0};

            let pts = team.history.lastResults[year].pts;

            teamsPerformance[year][team.name] = pts;

            if(pts > teamsPerformance[year].maxPts)
                teamsPerformance[year].maxPts = pts;
        }
    }

    for(const y in teamsPerformance){
        for(const t in teamsPerformance[y]){
            if(t == "maxPts")
                continue;

            teamsPerformance[y][t] = teamsPerformance[y][t] / teamsPerformance[y].maxPts;
        }

        delete teamsPerformance[y].maxPts;
    }

    const performance = {};
    for(const y in teamsPerformance){
        for(const t in teamsPerformance[y]){
            let modif = 4;

            if(y == game.year-1) modif = 4;
            if(y == game.year-2) modif = 2;
            if(y == game.year-3) modif = 1;

            if(!performance[t])
                performance[t] = 0;

            performance[t] += teamsPerformance[y][t] * modif;
        }
    }
    for(const t in performance){
        performance[t] /= 7;
    }
    let maxPerformance;
    for(const t in performance){
        if(performance[t] > maxPerformance || !maxPerformance)
            maxPerformance = performance[t];
    }
    for(const t in game.teams){
        performance[t] = performance[t] / maxPerformance;
        performance[t] = roundToMultiple((performance[t]*5), 0.5);
    }

    const supporters = {};
    let maxSupporters;
    for(const t in game.teams){
        const team = game.teams[t];

        if(team.supporters > maxSupporters || !maxSupporters)
            maxSupporters = team.supporters;
    }
    for(const t in game.teams){
        supporters[t] = game.teams[t].supporters / maxSupporters;
        supporters[t] = roundToMultiple((supporters[t]*5), 0.5);
    }

    const political = {};
    let maxPolitical;
    for(const t in game.teams){
        const team = game.teams[t];

        if(team.politicalForce > maxPolitical || !maxPolitical)
            maxPolitical = team.politicalForce;
    }
    for(const t in game.teams){
        political[t] = game.teams[t].politicalForce / maxPolitical;
        political[t] = roundToMultiple((political[t]*5), 0.5);
    }

    const dev = {};
    let maxDev;
    for(const t in game.teams){
        const team = game.teams[t];

        let devCap = (team.aeroPts + team.engPts)/2;

        if(devCap > maxDev || !maxDev)
            maxDev = devCap;
    }
    for(const t in game.teams){
        const team = game.teams[t];
        let devCap = (team.aeroPts + team.engPts)/2;
        dev[t] = devCap / maxDev;
        dev[t] = roundToMultiple((dev[t]*5), 0.5);
    }

    const tradition = {};
    let maxTitles;
    for(const t in game.teams){
        const team = game.teams[t];

        if(team.history.titles > maxTitles || !maxTitles)
            maxTitles = team.history.titles;
    }
    for(const t in game.teams){
        tradition[t] = game.teams[t].history.titles / maxTitles;
        tradition[t] = roundToMultiple((tradition[t]*5), 0.5);
    }

    let championshipReputation = 0;
    for(const t in game.teams){
        const team = game.teams[t];

        const oldReputation = team.reputation;
        team.reputation = roundToMultiple(((performance[team.name]*4) + (dev[team.name]*2) + (political[team.name]*2) + supporters[team.name] + tradition[team.name]) / 10, 0.5);
        team.performance = performance[team.name];
        team.supportersReputation = supporters[team.name];
        team.tradition = tradition[team.name];
        team.developmentReputation = dev[team.name];
        team.politicalReputation = political[team.name];

        if(game.championship.teams.includes(team.name))
            championshipReputation += team.reputation;

        if(team.reputation > oldReputation+1) team.reputation = oldReputation+1;
        if(team.reputation < oldReputation-1) team.reputation = oldReputation-1;
        
        let repName;
        if(team.reputation == 5)    repName = "Dominante";
        if(team.reputation == 4.5)  repName = "Poderosa";
        if(team.reputation == 4)    repName = "Respeitável";
        if(team.reputation == 3.5)  repName = "Competitiva";
        if(team.reputation == 3)    repName = "Emergente";
        if(team.reputation == 2.5)  repName = "Razóavel";
        if(team.reputation == 2)    repName = "Mediana";
        if(team.reputation == 1.5)  repName = "Limitada";
        if(team.reputation == 1)    repName = "Enfraquecida";
        if(team.reputation == 0.5)  repName = "Fundo de Grid";
        if(team.reputation == 0)    repName = "Nanica";

        team.reputationTitle = repName;

        if(oldReputation < team.reputation)     publishNews("Increase Reputation", [team.name, team.reputationTitle, team.reputation]);
        if(oldReputation > team.reputation)     publishNews("Decrease Reputation", [team.name, team.reputationTitle, team.reputation]);
    }
    
    championshipReputation = Math.round(championshipReputation/game.championship.teams.length);
}