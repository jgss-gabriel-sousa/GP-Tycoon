import { changeScreen } from "./ui.js"

window.onclick = e => {
    console.log(e.target.id);

    if(e.target.id == "start-game"){
        changeScreen("main-game");
    }
}