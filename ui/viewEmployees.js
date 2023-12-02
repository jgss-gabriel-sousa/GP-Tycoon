import { genTeamHTML } from "../app.js";
import { game } from "../game.js";
import { CalcTeamDevPoints } from "../teams.js";
import { NumberF } from "../utils.js";

function updateScreen(){
    CalcTeamDevPoints(game.team);
    genTeamHTML();
}

export function viewEmployees(teamName){
    let html = "";
    const team = game.teams[teamName];

    html += `
    <div id="view-employees">
        <table id="view-driver-infos">
            <tr>
                <td><h2>Empregados:</h2></td>
                <td>${NumberF(team.employees,"",0)}</td>
            </tr>
            <tr>
                <td><h2>Salário:</h2></td>
                <td>${NumberF(team.employees * 2.5 * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <td><h2>Nível da Fábrica:</h2></td>
                <td>${team.factories}</td>
            </tr>
            <tr>
                <td><h2>Capacidade:</h2></td>
                <td>${team.employees} / ${team.factories*250}</td>
            </tr>
        </table>

        <div id="employees-actions">
            <div>
                <h2>Empregados</h2>
                <button id="contract-employees" `
        
            if((team.employees / (team.factories*250)) == 1)
                html += `disabled`;

        html += `>Contratar</button>
                <button id="dismiss-employees">Demitir</button>
            </div>

            <div>
                <h2>Fábrica</h2>
                <button id="expand-factory">Expandir</button>
                <button id="reduce-factory">Reduzir</button>
            </div>
        </div>
    </div>`;
    
    Swal.fire({
        title: `Empregados`,
        html: html,
        width: "30em",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    });

    document.querySelector("#contract-employees").addEventListener("click", () => {
        contractEmployees();
    });
    document.querySelector("#dismiss-employees").addEventListener("click", () => {
        dismissEmployees();
    });
    document.querySelector("#expand-factory").addEventListener("click", () => {
        expandFactory();
    });
    document.querySelector("#reduce-factory").addEventListener("click", () => {
        reduceFactory();
    });
}

function contractEmployees(){
    const team = game.teams[game.team];

    Swal.fire({
        title: `Contratar Empregados`,
        html: `
        <div id="contract-employees-alert">
            <div class="slidercontainer">
                <input id="slider-contract-employees" class="slider" type="range" min="0" value="0" step="1" max="${(team.factories*250)-team.employees}">
            </div>
    
            <p id="contract-employees-value">0</p>
        </div>
        `,
        width: "max-content",
        showCloseButton: false,
        focusConfirm: true,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if(result.isConfirmed){
            team.employees += Number(document.querySelector("#slider-contract-employees").value);
            document.querySelector("#engineers-name > tbody > tr:nth-child(6) > td > button").innerHTML = team.employees;
        }else if(result.isDenied){
            viewEmployees(game.team);
        }
        
        updateScreen();
    });

    document.querySelector("#slider-contract-employees").addEventListener("input", () => {
        document.querySelector("#contract-employees-value").innerHTML = document.querySelector("#slider-contract-employees").value;
    });
}

function dismissEmployees(){
    const team = game.teams[game.team];

    Swal.fire({
        title: `Demitir Empregados`,
        html: `
        <div id="dismiss-employees-alert">
            <div class="slidercontainer">
                <input id="slider-contract-employees" class="slider" type="range" min="0" value="0" step="1" max="${team.employees}">
            </div>
    
            <p id="dismiss-employees-value">0</p>
        </div>
        `,
        width: "max-content",
        showCloseButton: false,
        focusConfirm: true,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if(result.isConfirmed){
            team.employees -= Number(document.querySelector("#slider-contract-employees").value);
            document.querySelector("#engineers-name > tbody > tr:nth-child(6) > td > button").innerHTML = team.employees;

        }else if(result.isDenied){
            viewEmployees(game.team);
        }         
        
        updateScreen();
    });

    document.querySelector("#slider-contract-employees").addEventListener("input", () => {
        document.querySelector("#dismiss-employees-value").innerHTML = document.querySelector("#slider-contract-employees").value;
    });
}

function expandFactory(){
    const team = game.teams[game.team];

    Swal.fire({
        html: `
        Custo de Expansão: ${NumberF(team.factories*50000*1000,"ext",0)}
        `,
        width: "max-content",
        showCloseButton: false,
        focusConfirm: true,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if(result.isConfirmed){
            team.cash -= team.factories*50000;
            document.querySelector("#money").innerHTML = `<p><img id="money-icon" class="icon" src="img/money_icon.png" alt="Money Icon"> ${NumberF(team.cash * 1000,"ext",0)}</p>`;
            team.factories++;
        }else if(result.isDenied){
            viewEmployees(game.team);
        }
        
        updateScreen();
    });
}

function reduceFactory(){
    const team = game.teams[game.team];

    Swal.fire({
        html: `
        Lucro da Redução: ${NumberF(team.factories*10000*1000,"ext",0)}
        `,
        width: "max-content",
        showCloseButton: false,
        focusConfirm: true,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if(result.isConfirmed){
            if(team.employees > ((team.factories-1)*250)){
                team.employees = ((team.factories-1)*250);
                document.querySelector("#engineers-name > tbody > tr:nth-child(6) > td > button").innerHTML = team.employees;
            }
            
            team.cash += team.factories*10000;
            document.querySelector("#money").innerHTML = `<p><img id="money-icon" class="icon" src="img/money_icon.png" alt="Money Icon"> ${NumberF(team.cash * 1000,"ext",0)}</p>`;
            
            team.factories--;
            
        }else if(result.isDenied){
            viewEmployees(game.team);
        }
        
        updateScreen();
    });
}