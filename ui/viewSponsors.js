import { accentsTidy, NumberF } from "../scripts/utils.js";
import { countryCodes } from "../data/countryCodes.js";
import { game } from "../scripts/game.js";
import { market } from "./market.js";
import { getSalary } from "../scripts/drivers.js";
import { genTeamHTML } from "../scripts/main.js";
import { publishNews } from "./news.js";

export function viewSponsors(){
    let html = "";
    const team = game.teams[game.team];

    html += `
        <div id="view-sponsors">
        </div>`;
    
    Swal.fire({
        title: `Patrocinadores`,
        html: html,
        width: "max-content",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    }).then(r => {
        if(returnToMarket)
            market(scrollPos);
    });
}

function negotiate(driverName, returnToMarket){
    let html = "";
    const driver = game.drivers[driverName];
    const team = game.teams[game.team];
    
    html += `
    <div id="negotiate-market">
        <img id="view-driver-driver-img" src="img/drivers/${driver.image}.webp" onerror="this.onerror=null;this.src='img/drivers/generic.webp';">
        
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
            `
            if(team.driversAcademy.length < 10 && driver.experience == 0){
                html += `<option>Piloto da Academia</option>`;
            }
            
            html += `
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

                    publishNews("Breaking Driver Hire", [game.team, driver.name, driver.newStatus, driver.newContractRemainingYears]);

                    Swal.fire("Contrato Assinado").then(e => {
                        if(returnToMarket)
                            market(scrollPos);
                    });
                }
                else{
                    Swal.fire("Contrato Recusado").then(e => {
                        game.contractsFailed.push(driver.name);

                        if(returnToMarket)
                            market(scrollPos);
                    });
                }
                
                genTeamHTML();
            }
        }
        else if(result.isDenied){
            viewDriver(driver.name, returnToMarket)
        }
    });

    approbationCalc(driver.name);

    document.querySelector("select").addEventListener("change", () => {
        approbationCalc(driver.name);
    });

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
    const team = game.teams[game.team];
    let chance;

    if(!document.querySelector("select").innerText){
        document.querySelector("#approbation").innerText = "--";
        return;
    }

    const duration = Number(document.querySelector("#slider-duration").value);
    const salary = Number(document.querySelector("#slider-salary").value)/1000;
    const status = document.querySelector("select").value;
    chance = 70;
    chance *= (duration * 0.5) / ((driver.experience+10)/100);
    chance *= Math.pow(salary / getSalary(driver),2);

    if(status == "Piloto da Academia" && driver.age <= driver.careerPeak)
        chance *= ((duration * 0.5) / ((6-team.reputation) * 500)) * 50;

    if(status == "Piloto de Testes" && driver.age <= driver.careerPeak)
        chance *= ((duration * 0.5) / ((driver.experience+10) * 5)) * 50;

    if(status == "2º Piloto" && driver.age <= driver.careerPeak && driver.titles > 0)
        chance *= ((salary * 0.5) / ((driver.experience+10) * 5)) * 50;

    if(status != "Piloto da Academia" && (salary / driver.salary) < 1){
        chance *=  Math.pow(salary / driver.salary,8);
    }

    if(chance > 100) chance = 100;
    if(chance < 5) chance = 0;

    document.querySelector("#approbation").innerText = Math.round(chance);
    return Math.round(chance);
}