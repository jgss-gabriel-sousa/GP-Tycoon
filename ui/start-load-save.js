import { game, startGameData } from "../scripts/game.js";
import { genTeamMainMenu } from "./mainMenu.js";
import { changeScreen } from "../scripts/screens.js"
import { Championship, Championship_Init } from "../scripts/championship.js";
import { createTooltip } from "../scripts/tooltips.js";

function newGame(){
    startGameData();

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
                content: `A ${game.team} surpreende com a nomeação de um novo líder para sua direção, apesar de ser desconhecido é considerado uma grande promessa no gerenciamento, será ele capaz de fazer história?!`,
            });

            changeScreen("team-menu");
            genTeamMainMenu();
        }
    });
}

export async function selectDatabase(){
    let DBs = {};
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

    function getDBsSaved(){
        const dbs = JSON.parse(localStorage.getItem("gpTycoon-game-databases"));

        for(const key in dbs){
            DBs[key] = dbs[key];
        }

    }getDBsSaved();

    async function getDBsOnline(){
        try {
            const apiURL = `https://gp-tycoon-web-service.onrender.com/get-dbs`;
            let OnlineDBs;
            const response = await fetch(apiURL, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
    
            OnlineDBs = await response.json();

            if(OnlineDBs){
                for(const key in OnlineDBs){
                    DBs[key] = OnlineDBs[key];
                }
            }
        } catch (error) {
            ;
        }
    }

    function setDB(DBname){
        if(DBname == "2023 (Padrão)"){
            return;
        }

        const db = DBs[DBname];

        game.championship = db.championship;
        game.drivers = db.drivers;
        game.teams = db.teams;
        game.engines = db.engines;
        game.engineers = db.engineers;

        startGameData();
    }

    function genHTML(){
        let html = `
        <div>
            Lista de DBs:
            <select>
                <option value="2023 (Padrão)">2023 (Padrão)</option>
            `;
    
        for(const dbName in DBs) {
            const DB = DBs[dbName];
            html += `<option value="${dbName}">${dbName}</option>`;
        }
    
        html += `
            </select>
            <button id="download-dbs"><i class="lni lni-download"></i></button>
            <button id="upload-dbs" value="0"><i class="lni lni-upload"></i></button>
        </div>
        <div id="load-db-file" style="display:none;">
            <p>Os arquivos de DB proporcionam novos conteúdos e modificações produzidos pela comunidade.</p><br>
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
        
        if(DBs)
            localStorage.setItem("gpTycoon-game-databases", JSON.stringify(DBs));

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

    createTooltip("#download-dbs", "Download de DBs Oficiais");
    const downloadDBs = document.querySelector("#download-dbs");
    downloadDBs.addEventListener("click", e => {
        getDBsOnline();
    });

    createTooltip("#upload-dbs", "Carregar arquivo de DB");
    const uploadDBFile = document.querySelector("#upload-dbs");
    uploadDBFile.addEventListener("click", e => {
        if(uploadDBFile.value == "1"){
            document.querySelector("#load-db-file").style = "display: none;";
            uploadDBFile.value = "0";
        }
        else{
            document.querySelector("#load-db-file").style = "display: block;";
            uploadDBFile.value = "1";
        }
    });
}

export function loadGameScreen(){
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
            game.othersSeries = newGame.othersSeries,
            game.drivers = newGame.drivers,
            game.teams = newGame.teams,
            game.engines = newGame.engines,
            game.engineers = newGame.engineers,
            game.contractsFailed = newGame.contractsFailed,
            game.news = newGame.news,
            game.championship = newGame.championship,
            Championship_Init();
            

            changeScreen("team-menu");
            genTeamMainMenu();
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
        loadGameScreen();
    });
}