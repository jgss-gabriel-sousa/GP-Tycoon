import { Championship_Init } from "../scripts/championship.js";
import { game, startGameData } from "../scripts/game.js";
import { createTooltip } from "../scripts/tooltips.js";
import { newGame } from "./startGame.js";

async function CheckAndSetDefaultDB(){
    const DEFAULT_DB = "F1 2023";

    const DBS = JSON.parse(localStorage.getItem("gpTycoon-game-databases"));

    if(DBS[DEFAULT_DB]){
        return;
    }

    
    fetch(`./db/${DEFAULT_DB}.json`)
        .then((res) => {
            return res.json();
        })
        .then((db) => {
            DBS[DEFAULT_DB] = db;
        
            localStorage.setItem("gpTycoon-game-databases", JSON.stringify(DBS));
        })
        .catch((error) => 
            console.error("Unable to fetch data:", error));
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
        CheckAndSetDefaultDB();
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
        const db = DBs[DBname];

        game.drivers = db.drivers;
        game.teams = db.teams;
        game.engines = db.engines;
        game.engineers = db.engineers;

        Championship_Init(db.championship);

        startGameData();
    }

    function genHTML(){
        let html = `
        <div>
            Lista de DBs:
            <select>`
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
            <input type="file" accept=".json"/>
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