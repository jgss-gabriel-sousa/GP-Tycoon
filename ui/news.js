import { NumberF, accentsTidy } from "../scripts/utils.js";
import { game } from "../scripts/game.js";
import { genTeamHTML } from "../scripts/main.js";
import { viewDriver } from "./viewDriver.js";
import { viewEng } from "./viewEng.js"

export function newsUI(){
    const news = game.news;

    let html = ` 
        <div id="news-container">
            <button><i class="lni lni-trash-can"></i></button>    
            <div id="headlines">`;
    
    for(let i = 0; i < news.length; i++){
        html += `<li value="${i}" `;

        if(!news[i].viewed){
            html += `class="not-viewed-news"`;
        }
        html += `>${news[i].headline}</li>`;
    }

    html += `
        </div>
        <div id="news-content"></div>
    </div>`

    Swal.fire({
        title: "Notícias",
        html: html,
        width: "90%",
        showCloseButton: true,
        allowOutsideClick: true,
        focusConfirm: false,
        showConfirmButton: false,
    }).then(e => {
        genTeamHTML();
    });

    document.querySelectorAll("#headlines li").forEach(el => {
        el.addEventListener("click", e => {
            const element = document.querySelector("#news-content");
            element.innerHTML = `<p>${news[el.value].content}</p>`;
            news[el.value].viewed = true;

            document.querySelector(`#headlines > li:nth-child(${el.value+1})`).classList.remove("not-viewed-news");
        });
    });

    document.querySelector("#news-container > button").addEventListener("click", e => {
        game.news = [];
        newsUI();
    });
}