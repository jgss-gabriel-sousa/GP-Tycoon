import { getRandomCountry } from "../data/countryRanking.js";
import { generateName } from "../data/nameData.js";
import { game } from "./game.js";
import { rand, rollDice } from "./utils.js";

export function YearUpdateEngStats(){
    console.log(game.engineers)

    for(const e in game.engineers) {
        const eng = game.engineers[e];

        eng.age++;
    }
}

export function StartEngStats(){
    game.engineers[""] = {aero:0,eng:0,adm:0,salary:0}

    function genEng(){
        let name = "";
        let country = "";
        let gender = "";

        do {
            const r = rand(0,100);
            if(r < 80) gender = "Male"
            else gender = "Female"

            country = getRandomCountry();
            name = generateName(country, gender);

        } while(game.engineers.hasOwnProperty(name));

        let eng = {};
        eng.name = name;
        eng.country = country;
        eng.age = rollDice("6d8+20");
        eng.aero = rollDice("5d8+60");
        eng.adm = rollDice("5d8+60");
        eng.eng = rollDice("5d8+60");
        eng.salary = Math.round(20 + (Math.pow(1+((eng.aero/100) * (eng.adm/100) * (eng.eng/100)), 10)));
        eng.team = "";
        eng.occupation = "";
        eng.personality = "";

        if(gender == "Male") eng.gender = "Homem";
        if(gender == "Female") eng.gender = "Mulher";

        game.engineers[name] = eng;
    }
    
    for(let i = Object.keys(game.engineers).length; i <= (game.championship.teams.length+1)*5; i++) {
        genEng();
    }

    for(const e in game.engineers) {
        const eng = game.engineers[e];

        eng.name = e;
        eng.salary = Math.round(20 + (Math.pow(1+((eng.aero/100) * (eng.adm/100) * (eng.eng/100)), 10)));
        eng.team = "";
        eng.occupation = "";

        if(!eng.gender) eng.gender = "Homem";
        if(eng.gender == "M") eng.gender = "Homem";
        if(eng.gender == "F") eng.gender = "Mulher";

        if(!eng.personality){
            const personality = rand(0,17);

            if(personality == 0)    eng.personality = "Perfeccionista";
            if(personality == 1)    eng.personality = "Inovador";
            if(personality == 2)    eng.personality = "Líder Nato";
            if(personality == 3)    eng.personality = "Colaborador";
            if(personality == 4)    eng.personality = "Ambicioso";
            if(personality == 5)    eng.personality = "Estrategista";
            if(personality == 6)    eng.personality = "Comprometido";
            if(personality == 7)    eng.personality = "Comunicativo";
            if(personality == 8)    eng.personality = "Analítico";
            if(personality == 9)    eng.personality = "Versátil";
            if(personality == 10)   eng.personality = "Adaptável";
            if(personality == 11)   eng.personality = "Resiliente";
            if(personality == 12)   eng.personality = "Metódico";
            if(personality == 13)   eng.personality = "Independente";
            if(personality == 14)   eng.personality = "Diplomático";
            if(personality == 15)   eng.personality = "Otimista";
            if(personality == 16)   eng.personality = "Eficiente";
        }
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