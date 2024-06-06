import { NumberF, accentsTidy, rand } from "../scripts/utils.js";
import { game } from "../scripts/game.js";
import { genTeamMainMenu } from "./mainMenu.js";
import { viewDriver } from "./viewDriver.js";
import { viewEng } from "./viewEng.js"
import { getNewsSchema } from "./news/newsSchemas.js";

export function viewNews(){
    const news = game.news;

    let html = ` 
        <div id="news-container">
            <button><i class="lni lni-trash-can"></i></button>    
            <div id="headlines">`;
    
    let yearDivider;
    for(let i = 0; i < news.length; i++){
        
        let divider = "";
        if(news[i].year != game.year && news[i].year != yearDivider){
            /*
            html += `<p>${news[i].year}</p>`
            yearDivider = news[i].year;
            */
            
            divider = `style="margin-top: 2em;"`;
            yearDivider = news[i].year;
        }
        
        html += `<li ${divider} value="${i}" `;

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
        genTeamMainMenu();
    });


    document.querySelectorAll("#headlines > li").forEach(el => {
        el.addEventListener("click", e => {
            const element = document.querySelector("#news-content");
            let html = "";

            if(news[el.value].image)
                html += `<img src="${news[el.value].image}">`;

            if(news[el.value].div)
                html += news[el.value].div;

            if(news[el.value].content)
                html += `<p>${news[el.value].content}</p>`;

            element.innerHTML = html;
            news[el.value].viewed = true;

            //console.log(`#headlines > li:nth-child(${el.value})`)

            document.querySelector(`#headlines > li:nth-child(${el.value+1})`).classList.remove("not-viewed-news");
        });
    });

    document.querySelector("#news-container > button").addEventListener("click", e => {
        game.news = [];
        document.querySelector(".swal2-close").click();
    });
}


export function publishNews(type, args){
    try {
    const news = getNewsSchema(type, args);

    news.date = game.championship.actualRound-1;
    news.year = game.year;
    
    if(news.content){
        news.content = news.content[rand(0, news.content.length)];
    }

    if(news.image){
        news.image = `/img/views/news/${news.image}.webp`;
    }

    game.news.unshift(news);

    } catch (error) {
        console.error(error)
        console.log(args)
    }
}