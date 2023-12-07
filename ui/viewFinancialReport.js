import { game } from "../game.js";
import { NumberF } from "../utils.js";

export function viewFinancialReport(teamName){
    let html = "";
    const team = game.teams[teamName];

    const profitsList = ["Prize per Point","Prize per Place","Major Sponsor","Sponsors","Factory Sponsor"];
    let profits = 0;
    for(const p in profitsList) {
        profits += team.financialReport[profitsList[p]];
    }

    const expensesList = ["Drivers","Engineers","Employees","Development Investments","Engine","Fines","Constructions","Fees"];
    let expenses = 0;
    for(const p in expensesList) {
        expenses += team.financialReport[expensesList[p]];
    }

    html += `
    <div id="financial-report">
        <table>
            <tr>
                <th colspan="2">Lucros</th>
            </tr>
            <tr>
                <td>Prêmio por Pontuação de Corridas</td>
                <td>${NumberF(team.financialReport["Prize per Point"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <td>Prêmio por Pos. no Camp. de Construtores</td>
                <td>${NumberF(team.financialReport["Prize per Place"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <td>Patrocinador Principal</td>
                <td>${NumberF(team.financialReport["Major Sponsor"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <td>Patrocinadores</td>
                <td>${NumberF(team.financialReport["Sponsors"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <td>Patrocínio da Fábrica</td>
                <td>${NumberF(team.financialReport["Factory Sponsor"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <th></th>
                <th>${NumberF(profits * 1000,"ext",0)}</th>
            </tr>
        </table>
        <table>
            <tr>
                <th colspan="2">Despesas</th>
            </tr>
            <tr>
                <td>Salário Pilotos</td>
                <td>${NumberF(-team.financialReport["Drivers"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <td>Salário Engenheiros</td>
                <td>${NumberF(-team.financialReport["Engineers"] * 1000,"ext",1)}</td>
            </tr>
            <tr>
                <td>Salário Empregados</td>
                <td>${NumberF(-team.financialReport["Employees"] * 1000,"ext",1)}</td>
            </tr>
            <tr>
                <td>Investimentos de Desenvolvimento</td>
                <td>${NumberF(-team.financialReport["Development Investments"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <td>Contrato de Motores</td>
                <td>${NumberF(-team.financialReport["Engine"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <td>Multas (Rescisórias, Punições, Outras)</td>
                <td>${NumberF(-team.financialReport["Fines"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <td>Construções</td>
                <td>${NumberF(-team.financialReport["Constructions"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <td>Juros</td>
                <td>${NumberF(-team.financialReport["Fees"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <th></th>
                <th>${NumberF(-expenses * 1000,"ext",0)}</th>
            </tr>
        </table>
    </div>
    
    <div id="financial-report-balance">
        <div class="chart-container">
            <canvas id="profit-chart"></canvas>
        </div>

        <table id="balance">
            <tr>
                <th>Balanço: </th>
                <td>${NumberF(team.financialReport["Balance"] * 1000,"ext",0)}</td>
            </tr>
        </table>
        
        <div class="chart-container">
            <canvas id="expenses-chart"></canvas>
        </div>
    </div>
    `;

    Swal.fire({
        title: `Relatório Financeiro ${teamName}`,
        html: html,
        width: "90%",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    });

    const profitChartData = [];
    for(const p in profitsList) {
        profitChartData.push(parseInt(team.financialReport[profitsList[p]]*1000, 10));
    }
    const expensesChartData = [];
    for(const p in expensesList) {
        expensesChartData.push(Math.abs(parseInt(team.financialReport[expensesList[p]]*1000, 10)));
    }

    new Chart(document.getElementById('profit-chart'), {
        type: 'pie',
        data: {
        labels: ["Prêmio por Pontuação","Prêmio por Posição","Patrocinador Principal","Patrocinadores","Patrocínio da Fábrica"],
        datasets: [{
            data: profitChartData,
            borderWidth: 1
        }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    });
    new Chart(document.getElementById('expenses-chart'), {
        type: 'pie',
        data: {
        labels: ["Pilotos","Engenheiros","Empregados","Desenvolvimento","Contrato de Motores","Multas","Construções","Juros"],
        datasets: [{
            data: expensesChartData,
            borderWidth: 1
        }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    });
}