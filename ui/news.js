import { NumberF, accentsTidy } from "../utils.js";
import { game } from "../game.js";
import { genTeamHTML } from "../main.js";
import { viewDriver } from "./viewDriver.js";
import { viewEng } from "./viewEng.js"

export function newsUI(){
    const news = game.news;

    let html = `
    <div id="news-container">
        <div id="headlines">
    `
    
    for(let i = 0; i < news.length; i++){
        html += `<li value="${i}" `;

        if(!news[i].viewed){
            html += `class="not-viewed-news"`;
        }
        html += `>${news[i].headline}</li>`;
    }
/*
    news.sort((a, b) => a.year.localeCompare(b.year));
    news.sort((a, b) => a.date.localeCompare(b.date));*/

    html += `
        </div>
        <div id="news-content"></div>
    </div>`

    Swal.fire({
        title: "Racing News",
        html: html,
        width: "90%",
        showCloseButton: true,
        allowOutsideClick: true,
        focusConfirm: false,
        showConfirmButton: false,
    });

    document.querySelectorAll("#headlines li").forEach(el => {
        el.addEventListener("click", e => {
            const element = document.querySelector("#news-content");
            element.innerHTML = `<p>${news[el.value].content}</p>`;
            news[el.value].viewed = true;

            document.querySelector(`#headlines > li:nth-child(${el.value+1})`).classList.remove("not-viewed-news")
        });
    });
}