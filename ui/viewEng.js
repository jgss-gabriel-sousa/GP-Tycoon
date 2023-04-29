import { accentsTidy } from "../utils.js";
import countryCodes from '../data/countryCodes.json' assert {type: 'json'}
import { game } from "../game.js";

export function viewEng(name){
    let html = "";
    const eng = game.engineers[name];

    html += `
    <div id="view-driver">
        <div id="view-eng">
            <div>
                <div id="eng-stats">
                    <div>
                        <h1>${eng.aero}</h1>
                        Aerodinâmica</h2>
                    </div>
                    <div>
                        <h1>${eng.eng}</h1>
                        Engenharia</h2>
                    </div>
                    <div>
                        <h1>${eng.adm}</h1>
                        Administração</h2>
                    </div>
                </div>
                <table id="view-driver-infos">
                    <th colspan="2">Dados Pessoais</th>
                    <tr>
                        <td>País:</td>
                        <td>
                            <img class="country-flag" src="img/flags/${accentsTidy(eng.country)}.webp">
                            ${countryCodes[eng.country]}
                        </td>
                    </tr>
                    <tr>
                        <td>Idade:</td>
                        <td>${eng.age} anos</td>
                    </tr>
                    <tr>
                        <td>Função:</td>
                        <td>${eng.occupation}</td>
                    </tr>
                    <tr>
                        <td>Salário:</td>
                        <td>${eng.salary} Mil por Corrida</td>
                    </tr>
                </table>
            </div>

            <div>
                <button id="dismiss-eng" value="${name}">Demitir</button>
                <button id="dismiss-eng" value="${name}">Trocar de Função</button>
            </div>    
        </div>
    </div>`;
    
    Swal.fire({
        title: `${name}`,
        html: html,
        width: "max-content",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    });
}