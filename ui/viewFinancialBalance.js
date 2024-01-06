import { game } from "../scripts/game.js";
import { NumberF } from "../scripts/utils.js";
import { viewFinancialReport } from "./viewFinancialReport.js";

export function viewFinancialBalance(teamName, returnToFinancialReport){
    let html = "";
    const team = game.teams[teamName];

    html += `
    <div id="financial-balance">
        <div>
            <div class="chart-container">
                <canvas id="chart-raw"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="chart-accumulated"></canvas>
            </div>
        </div>
        <div>
            <div class="chart-container">
                <canvas id="chart-year"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="chart-accumulated"></canvas>
            </div>
        </div>
    </div>
    `;

    Swal.fire({
        title: `Balanço Financeiro ${teamName}`,
        html: html,
        width: "90%",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    }).then(e => {
        if(returnToFinancialReport){
            viewFinancialReport(teamName);
        }
    });

    let bgColor = [];
    team.balanceHistoric.raw.value.forEach(e => {
        if(e > 0){
            bgColor.push("rgba(75, 192, 75, 0.2)");
        }
        else{
            bgColor.push("rgba(192, 75, 75, 0.2)");
        }
    });

    new Chart(document.getElementById('chart-raw'), {
        type: 'bar',
        data: {
        labels: team.balanceHistoric.raw.legend,
        datasets: [{
            data: team.balanceHistoric.raw.value,
            backgroundColor: bgColor,
        }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: "Balanço a cada corrida"
                }
            },
        }
    });
    
    bgColor = [];
    team.balanceHistoric.accumulated.value.forEach(e => {
        if(e > 0){
            bgColor.push("rgba(75, 192, 75, 0.2)");
        }
        else{
            bgColor.push("rgba(192, 75, 75, 0.2)");
        }
    });
    new Chart(document.getElementById('chart-accumulated'), {
        type: 'bar',
        data: {
        labels: team.balanceHistoric.accumulated.legend,
        datasets: [{
            data: team.balanceHistoric.accumulated.value,
            backgroundColor: bgColor,
        }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: "Balanço Acumulado"
                }
            },
        }
    });

    bgColor = [];
    team.balanceHistoric.year.value.forEach(e => {
        if(e > 0){
            bgColor.push("rgba(75, 192, 75, 0.2)");
        }
        else{
            bgColor.push("rgba(192, 75, 75, 0.2)");
        }
    });
    new Chart(document.getElementById('chart-year'), {
        type: 'bar',
        data: {
        labels: team.balanceHistoric.year.legend,
        datasets: [{
            data: team.balanceHistoric.year.value,
            backgroundColor: bgColor,
        }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: "Balanço Anual"
                }
            },
        }
    });
}