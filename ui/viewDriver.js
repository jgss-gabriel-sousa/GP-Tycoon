import { accentsTidy } from "../utils.js";
import countryCodes from '../data/countryCodes.json' assert {type: 'json'}
import { game } from "../game.js";
import { market } from "./market.js";

export function viewDriver(name, returnToMarket){
    let html = "";
    const driver = game.drivers[name];

    html += `
        <div id="view-driver">
            <img id="view-driver-driver-img" src="img/drivers/${name}.webp" onerror="this.src='img/drivers/generic.webp';">
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
                    <td>${driver.team}</td>
                </tr>
                <tr>
                    <td>Função:</td>
                    <td>${driver.status}</td>
                </tr>
                <tr>
                    <td>Salário:</td>`

                if(driver.salary > 1){
                    html += `<td>${driver.salary} Milhões por Corrida</td>`
                }
                else{
                    html += `<td>${Math.floor(driver.salary*1000)} Mil por Corrida</td>`
                }

                html += `
                </tr>
                <tr>
                    <td>Duração:</td>
                    <td>Até o fim de ${game.year + driver.contractRemainingYears} (${driver.contractRemainingYears} ${driver.contractRemainingYears > 1 ? "Anos" : "Ano"})</td>
                </tr>
                <tr><td><span>&shy;</span></td></tr>
                <th colspan="2">Próx. Contrato</th>`
                    
    if(driver.contractRemainingYears == 0 && driver.newTeam){
            html+=`
                <tr>
                    <td>Equipe:</td>
                    <td>${driver.newTeam}</td>
                </tr>
                <tr>
                    <td>Função:</td>
                    <td>${driver.newStatus}</td>
                </tr>
                <tr>
                    <td>Salário:</td>`
                
                if(driver.salary > 1){
                    html += `<td>${driver.newSalary} Milhões por Corrida</td>`
                }
                else{
                    html += `<td>${Math.floor(driver.newSalary*1000)} Mil por Corrida</td>`
                }

                html += `
                </tr>
                <tr>
                    <td>Duração:</td>
                    <td>Até o fim de ${game.year + driver.contractRemainingYears} (${driver.contractRemainingYears})</td>
                </tr>
            </table>
            </div>    
            `;
    }
    else if(driver.contractRemainingYears > 0){        
        html += `
            <tr>
                <td colspan="2" style="text-align: center";>Ainda sob contrato</td>
            </tr>
        </table>
        </div>    
        `;
    }
    else{        
        html += `
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
                    </tr>
                </table>
            </div>    
        `;
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
}