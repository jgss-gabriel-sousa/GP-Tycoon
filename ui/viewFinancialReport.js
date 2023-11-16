import { game } from "../game.js";
import { NumberF } from "../utils.js";

export function viewFinancialReport(teamName){
    let html = "";
    const team = game.teams[teamName];

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
                <th colspan="2">Despesas</th>
            </tr>
            <tr>
                <td>Salário 1º Piloto</td>
                <td>${NumberF(-team.financialReport["1st Driver"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <td>Salário 2º Piloto</td>
                <td>${NumberF(-team.financialReport["2nd Driver"] * 1000,"ext",0)}</td>
            </tr>
            <tr>
                <td>Salário Piloto de Testes</td>
                <td>${NumberF(-team.financialReport["Test Driver"] * 1000,"ext",0)}</td>
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
                <th>Balanço: </th>
                <th>${NumberF(team.financialReport["Balance"] * 1000,"ext",0)}</th>
            </tr>
        </table>
    </div>`;

    Swal.fire({
        title: `Relatório Financeiro ${teamName}`,
        html: html,
        width: "40em",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    });
}