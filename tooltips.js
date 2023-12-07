import { game } from "./game.js"

const tooltipMaxWidth = 500;

function createTooltip(id, content){
    if(!document.querySelector(id)._tippy){
        tippy(id, {
            maxWidth: tooltipMaxWidth,
            theme: 'material',
            content: content,
            allowHTML: true
        });
    }
}

export function tooltips(){
    createTooltip("#btn-save-game", "Salvar Jogo");
    createTooltip("#btn-save-game", "Salvar Jogo");
    createTooltip("#btn-options", "Opções do Jogo");
    createTooltip("#btn-standings", "Classificação de Pilotos");
    createTooltip("#btn-team-standings", "Classificação de Construtores");
    createTooltip("#btn-market", "Mercado de Pilotos");
    createTooltip("#btn-market-eng", "Mercado de Engenheiros");
    createTooltip("#btn-historic", "Histórico de Campeões");

    createTooltip("#dev-pts > div:nth-child(1) > h2:nth-child(2)", "Pontos de Desenvolvimento de Aerodinâmica");
    createTooltip("#dev-pts > div:nth-child(2) > h2:nth-child(2)", "Pontos de Desenvolvimento de Engenharia");
    createTooltip("#aero-pts-value","");
    createTooltip("#eng-pts-value","");

    const team = game.teams[game.team];
    const eng = game.engineers;
    let teamPrincipal_pts = ((eng[team.teamPrincipal].adm + eng[team.teamPrincipal].aero)/2)/5;
    let technicalDirector_pts = ((eng[team.engineers.technicalDirector].adm * eng[team.engineers.technicalDirector].aero)/100)/5;
    let chiefDesigner_pts = (eng[team.engineers.chiefDesigner].aero)/5;
    const chiefAerodynamicist_pts = (eng[team.engineers.chiefAerodynamicist].aero * 2)/5;
    const employees_pts = ((team.employees/1000)+1)/2;
    document.querySelector("#aero-pts-value")._tippy.setContent(`
        <table style="text-align: end;">
            <tr>
                <td>Chefe de Equipe:</td>
                <td>${teamPrincipal_pts.toFixed(1)}</td>
            </tr>
            <tr>
                <td>Diretor Técnico:</td>
                <td>${technicalDirector_pts.toFixed(1)}</td>
            </tr>
            <tr>
                <td>Designer Chefe:</td>
                <td>${chiefDesigner_pts.toFixed(1)}</td>
            </tr>
            <tr>
                <td>Aerodinamicista Chefe:</td>
                <td>${chiefAerodynamicist_pts.toFixed(1)}</td>
            </tr>
        </table>
        <br>
        <p>Qtd de Empregados: ${employees_pts*100}%</p>
        <p>Moral da Equipe: ${team.teamMorale}%</p>
    `);

    teamPrincipal_pts = ((eng[team.teamPrincipal].adm + eng[team.teamPrincipal].eng)/2)/5;
    technicalDirector_pts = ((eng[team.engineers.technicalDirector].adm * eng[team.engineers.technicalDirector].eng)/100)/5;
    chiefDesigner_pts = (eng[team.engineers.chiefDesigner].eng)/5;
    const chiefEngineering_pts = (eng[team.engineers.chiefEngineering].eng * 2)/5;
    document.querySelector("#eng-pts-value")._tippy.setContent(`
        <table style="text-align: end;">
            <tr>
                <td>Chefe de Equipe:</td>
                <td>${teamPrincipal_pts.toFixed(1)}</td>
            </tr>
            <tr>
                <td>Diretor Técnico:</td>
                <td>${technicalDirector_pts.toFixed(1)}</td>
            </tr>
            <tr>
                <td>Designer Chefe:</td>
                <td>${chiefDesigner_pts.toFixed(1)}</td>
            </tr>
            <tr>
                <td>Engenheiro Chefe:</td>
                <td>${chiefEngineering_pts.toFixed(1)}</td>
            </tr>
        </table>
        <br>
        <p>Qtd de Empregados: ${employees_pts*100}%</p>
        <p>Moral da Equipe: ${team.teamMorale}%</p>
    `);
}