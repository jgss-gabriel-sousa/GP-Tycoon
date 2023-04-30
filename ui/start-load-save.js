import { game } from "../game.js";
import { genTeamHTML } from "../app.js";
import { changeScreen } from "../screens.js"
import { Championship } from "../championship.js";

export function newGame(){    
    let html = `
    <select id="select-team">
        <option value="Red Bull">Red Bull</option>
        <option value="Mercedes">Mercedes</option>
        <option value="Ferrari">Ferrari</option>
        <option value="Aston Martin">Aston Martin</option>
        <option value="Alpine">Alpine</option>
        <option value="Haas">Haas</option>
        <option value="McLaren">McLaren</option>
        <option value="Alfa Romeo">Alfa Romeo</option>
        <option value="AlphaTauri">AlphaTauri</option>
        <option value="Williams">Williams</option>
    </select>
    `;

    Swal.fire({
        title: "Novo Jogo",
        html: html,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Ok",
    }).then((result) => {
        if(result.isConfirmed){
            game.team = document.querySelector("#select-team").value;

            changeScreen("team-menu");
            genTeamHTML();
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

            game.team= newGame.team,
            game.year= newGame.year,
            game.championship= new Championship(newGame.championship),
            game.drivers= newGame.drivers,
            game.teams= newGame.teams,
            game.engines= newGame.engines,
            game.engineers=newGame.engineers,

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
        }
    }
    
    localStorage.setItem("gpTycoon-savegame-"+game.gameName, JSON.stringify(game));

    Swal.fire(`Jogo salvo com sucesso`);
}

function deleteGame(gameName, savedGames){    
    let html = `Deletar ${savedGames[gameName].gameName}?`;

    Swal.fire({
        title: "Novo Jogo",
        html: html,
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