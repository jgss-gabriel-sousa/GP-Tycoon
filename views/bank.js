import { game } from "../scripts/game.js";
import { genTeamMainMenu } from "./mainMenu.js";
import { NumberF } from "../scripts/utils.js";

export function bankUI(){
    let html = "";
    const team = game.teams[game.team];
    const bank = team.bank;

    let newLoanAmount = 0;

    html += `<div id="bank-container">`;

    html += `
    <div>
        <h2>Dívidas</h2>
        <p>Dívida Total: ${NumberF(bank.loanValue,"ext-short",0)}</p>
        <br>
        <p>Valor das Parcelas: ${NumberF(bank.installmentsValue*1000,"ext-short",0)}</p>
        <p>Parcelas: ${bank.loanInstallmentsPayed}/${bank.loanInstallments}</p>
    </div>
    `

    if(bank.loanValue == 0){
        html += `
        <div>
            <h2>Novo Empréstimo</h2>
            <p>Crédito Disponível: ${NumberF(bank.credit*1000,"ext-short",0)}</p>  
            <p>Taxa de Juros: ${bank.loanInterestRate}%</p>
            <br>


            <div class="slidercontainer">
                <input id="slider-amount" class="slider" type="range" min="${0}" value="0" step="${Math.round(bank.credit/50)}" max="${bank.credit}">
            </div>
            <p>Valor: <span id="amount">0</span></p>
            <br>

            <div class="slidercontainer">
                <input id="slider-installments" class="slider" type="range" min="1" max="${bank.credit <= 0 ? 0 : 30}" value="1">
            </div>
            <p>Parcelas: <span id="installments">${0}</span></p>
            <br>
            <p><span id="value-per-race">${NumberF(0,"ext-short",0)}</span> por ano</p>
            <p>Juros: <span id="interest-total"></span></p>
            <p>Dívida Total: <span id="value-total"></span></p>
            <br>
            <button id="confirm" ${bank.credit <= 0 ? "disabled" : 0}>Confirmar</button>
        </div>`
    }
    else{
        html += `
        <div>
            <h2>Renegociar Empréstimo</h2>
            <p>Crédito Disponível: ${bank.credit > 0 ? NumberF(bank.credit*1000,"ext-short",0) : 0}</p>  
            <p>Taxa de Juros: ${bank.loanInterestRate}%</p>
            <br>

            <div class="slidercontainer">
                <input id="slider-amount" class="slider" type="range" min="${bank.loanValue/1000}" value="${bank.loanValue/1000}" step="${Math.round(bank.credit/50)}" max="${(bank.loanValue/1000 )+ bank.credit}">
            </div>
            <p>Valor: <span id="amount">0</span></p>
            <br>

            <div class="slidercontainer">
                <input id="slider-installments" class="slider" type="range" min="1" max="${bank.credit <= 0 ? 0 : 30}" value="1">
            </div>
            <p>Parcelas: <span id="installments">${0}</span></p>
            <br>
            <p><span id="value-per-race">${NumberF(0,"ext-short",0)}</span> por ano</p>
            <p>Juros: <span id="interest-total"></span></p>
            <p>Dívida Total: <span id="value-total"></span></p>
            <br>
            <button id="confirm" ${bank.credit <= 0 ? "disabled" : 0} >Confirmar</button>
        </div>`
    }

    html += `</div>`;


    Swal.fire({
        title: `Banco`,
        html: html,
        width: "90%",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    }).then(e => {
        genTeamMainMenu();
    });


    function calcPerRaceValue(){
        const total = Math.ceil(Number(document.querySelector("#slider-amount").value)/1000)*1000;
        const interest = bank.loanInterestRate/100;
        const installments = Number(document.querySelector("#slider-installments").value);
        const interestValue = Math.ceil((total*interest*installments)/1000)*1000;
        
        const perRace = Math.ceil(((interestValue+total) / installments)/1000)*1000;

        document.querySelector("#interest-total").innerHTML = `${NumberF((perRace*installments*1000)-(total*1000),"ext-short",0)}`
        document.querySelector("#value-total").innerHTML = `${NumberF(perRace*installments*1000,"ext-short",0)}`

        return perRace;
    }

    document.querySelector("#slider-amount").addEventListener("input", () => {
        const sliderValue = Math.ceil(Number(document.querySelector("#slider-amount").value)/1000)*1000;

        document.querySelector("#amount").innerHTML = `${NumberF(sliderValue*1000,"ext-short",0)}`;
        
        if(Number(document.querySelector("#installments").innerHTML) == 0){
            document.querySelector("#installments").innerHTML = "1";
        }

        document.querySelector("#value-per-race").innerHTML = NumberF(calcPerRaceValue()*1000,"ext-short",0);
        
    });

    document.querySelector("#slider-installments").addEventListener("input", () => {
        const sliderValue = Number(document.querySelector("#slider-installments").value);

        document.querySelector("#installments").innerHTML = sliderValue;
        document.querySelector("#value-per-race").innerHTML = NumberF(calcPerRaceValue()*1000,"ext-short",0);
    });

    document.querySelector("#confirm").addEventListener("click", () => {
        bank.loanInstallments = Number(document.querySelector("#slider-installments").value);
        bank.loanValue = Math.round(calcPerRaceValue() * bank.loanInstallments * 1000);
        bank.installmentsValue = calcPerRaceValue();
        bank.loanInstallmentsPayed = 0;
        bank.credit -= bank.loanValue/1000;
        bankUI();
        team.cash += Math.ceil(Number(document.querySelector("#slider-amount").value)/1000)*1000;
    });
}