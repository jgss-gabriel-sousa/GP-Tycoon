import { blankSpaceRmv, accentsTidy, NumberF, setBarProgress, rollDice, rand, hoursBetweenDates } from "./utils.js"
import { changeScreen } from "./screens.js"
import { genTeamHTML } from "./main.js"
import { Championship } from "./championship.js";
import { driversData } from "./data/driversData.js";
import { teamsData } from "./data/teamsData.js";
import { enginesData } from "./data/enginesData.js";
import { engineersData } from "./data/engineersData.js";
import { startDriversStats, YearUpdateDriversStats } from "./drivers.js";
import { selectEngine } from "./ui/selectEngine.js";
import { generateName } from "./data/nameData.js";
import { getRandomCountry } from "./data/countryRanking.js";
import { CalcTeamDevPoints, StartTeamsStats, YearUpdateTeamsStats } from "./teams.js";

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
    news: [],
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

    game.news.unshift({
        headline: "Bem vindo",
        date: game.championship.actualRound-1,
        year: game.year,
        content: `É com grande alegria que damos as boas-vindas ao nosso time! Estamos empolgados em contar com alguém tão talentoso como você para assumir o novo cargo. Sua experiência e habilidades serão valiosas para o crescimento e sucesso da nossa equipe.`,
    });
}

async function checkGameKey(){

    async function onlineCheck(key){
        const apiURL = `https://gp-tycoon-web-service.onrender.com/validate-key`;

        const response = await fetch(apiURL, {
            method: "POST",
            body: JSON.stringify({
                key: key,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        return response;
    }

    function checkScreen(){
        let savedKey = {};
        try {
            if(localStorage.getItem("gpTycoon-serial-key"))
                savedKey = JSON.parse(localStorage.getItem("gpTycoon-serial-key"));
        } catch(e){}
        
        if(!savedKey.key)
            savedKey.key = "";


        Swal.fire({
            title: "Confirme sua cópia de GP Tycoon",
            width: "75%",
            html: `
            <div id="serial-key-screen">
                <div>
                    <label for="swal2-input" class="swal2-input-label">Chave do Produto:</label>
                    <input id="swal-input" class="swal2-input" type="text" placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX" value="${savedKey.key}">
                </div>
                
                <br>
                
                <button title="Entenda como funciona o registro"<" type="button" onclick="if(document.getElementById('spoiler') .style.display=='none') {document.getElementById('spoiler') .style.display=''}else{document.getElementById('spoiler') .style.display='none'}">Entenda como funciona</button>
                <div id="spoiler" style="display:none">
                    <p>A Chave do Produto é um registro que assegura a sua cópia e o acesso ao jogo. Ela é adquirida mediante um pagamento único, realizado através do PagSeguro, proporcionando segurança e diversas opções de pagamento. Após a confirmação da compra, você receberá a Chave de Produto por e-mail.</p>
                </div>

                <br>
                <h4><a href="https://pag.ae/7-3Zj9hev" target="_blank">Adquira uma Chave de Produto</a></h4>
            </div>    
            `,
            showCancelButton: false,
            confirmButtonText: "Avançar",
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: async (login) => {
                try {
                    const key = document.getElementById("swal-input").value;
                    const response = await onlineCheck(key);
                    
                    if(!response.ok){
                        return Swal.showValidationMessage("Chave Inválida");
                    }

                    return await response.json();
    
                } catch (error) {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if(result.isConfirmed){   
                localStorage.setItem("gpTycoon-serial-key", JSON.stringify(result.value));
                startGame();
            }
            else{
                checkScreen();
            }
        });
    }
    
    async function hiddenCheck(key){
        const response = await onlineCheck(key.key);

        if(!response.ok){
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: "Falha na Verificação da Chave de Produto",
            }).then(() => {
                checkScreen();
            });
        }
        else{
            console.log("Key checked online");

            localStorage.setItem("gpTycoon-serial-key", JSON.stringify(await response.json()));
            startGame();
        }
    }

    if(localStorage.getItem("gpTycoon-serial-key")){
        let key;
        try {
            key = JSON.parse(localStorage.getItem("gpTycoon-serial-key"));
        } catch(e){}

        if(!key){
            checkScreen();
        }
        else if(!key.key || !key.lastTimeUsed || hoursBetweenDates(Date.now(), key.lastTimeUsed) > rand(6,24)){
            console.log("Online check needed");
            await hiddenCheck(key);
        }
        else{
            startGame();
        }
    }
    else{
        checkScreen();
    }

}checkGameKey();

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