import { game } from "./game.js";

let dict = {};

export function LOC(key){
    key = key.toLowerCase();

    try {
        return dict[key+"_"+game.game_language];
    
    } catch (error) {
        console.error(`Failed translation of "${key}" in Game Language: ${game.game_language}`);
        return key;
    }
}

function dictAppend(filename){
    fetch(`./localization/${filename}.json`)
    .then(response => response.json())
    .then(json => {
        dict = Object.assign(dict, json);
    })
    .catch(error => console.error('Erro:', error));
}

dictAppend("base_PT");
