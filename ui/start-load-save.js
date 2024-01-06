import { game, startGame } from "../scripts/game.js";
import { genTeamHTML } from "../scripts/main.js";
import { changeScreen } from "../scripts/screens.js"
import { Championship } from "../scripts/championship.js";

function newGame(){
    startGame();

    const teams = game.championship.teams;
    teams.sort();

    let html = `<select id="select-team">`;
    teams.forEach(t => {
        html += `<option value="${t}">${t}</option>`;
    });
    html += "</select>";

    Swal.fire({
        title: "Novo Jogo",
        html: html,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Ok",
    }).then((result) => {
        if(result.isConfirmed){
            game.team = document.querySelector("#select-team").value;

            game.news.unshift({
                headline: "Novidade na "+game.team,
                date: game.championship.actualRound-1,
                year: game.year,
                content: `A ${game.team} surpreende com a nomeação de um novo líder para sua direção, apesar de ser desconhecido é considerado uma grande promessa no gerenciamneto, será ele capaz de fazer história?!`,
            });

            changeScreen("team-menu");
            genTeamHTML();
        }
    });
}

export async function selectDatabase(){
    let DBs;
    let inputDB;
    
    function loadFile(file){
        fetch("./db/"+file)
        .then(res => res.json())
        .then(DB => {
            DBs[DB.DB_NAME] = DB;
            genHTML();
            document.querySelector("#select-db > div:nth-child(1) > select").value = DB.DB_NAME;
        })
        .catch(e => console.error(e));
    };

    function getDBsStatic(){
        return false;
    }

    async function getDBsOnline(){
        try {
            //const apiURL = `https://gp-tycoon-web-service.onrender.com/get-dbs`;
            const apiURL = `.`;
            const response = await fetch(apiURL, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
    
            DBs = await response.json();
        } catch (error) {
            DBs = {
                "F1 2015": {
                    DB_Name: "Teste"
                }
            };
        }
    }

    if(getDBsStatic() == false){
        await getDBsOnline();
    }

    function setDB(DBname){
        const db = DBs[DBname];

        console.log(db)

        game.championship.teams = db.championship.teams;
        game.teams = db.teams;
        game.drivers = db.drivers;
    }

    function genHTML(){
        let html = `
        <div>
            Lista de DBs:
            <select>`;
    
        for(const dbName in DBs) {
            const DB = DBs[dbName];
            html += `<option value="${dbName}">${dbName}</option>`;
        }
    
        html += `
            </select>
        </div>
        <div>
            Carregar Arquivo de DB:
            <input type="file" accept=".GPdb"/>
        </div>`;

        if(document.getElementById("select-db")){
            document.getElementById("select-db").innerHTML = html;
        }

        html = `<div id="select-db">${html}</div>`
        return html;
    }


    Swal.fire({
        title: "Selecione a Base de Dados",
        html: genHTML(),
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Ok",
    }).then((result) => {
        if(result.isConfirmed){

            setDB(document.querySelector("#select-db > div:nth-child(1) > select").value);
            newGame();
        }
    });

    const fileSelector = document.querySelector("#select-db > div:nth-child(2) > input");
    fileSelector.addEventListener("change", e => {
        const fileList = e.target.files;

        if(fileList.length != 0){
            loadFile(e.target.files[0].name);
        }
    });
}

export function loadGame(){
    const savedGames = {};
    let firstKey = "";

    for(const key in localStorage) {
        if(key.startsWith("gpTycoon-savegame-")){
            savedGames[key] = JSON.parse(localStorage[key]);
            
            if(firstKey == "") firstKey = key;
        }
    }
    
    let html = `<select id="select-team">`;

    if(Object.keys(savedGames).length == 0) html = `<select id="select-team" disabled="true">`;

    for (const key in savedGames) {
        html += `<option value="${key}">${savedGames[key].gameName}</option>`;
    }
    html += `
    </select>
    <div id="selected-team">
        <h2>${savedGames[firstKey].year} - ${savedGames[firstKey].team}</h2>
    </div>
    `;

    Swal.fire({
        title: "Carregar Jogo",
        html: html,
        showCloseButton: true,
        focusConfirm: false,
        showDenyButton: true,
        confirmButtonText: "Carregar",
        denyButtonText: "Deletar",
    }).then((result) => {
        if(result.isConfirmed && savedGames[document.querySelector("#select-team").value]){
            const newGame = savedGames[document.querySelector("#select-team").value];

            game.team = newGame.team,
            game.year = newGame.year,
            game.championship = new Championship(newGame.championship),
            game.drivers = newGame.drivers,
            game.teams = newGame.teams,
            game.engines = newGame.engines,
            game.engineers = newGame.engineers,

            changeScreen("team-menu");
            genTeamHTML();
        }
        else if(result.isDenied){
            deleteGame(document.querySelector("#select-team").value, savedGames);
        }
    });

    document.querySelector("#select-team").addEventListener("click", () => {
        const gameKey = document.querySelector("#select-team").value;

        document.querySelector("#selected-team").innerHTML = `
            <h2>${savedGames[gameKey].year} - ${savedGames[gameKey].team}</h2>
        `;
    });
}

export async function saveGame(){
    if(!game.gameName){
        const { value: name } = await Swal.fire({
            title: "Dê um nome para o Save",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonText: "Salvar",
            input: "text",
            inputValidator: (value) => {
                if(!value) return "Digite um nome!";
            }
        });
        
        if(name){
            game.gameName = name;
            Swal.fire(`Jogo salvo com sucesso`);
        }
    }
    localStorage.setItem("gpTycoon-savegame-"+game.gameName, JSON.stringify(game));
}

function deleteGame(gameName, savedGames){
    Swal.fire({
        title: `Deletar ${savedGames[gameName].gameName}?`,
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
        showCancelButton: true,
        showDenyButton: true,
        cancelButtonText: "Cancelar",
        denyButtonText: "Deletar",
    }).then((result) => {
        if(result.isDenied){
            localStorage.removeItem(gameName);
        }
        loadGame();
    });
}