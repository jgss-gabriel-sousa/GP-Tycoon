export function MenuTeam(){
    document.querySelector("#menu-container").innerHTML += `
    <div class="game-menu" id="menu-team">
        <div id="sidebar-infos">

            <div id="info">    
                <h1 id="year"></h1>
                <div id="team">
                    <div>
                        <img id="team-logo" class="logo" alt="Team Logo">
                        <h1 id="name"></h1>
                    </div>
                    <div id="reputation" class="no-select"></div>
                    <div id="money" class="view-financial-report no-select"></div>
                    <div id="supporters" class="no-select"><p></p></div>
                </div>
                <div id="next-race">
                    <h1>Próxima Corrida</h1>
                    <div id="next-race-name"></div>
                    <button id="btn-play"><span>Continuar</span></button>
                </div>
            </div>
        </div>

        <div id="team-details">
            <div id="drivers-section">
                <div id="drivers"></div>
                <div id="car" class="bars-table">
                    <div id="car-info"></div>
                    <div id="chassis"></div>
                    <div id="engine"></div>
                </div>
            </div>
        </div>

        
        <div id="menu-buttons">
            <button id="btn-save-game"><img src="./img/ui/save.png"> Salvar Jogo</button>
            <button id="btn-options"><img src="./img/ui/settings.png"> Opções</button>
        </div>
    </div>
    `
}