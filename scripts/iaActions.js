import { game } from "./game.js"

export function iaPlansForYear(teamName){
    const team = game.teams[teamName];

    let budget = team.cash;
    let strategy = rand(0,3);

    if(strategy == 0){
        budget /= 2;
    }
    if(strategy == 1){
        budget /= 3;
    }
    if(strategy == 2){
        budget /= 4;
    }
}

export function iaActions(){
    const teams = {};

    for(let i = 0; i < game.championship.teams.length; i++){
        const teamName = game.championship.teams[i];
        teams[teamName] = game.teams[teamName];
    }

    for(const t in teams){
        const team = teams[t];

        teamDirectorManagement(team.name);
    }
}

function teamDirectorManagement(teamName){
    const team = game.teams[teamName];

    ;    
}