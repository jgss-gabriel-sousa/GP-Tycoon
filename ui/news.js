import { NumberF, accentsTidy, rand } from "../scripts/utils.js";
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
            let html = "";

            if(news[el.value].image)
                html += `<img src="${news[el.value].image}">`;

            if(news[el.value].div)
                html += news[el.value].div;

            html += `<p>${news[el.value].content}</p>`;

            element.innerHTML = html;
            news[el.value].viewed = true;

            document.querySelector(`#headlines > li:nth-child(${el.value+1})`).classList.remove("not-viewed-news");
        });
    });

    document.querySelector("#news-container > button").addEventListener("click", e => {
        game.news = [];
        newsUI();
    });
}


export function publishNews(type, args){
    const news = {
        "Decrease Reputation": {
            headline: `${args[0]} caiu de patamar`,
            image: "performance-issues",
            contents: [
                `Infelizmente, a reputação da ${args[0]} sofreu uma queda, agora avaliada como ${args[1]}, indicando desafios recentes enfrentados pela equipe.`,
                `Análises recentes apontam uma diminuição na reputação da ${args[0]} , refletindo desafios e obstáculos que afetaram a imagem da equipe, resultando em avaliações como ${args[1]}.`,
                `A ${args[0]} enfrenta um período desafiador, refletindo-se na redução de sua reputação, agora avaliada como ${args[1]}.`,
                `A reputação da ${args[0]} sofreu uma diminuição, com análises atuais apontando que a equipe enfrentou dificuldades, resultando em ser avaliada como ${args[1]}.`,
            ]
        },
        "Increase Reputation": {
            headline: `${args[0]} subiu de patamar`,
            image: "increase-reputation",
            contents: [
                `Analistas agora consideram a ${args[0]} em um patamar acima em sua Reputação, chegando a avaliações que a consideram como ${args[1]}`,
                `A Reputação da ${args[0]} atingiu um nível superior, com análises recentes colocando-a em destaque, avaliando-a como uma equipe ${args[1]}.`,
                `Os analistas concordam: a ${args[0]} agora é considerada uma equipe ${args[1]}.`,
                `Avaliações recentes destacam a ${args[0]} como uma equipe de prestígio, elevando sua reputação para ${args[1]}.`,
            ]
        },
        "New Driver Hire": {
            headline: `Nova Contratação na ${args[0]}`,
            contents: [
                `A ${args[0]} definiu ${args[1]} como ${args[2]} em um contrato de ${args[3]} ${args[3] == 1 ? "Ano" : "Anos"}.`,
            ],
            div: 
            `
            <div id="news-driver-hire">
                <div id="news-driver-hire-breaking">
                    <h1>BREAKING</h1>
                    <img src="./img/drivers/${game.drivers[args[1]].image}.webp">
                    <h1>${args[1].toUpperCase()}</h1>
                </div>
                <i class="lni lni-angle-double-right"></i>
                <div>
                    <img src="./img/teams/${args[0]}.png">
                </div>
            </div>`
        },
    }

    const newNews = {
        headline: news[type].headline,
        date: game.championship.actualRound-1,
        year: game.year,
        content: news[type].contents[rand(0, news[type].contents.length)],
    }

    if(news[type].image){
        newNews.image = `./img/ui/news/${news[type].image}.webp`;
    }
    if(news[type].div){
        newNews.div = news[type].div;
    }

    game.news.unshift(newNews);
}