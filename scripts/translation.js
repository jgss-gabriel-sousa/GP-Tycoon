import { game } from "./game.js";

let dict = {};

export function LOC(key){
    key = key.toLowerCase();

    console.log(key+"_"+game.game_language)

    try {
        return dict[key+"_"+game.game_language];
    
    } catch (error) {
        console.error(`Failed translation of "${key}" in Game Language: ${game.game_language}`);
        return key;
    }
}

function dictAppend(filename){
    const request = new XMLHttpRequest();
    request.open("GET", `./localization/${filename}.json`, false);
    request.send(null)
    const json = JSON.parse(request.responseText);

    dict = Object.assign(dict, json);
}

dictAppend("base_PT");
