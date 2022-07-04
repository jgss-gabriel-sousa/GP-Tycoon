import { mainMenu } from "./screens/main-menu.js";
import { mainGame } from "./screens/main-game.js";


export function changeScreen(screen){
    let screenHTML;

    if(screen == "main-menu")   screenHTML = mainMenu;
    if(screen == "mainMenu")    screenHTML = mainMenu;

    if(screen == "main-game")   screenHTML = mainGame;
    if(screen == "mainGame")    screenHTML = mainGame;

    document.getElementById("interface").innerHTML = screenHTML;
}