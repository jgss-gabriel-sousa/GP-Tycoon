import { game } from "../scripts/game.js";
import { NumberF } from "../scripts/utils.js";

export function viewReputation(teamName){
    let html = "";
    const team = game.teams[teamName];

    let reputationHTML = "<div><h3>Reputação<h3>"
    let remainingStars = team.reputation;
    for(let i = 0; i < 5; i++, remainingStars -= 1) {
        if(remainingStars > 0 && remainingStars >= 1){
            reputationHTML += `<span><iconify-icon icon="fa:star"></iconify-icon></span>`;
        }
        else if(remainingStars == 0.5){
            reputationHTML += `<span><iconify-icon icon="fa:star-half-empty"></iconify-icon></span>`;
        }
        else{
            reputationHTML += `<span><iconify-icon icon="fa:star-o"></iconify-icon></span>`;
        }
    }
    
    reputationHTML += `
        <p>Equipe ${team.reputationTitle}</p>
    </div>
    `

    let performanceHTML = "<div><h4>Performance<h4>"
    remainingStars = team.performance;
    for(let i = 0; i < 5; i++, remainingStars -= 1) {
        if(remainingStars > 0 && remainingStars >= 1){
            performanceHTML += `<span><iconify-icon icon="fa:star"></iconify-icon></span>`;
        }
        else if(remainingStars == 0.5){
            performanceHTML += `<span><iconify-icon icon="fa:star-half-empty"></iconify-icon></span>`;
        }
        else{
            performanceHTML += `<span><iconify-icon icon="fa:star-o"></iconify-icon></span>`;
        }
    }
    performanceHTML += `<p>${game.year-1} - ${team.history.lastResults[game.year-1].pts} pts = ${team.history.lastResults[game.year-1].position}º</p>`
    performanceHTML += `<p>${game.year-2} - ${team.history.lastResults[game.year-2].pts} pts = ${team.history.lastResults[game.year-2].position}º</p>`
    performanceHTML += `<p>${game.year-3} - ${team.history.lastResults[game.year-3].pts} pts = ${team.history.lastResults[game.year-3].position}º</p>`
    performanceHTML += "</div>"

    let developmentHTML = "<div><h4>Capacidade de Desenvolvimento<h4>"
    remainingStars = team.developmentReputation;
    console.log(team.developmentReputation)
    for(let i = 0; i < 5; i++, remainingStars -= 1) {
        if(remainingStars > 0 && remainingStars >= 1){
            developmentHTML += `<span><iconify-icon icon="fa:star"></iconify-icon></span>`;
        }
        else if(remainingStars == 0.5){
            developmentHTML += `<span><iconify-icon icon="fa:star-half-empty"></iconify-icon></span>`;
        }
        else{
            developmentHTML += `<span><iconify-icon icon="fa:star-o"></iconify-icon></span>`;
        }
    }
    developmentHTML += `<p>${team.aeroPts} Aero</p>`
    developmentHTML += `<p>${team.engPts} Eng</p>`
    developmentHTML += "</div>"

    let politicsHTML = "<div><h4>Força Política<h4>"
    remainingStars = team.politicalReputation;
    for(let i = 0; i < 5; i++, remainingStars -= 1) {
        if(remainingStars > 0 && remainingStars >= 1){
            politicsHTML += `<span><iconify-icon icon="fa:star"></iconify-icon></span>`;
        }
        else if(remainingStars == 0.5){
            politicsHTML += `<span><iconify-icon icon="fa:star-half-empty"></iconify-icon></span>`;
        }
        else{
            politicsHTML += `<span><iconify-icon icon="fa:star-o"></iconify-icon></span>`;
        }
    }
    politicsHTML += `<p>${team.politicalForce}/10</p>`
    politicsHTML += "</div>"

    let fansHTML = "<div><h4>Fans<h4>"
    remainingStars = team.fansReputation;
    for(let i = 0; i < 5; i++, remainingStars -= 1) {
        if(remainingStars > 0 && remainingStars >= 1){
            fansHTML += `<span><iconify-icon icon="fa:star"></iconify-icon></span>`;
        }
        else if(remainingStars == 0.5){
            fansHTML += `<span><iconify-icon icon="fa:star-half-empty"></iconify-icon></span>`;
        }
        else{
            fansHTML += `<span><iconify-icon icon="fa:star-o"></iconify-icon></span>`;
        }
    }
    fansHTML += `<p>${NumberF(team.fans * 1000000,"ext-short",0)}</p>`
    fansHTML += "</div>"

    let traditionHTML = "<div><h4>Tradição<h4>"
    remainingStars = team.tradition;
    for(let i = 0; i < 5; i++, remainingStars -= 1) {
        if(remainingStars > 0 && remainingStars > 1){
            traditionHTML += `<span><iconify-icon icon="fa:star"></iconify-icon></span>`;
        }
        else if(remainingStars == 0.5){
            traditionHTML += `<span><iconify-icon icon="fa:star-half-empty"></iconify-icon></span>`;
        }
        else{
            traditionHTML += `<span><iconify-icon icon="fa:star-o"></iconify-icon></span>`;
        }
    }
    traditionHTML += `<p>${team.history.titles} Títulos</p>`
    traditionHTML += "</div>"

    html += `
    ${reputationHTML}
    <div id="view-reputation">
        ${performanceHTML}
        ${developmentHTML}
        ${politicsHTML}
        ${fansHTML}
        ${traditionHTML}
    </div>
    `;


    Swal.fire({
        title: `${teamName}`,
        html: html,
        width: "75%",
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    }).then(e => {
        ;
    });
}