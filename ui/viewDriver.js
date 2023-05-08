import { accentsTidy, NumberF } from "../utils.js";
import { countryCodes } from "../data/countryCodes.js";
import { game } from "../game.js";
import { market } from "./market.js";

export function viewDriver(name, returnToMarket){
    let html = "";
    const driver = game.drivers[name];

    html += `
        <div id="view-driver">
            <img id="view-driver-driver-img" src="img/drivers/${name}.webp" onerror="this.onerror=null;this.src='img/drivers/generic.webp';">
            <table id="view-driver-infos">
                <th colspan="2">Dados Pessoais</th>
                <tr>
                    <td>País:</td>
                    <td>
                        <img class="country-flag" src="img/flags/${accentsTidy(driver.country)}.webp">
                        ${countryCodes[driver.country]}
                    </td>
                </tr>
                <tr>
                    <td>Idade:</td>
                    <td>${driver.age} anos</td>
                </tr>
                <tr><td><span>&shy;</span></td></tr>
                <tr>
                    <td>Títulos:</td>
                    <td>${driver.titles}</td>
                </tr>
                <tr>
                    <td>GP's:</td>
                    <td>${driver.gps}</td>
                </tr>
                <tr>
                    <td>Vitórias:</td>
                    <td>${driver.wins}</td>
                </tr>
                <tr>
                    <td>Pódios:</td>
                    <td>${driver.podiums}</td>
                </tr>
                <tr>
                    <td>Poles:</td>
                    <td>${driver.poles}</td>
                </tr>
            </table>
            <table id="view-driver-contract">
                <th colspan="2">Contrato</th>
                <tr>
                    <td>Equipe:</td>
                    <td style="background-color: ${game.teams[driver.team].result_bg_color}; color: ${game.teams[driver.team].result_font_color}">
                    ${driver.team}</td>
                </tr>
                <tr>
                    <td>Função:</td>
                    <td>${driver.status}</td>
                </tr>
                <tr>
                    <td>Salário:</td>
                    <td>${NumberF(driver.salary*1000000,"ext",0)} por Corrida</td>
                </tr>
                <tr>
                    <td>Duração:</td>
                    <td>Até o fim de ${game.year + driver.contractRemainingYears} (${driver.contractRemainingYears} ${driver.contractRemainingYears > 1 ? "Anos" : "Ano"})</td>
                </tr>`
                    
    if(driver.contractRemainingYears == 0 && driver.newTeam){
            html+=`
                <tr><th colspan="2">Próx. Contrato</th></tr>
                <tr>
                    <td>Equipe:</td>
                    <td style="background-color: ${game.teams[driver.newTeam].result_bg_color}; color: ${game.teams[driver.newTeam].result_font_color}">
                    ${driver.newTeam}</td>
                </tr>
                <tr>
                    <td>Função:</td>
                    <td>${driver.newStatus}</td>
                </tr>
                <tr>
                    <td>Salário:</td>
                    <td>${NumberF(driver.newSalary*1000000,"ext",0)} por Corrida</td>
                </tr>
                <tr>
                    <td>Duração:</td>
                    <td>Até o fim de ${game.year + driver.newContractRemainingYears} (${driver.newContractRemainingYears})</td>
                </tr>
            </table>
            </div>    
            `;
    }
    else if(driver.contractRemainingYears <= 0){        
        html += `
            <tr><th colspan="2">Próx. Contrato</th></tr>
            <tr>
                <td>Equipe:</td>
                <td>Nenhuma</td>
            </tr>
            <tr>
                <td>Função:</td>
                <td>-</td>
            </tr>
            <tr>
                <td>Salário:</td>
                <td>-</td>
            </tr>
            <tr>
                <td>Duração:</td>
                <td>-</td>
            </tr>`
            
        if((!game.teams[game.team].new1driver || !game.teams[game.team].new2driver || !game.teams[game.team].newTdriver)){
            html +=`
            <tr>
                <td colspan="2" style="text-align: center;">
                    <button id="negotiate">Negociar</button>
                </td>
            </tr>`
        }

        html +=`
        </table>
        </div>    
        `;
    }
    else{
        html += `
        </table>
        </div>  
        `
    }
    
    Swal.fire({
        title: `${name}`,
        html: html,
        width: "max-content",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    }).then(r => {
        if(returnToMarket)
            market();
    });

    if(document.querySelector("#negotiate"))
        document.querySelector("#negotiate").addEventListener("click", () => negotiate(driver.name, returnToMarket));
}

