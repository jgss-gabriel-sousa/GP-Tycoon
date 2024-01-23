import { game } from "../scripts/game.js"

export function getNewsSchema(type, args){
    if(type == "Decrease Reputation"){
        return {
            headline: `${args[0]} caiu de patamar`,
            image: "performance-issues",
            content: [
                `Infelizmente, a reputação da ${args[0]} sofreu uma queda, agora avaliada como uma equipe ${args[1]} (${args[2]}/5), indicando desafios recentes enfrentados pela equipe.`,
                `Análises recentes apontam uma diminuição na reputação da ${args[0]}, refletindo desafios e obstáculos que afetaram a imagem da equipe, resultando em avaliações como uma equipe ${args[1]} (${args[2]}/5).`,
                `A ${args[0]} enfrenta um período desafiador, refletindo-se na redução de sua reputação, agora avaliada como uma equipe ${args[1]} (${args[2]}/5).`,
                `A reputação da ${args[0]} sofreu uma diminuição, com análises atuais apontando que a equipe enfrentou dificuldades, resultando em ser avaliada como uma equipe ${args[1]} (${args[2]}/5).`,
            ]
        }
    }

    if(type == "Increase Reputation"){
        return {
            headline: `${args[0]} subiu de patamar`,
            image: "generic-cars-1",
            content: [
                `Analistas agora consideram a ${args[0]} em um patamar acima em sua Reputação, chegando a avaliações que a consideram como uma equipe ${args[1]} (${args[2]}/5).`,
                `A Reputação da ${args[0]} atingiu um nível superior, com análises recentes colocando-a em destaque, avaliando-a como uma equipe ${args[1]} (${args[2]}/5).`,
                `Os analistas concordam: a ${args[0]} agora é considerada como uma equipe ${args[1]} (${args[2]}/5).`,
                `Avaliações recentes destacam a ${args[0]} como uma equipe de prestígio, elevando sua reputação para uma equipe ${args[1]} (${args[2]}/5).`,
            ]
        }
    }

    if(type == "New Driver Hire"){
        return {
            headline: `Nova Contratação na ${args[0]}`,
            content: [
                `A ${args[0]} definiu ${args[1]} como ${args[2]} em um contrato de ${args[3]} ${args[3] == 1 ? "Ano" : "Anos"}.`,
                `A ${args[0]} estabeleceu ${args[1]} como ${args[2]} em um acordo de ${args[3]} ${args[3] == 1 ? "Ano" : "Anos"}.`,
                `Sob um acordo de ${args[3]} ${args[3] == 1 ? "Ano" : "Anos"}, a ${args[0]} determinou ${args[1]} como ${args[2]}.`,
                `Sob as condições de um contrato de ${args[3]} ${args[3] == 1 ? "Ano" : "Anos"}, a ${args[0]} contratou ${args[1]} como ${args[2]}.`,
            ],
            div: `
            <div id="news-driver-hire">
                <div id="news-driver-hire-breaking">
                    <h1 style="background-color: ${game.teams[args[0]].bg_color}; color: ${game.teams[args[0]].font_color}">BREAKING</h1>
                    <img src="img/drivers/${game.drivers[args[1]].image}.webp">
                    <h1 style="background-color: ${game.teams[args[0]].bg_color}; color: ${game.teams[args[0]].font_color}">${args[1].toUpperCase()}</h1>
                    <h2 style="background-color: ${game.teams[args[0]].bg_color}; color: ${game.teams[args[0]].font_color}">ASSINA COM A ${args[0].toUpperCase()}</h2>
                </div>
                <i class="lni lni-angle-double-right"></i>
                <div>
                    <img style="background-color: ${game.teams[args[0]].bg_color};" src="./img/teams/${args[0]}.png">
                </div>
            </div>`
        }
    }

    if(type == "F2 Results"){
        let divHTML;

        return {
            headline: `Resultados da Temporada de Fórmula 2`,
            content: [
                ``,
            ],
            div: divHTML,
        }
    }
}