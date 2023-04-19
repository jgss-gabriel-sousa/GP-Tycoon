import { accentsTidy } from "../utils.js";
import countryCodes from '../data/countryCodes.json' assert {type: 'json'}
import { game } from "../game.js";

export function viewDriver(name){
    let html = "";
    const driver = game.drivers[name];

    html += `
        <div id="view-driver">
            <img id="view-driver-driver-img" src="img/drivers/${name}.webp" onerror="this.src='img/drivers/generic.webp';">
            <table id="view-driver-infos">
                <th colspan="2">Dados Pessoais</th>
                <tr>
                    <td><h2>País: </h2></td>
                    <td>
                        <h2><img class="country-flag" src="img/flags/${driver.country}.webp">
                        ${countryCodes[driver.country]}</h2>
                    </td>
                </tr>
                <tr>
                    <td><h2>Idade: </h2></td>
                    <td><h2>${driver.age} anos</h2></td>
                </tr>
                <tr><td><span>&shy;</span></td></tr>
                <tr>
                    <td><h2>Títulos: </h2></td>
                    <td><h2>${driver.titles}</h2></td>
                </tr>
                <tr>
                    <td><h2>GP's: </h2></td>
                    <td><h2>${driver.gps}</h2></td>
                </tr>
                <tr>
                    <td><h2>Vitórias: </h2></td>
                    <td><h2>${driver.wins}</h2></td>
                </tr>
                <tr>
                    <td><h2>Pódios: </h2></td>
                    <td><h2>${driver.podiums}</h2></td>
                </tr>
                <tr>
                    <td><h2>Poles: </h2></td>
                    <td><h2>${driver.poles}</h2></td>
                </tr>
            </table>
            <table id="view-driver-contract">
                <th colspan="2">Contrato</th>
                <tr>
                    <td><h2>Equipe: </h2></td>
                    <td><h2>${driver.team}</h2></td>
                </tr>
                <tr>
                    <td><h2>Função: </h2></td>
                    <td><h2>${driver.function}</h2></td>
                </tr>
                <tr>
                    <td><h2>Salário: </h2></td>`

                if(driver.salary > 1){
                    html += `<td><h2>${driver.salary} Milhões por Corrida</h2></td>`
                }
                else{
                    html += `<td><h2>${Math.floor(driver.salary*1000)} Mil por Corrida</h2></td>`
                }

                html += `
                </tr>
                <tr>
                    <td><h2>Duração: </h2></td>
                    <td><h2>Até o fim de ${game.championship.year + driver.contractRemainingYears} (${driver.contractRemainingYears})</h2></td>
                </tr>
                <tr><td><span>&shy;</span></td></tr>
                <th colspan="2">Próx. Contrato</th>`
                    
    if(driver.contractRemainingYears == 0 && driver.newTeam){
            html+=`
                <tr>
                    <td><h2>Equipe: </h2></td>
                    <td><h2>${driver.newTeam}</h2></td>
                </tr>
                <tr>
                    <td><h2>Função: </h2></td>
                    <td><h2>${driver.newFunction}</h2></td>
                </tr>
                <tr>
                    <td><h2>Salário: </h2></td>`
                
                if(driver.salary > 1){
                    html += `<td><h2>${driver.newSalary} Milhões por Corrida</h2></td>`
                }
                else{
                    html += `<td><h2>${Math.floor(driver.newSalary*1000)} Mil por Corrida</h2></td>`
                }

                html += `
                </tr>
                <tr>
                    <td><h2>Duração: </h2></td>
                    <td><h2>Até o fim de ${game.championship.year + driver.contractRemainingYears} (${driver.contractRemainingYears})</h2></td>
                </tr>
            </table>
            </div>    
            `;
    }
    else if(driver.contractRemainingYears > 0){        
        html += `
            <tr>
                <td colspan="2" style="text-align: center";><h2>Ainda sob contrato</h2></td>
            </tr>
        </table>
        </div>    
        `;
    }
    else{        
        html += `
                    <tr>
                        <td><h2>Equipe: </h2></td>
                        <td><h2>Nenhuma</h2></td>
                    </tr>
                    <tr>
                        <td><h2>Função: </h2></td>
                        <td><h2>-</h2></td>
                    </tr>
                    <tr>
                        <td><h2>Salário: </h2></td>
                        <td><h2>-</h2></td>
                    </tr>
                    <tr>
                        <td><h2>Duração: </h2></td>
                        <td><h2>-</h2></td>
                    </tr>
                </table>
            </div>    
        `;
    }
    
    Swal.fire({
        title: `<strong>${name}</strong>`,
        html: html,
        width: "max-content",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    });
}