function negotiate(driverName, returnToMarket){
    let html = "";
    const driver = game.drivers[driverName];
    const team = game.teams[game.team];

    html += `
    <div id="negotiate-market">
        <img id="view-driver-driver-img" src="img/drivers/${driver.name}.webp" onerror="this.onerror=null;this.src='img/drivers/generic.webp';">
        
        <div>
            <div class="slidercontainer">
                <input id="slider-duration" class="slider" type="range" min="1" value="1" step="1" max="5">
            </div>
            <p id="years">1 Ano</p>
            <br>

            <div class="slidercontainer">
                <input id="slider-salary" class="slider" type="range" min="${(driver.salary/2)*1000}" step="5" value="${driver.salary*1000}" max="${driver.salary*2000}">
            </div>
            <p id="salary">Salário: ${NumberF(driver.salary * 1000000,"ext-short",0)} por corrida</p>
            <br>

            <p id="salary">Salário Anterior: ${NumberF(driver.salary * 1000000,"ext-short",0)} por corrida</p>
            <br>

            <select>
                ${team.new1driver == "" ? "<option>1º Piloto</option>" : ""}
                ${team.new2driver == "" ? "<option>2º Piloto</option>" : ""}
                ${team.newTdriver == "" ? "<option>Piloto de Testes</option>" : ""}
            </select>
            
            <br>
            <br>
            <h4>Aprovação: <span id="approbation">--</span>%</h4>
        </div>
    </div>
    `

    Swal.fire({
        title: `${driver.name}`,
        html: html,
        width: "40em",
        showCloseButton: false,
        focusConfirm: true,
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        denyButtonText: "Cancelar",
    }).then((result) => {
        if(result.isConfirmed){
            if(!document.querySelector("select").value){
                ;
            }
            else{
                if((Math.random()*100) < approbationCalc(driver.name)){
                    driver.newTeam = game.team;
                    driver.newStatus = document.querySelector("select").value;
                    driver.newSalary = Number(document.querySelector("#slider-salary").value)/1000;
                    driver.newContractRemainingYears = Number(document.querySelector("#slider-duration").value);
                    
                    if(driver.newStatus == "1º Piloto") team.new1driver = driver.name;
                    if(driver.newStatus == "2º Piloto") team.new2driver = driver.name;
                    if(driver.newStatus == "Piloto de Testes") team.newTdriver = driver.name;

                    Swal.fire("Contrato Assinado").then(e => {
                        if(returnToMarket)
                            market();
                    });
                }
                else{
                    Swal.fire("Contrato Recusado").then(e => {
                        if(returnToMarket)
                            market();
                    });
                }
            }

        }else if(result.isDenied){
            viewDriver(driver.name, returnToMarket)
        }
    });

    approbationCalc(driver.name);

    document.querySelector("#slider-duration").addEventListener("input", () => {
        const sliderValue = Number(document.querySelector("#slider-duration").value);

        document.querySelector("#years").innerHTML = sliderValue == 1 ? sliderValue+" ano" : sliderValue+" anos";
        approbationCalc(driver.name);
    });

    document.querySelector("#slider-salary").addEventListener("input", () => {
        const sliderValue = Number(document.querySelector("#slider-salary").value);

        document.querySelector("#salary").innerHTML = "Salário: "+NumberF(sliderValue * 1000,"ext-short",0)+" por corrida";
        approbationCalc(driver.name);
    });
}

function approbationCalc(driverName){
    const driver = game.drivers[driverName];
    let value;

    if(!document.querySelector("select").innerText){
        document.querySelector("#approbation").innerText = "--";
        return;
    }

    const duration = Number(document.querySelector("#slider-duration").value);
    const salary = Number(document.querySelector("#slider-salary").value)/1000;
    value = 70;
    value *= (duration * 0.5) / ((driver.experience+10)/100);
    value *= Math.pow(salary / driver.salary,2);

    if((salary / driver.salary) < 1){
        value *=  Math.pow(salary / driver.salary,8);
    }

    if(value > 100)
        value = 100;
    if(value < 5)
        value = 0;

    document.querySelector("#approbation").innerText = Math.round(value);
    return Math.round(value);
}