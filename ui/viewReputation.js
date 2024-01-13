import { game } from "../scripts/game.js";
import { NumberF } from "../scripts/utils.js";

export function viewReputation(teamName){
    let html = "";
    const team = game.teams[teamName];

    let reputationHTML = "<div><h3>Reputação<h3>"
    let remainingStars = team.reputation;
    for(let i = 0; i < 5; i++) {
        if(remainingStars-- > 0){
            reputationHTML += `<span><i class="lni lni-star-fill"></i></span>`;
        }
        else{
            reputationHTML += `<span><i class="lni lni-star-empty"></i></span>`;
        }
    }
    if(team.reputation == 5)    reputationHTML += "<p>Dominante<p>"
    if(team.reputation == 4)    reputationHTML += "<p>Poderosa<p>"
    if(team.reputation == 3)    reputationHTML += "<p>Competitiva<p>"
    if(team.reputation == 2)    reputationHTML += "<p>Emergente<p>"
    if(team.reputation == 1)    reputationHTML += "<p>Fim do Pelotão<p>"

    reputationHTML += "</div>"

    let performanceHTML = "<div><h4>Performance<h4>"
    remainingStars = team.performance;
    for(let i = 0; i < 5; i++) {
        if(remainingStars-- > 0){
            performanceHTML += `<span><i class="lni lni-star-fill"></i></span>`;
        }
        else{
            performanceHTML += `<span><i class="lni lni-star-empty"></i></span>`;
        }
    }
    performanceHTML += `<p>${game.year-1} - ${team.history.lastResults[game.year-1].pts} pts = ${team.history.lastResults[game.year-1].position}º</p>`
    performanceHTML += `<p>${game.year-2} - ${team.history.lastResults[game.year-2].pts} pts = ${team.history.lastResults[game.year-2].position}º</p>`
    performanceHTML += `<p>${game.year-3} - ${team.history.lastResults[game.year-3].pts} pts = ${team.history.lastResults[game.year-3].position}º</p>`
    performanceHTML += "</div>"

    let fansHTML = "<div><h4>Fans<h4>"
    remainingStars = team.fansReputation;
    for(let i = 0; i < 5; i++) {
        if(remainingStars-- > 0){
            fansHTML += `<span><i class="lni lni-star-fill"></i></span>`;
        }
        else{
            fansHTML += `<span><i class="lni lni-star-empty"></i></span>`;
        }
    }
    fansHTML += `<p>${NumberF(team.fans * 1000000,"ext-short",0)}</p>`
    fansHTML += "</div>"

    let traditionHTML = "<div><h4>Tradição<h4>"
    remainingStars = team.tradition;
    for(let i = 0; i < 5; i++) {
        if(remainingStars-- > 0){
            traditionHTML += `<span><i class="lni lni-star-fill"></i></span>`;
        }
        else{
            traditionHTML += `<span><i class="lni lni-star-empty"></i></span>`;
        }
    }
    traditionHTML += `<p>${team.history.titles} Títulos</p>`
    traditionHTML += "</div>"

    html += `
    ${reputationHTML}
    <div id="view-reputation">
        ${performanceHTML}
        ${fansHTML}
        ${traditionHTML}
    </div>
    `;


    Swal.fire({
        title: `${teamName}`,
        html: html,
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    }).then(e => {
        ;
    });
}