import { game } from "../scripts/game.js";
import { genTeamMainMenu } from "./mainMenu.js";
import { NumberF } from "../scripts/utils.js";

export function viewBank(){
    let html = "";
    const team = game.teams[game.team];
    const bank = team.bank;

    let newLoanAmount = 0;

    let loanValueTotal = 0;
    let installmentsValueTotal = 0;

    bank.loans.forEach(loan => {
        loanValueTotal += loan.value;
        installmentsValueTotal += loan.installmentsValue;
    });


    html += `<div id="bank-container">`;

    html += `
    <div>
        <h2>Dívidas</h2>
        <p>Dívida Total: ${NumberF(loanValueTotal,"ext-short",0)}</p>
        <p>Valor das Parcelas: ${NumberF(installmentsValueTotal*1000,"ext-short",0)}</p>
        <hr>
        <div id="loans-container">`

        bank.loans.forEach(loan => {
            html += `
                <div class="loan">
                    <p>${NumberF(loan.value,"ext-short",0)}</p>
                    <p>${loan.installmentsPayed}/${loan.installments} de ${NumberF(loan.installmentsValue*1000,"ext-short",0)}</p>
                </div>
            `
        });
        
    html += 
        `</div>
    </div>
    `

    if(bank.credit > 0){
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
                <input id="slider-installments" class="slider" type="range" min="1" max="${bank.credit <= 0 ? 0 : 50}" step="1" value="1">
            </div>
            <p>Parcelas: <span id="installments">${0}</span></p>
            <br>
            <p><span id="value-per-race">${NumberF(0,"ext-short",0)}</span> por corrida</p>
            <p>Dívida Total: <span id="value-total"></span></p>
            <p>Juros: <span id="interest-total"></span></p>
            <br>
            <button id="confirm" ${bank.credit <= 0 ? "disabled" : 0}>Confirmar</button>
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
        const total = Number(document.querySelector("#slider-amount").value);
        const interest = bank.loanInterestRate/100;
        const installments = Number(document.querySelector("#slider-installments").value);
        const interestValue = total*interest*installments;
        
        const perRace = (interestValue+total) / installments;

        document.querySelector("#value-total").innerHTML = `${NumberF(perRace*installments*1000,"ext-short",0)}`
        document.querySelector("#interest-total").innerHTML = `${NumberF((perRace*installments*1000)-(total*1000),"ext-short",0)}`

        return perRace;
    }

    if(bank.credit > 0){
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
            const installments = Number(document.querySelector("#slider-installments").value);
            const value = Math.round(calcPerRaceValue() * Number(document.querySelector("#slider-installments").value) * 1000);

            if(value == 0) return;
            
            let loan = {
                installments: installments,
                baseValue: value,
                value: value,
                installmentsValue: calcPerRaceValue(),
                installmentsPayed: 0,
            }
            
            bank.credit -= value/1000;

            bank.loans.push(loan);

            team.cash += Math.round(Number(document.querySelector("#slider-amount").value)/1000)*1000;

            viewBank();
        });
    }
}