import { game } from "./game.js"

const tooltipUpdateRate = 750;
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

    setInterval(() => {
        const team = game.teams[game.team];
        const eng = game.engineers;
        let teamPrincipal_pts = ((eng[team.teamPrincipal].adm + eng[team.teamPrincipal].aero)/2)/5;
        let technicalDirector_pts = ((eng[team.engineers.technicalDirector].adm * eng[team.engineers.technicalDirector].aero)/100)/5;
        let chiefDesigner_pts = (eng[team.engineers.chiefDesigner].aero)/5;
        const chiefAerodynamicist_pts = (eng[team.engineers.chiefAerodynamicist].aero * 2)/5;
        const employees_pts = ((team.employees/1000)+1)/2;
        document.querySelector("#aero-pts-value")._tippy.setContent(`
            <p>Chefe de Equipe: ${teamPrincipal_pts}</p>
            <p>Diretor Técnico: ${technicalDirector_pts}</p>
            <p>Designer Chefe: ${chiefDesigner_pts}</p>
            <p>Aerodinamicista Chefe: ${chiefAerodynamicist_pts}</p>
            <p>Empregados: ${teamPrincipal_pts+technicalDirector_pts+chiefDesigner_pts+chiefAerodynamicist_pts} * ${employees_pts*100}%</p>
        `);

        teamPrincipal_pts = ((eng[team.teamPrincipal].adm + eng[team.teamPrincipal].eng)/2)/5;
        technicalDirector_pts = ((eng[team.engineers.technicalDirector].adm * eng[team.engineers.technicalDirector].eng)/100)/5;
        chiefDesigner_pts = (eng[team.engineers.chiefDesigner].eng)/5;
        const chiefEngineering_pts = (eng[team.engineers.chiefEngineering].eng * 2)/5;
        document.querySelector("#eng-pts-value")._tippy.setContent(`
            <p>Chefe de Equipe: ${teamPrincipal_pts}</p>
            <p>Diretor Técnico: ${technicalDirector_pts}</p>
            <p>Designer Chefe: ${chiefDesigner_pts}</p>
            <p>Engenheiro Chefe: ${chiefEngineering_pts}</p>
            <p>Empregados: ${teamPrincipal_pts+technicalDirector_pts+chiefDesigner_pts+chiefEngineering_pts} * ${employees_pts*100}%</p>
        `);
    },tooltipUpdateRate);
}