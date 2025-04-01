const screens = ["game-interface","main-menu","editor-menu"];

export function changeScreen(newScreen){
    screens.forEach(e => {
       document.getElementById(e).style.display = "none"; 
    });
    
    if(newScreen == "game-interface"){
        document.querySelector("body").style.background = "radial-gradient(circle at center, #1e1e1e , #0f0f0f)";
    }
    if(newScreen == "editor-menu"){
        document.querySelector("body").style.background = "radial-gradient(circle at center, #1e1e1e , #0f0f0f)";
        document.querySelector("body").style.backgroundImage = "url()";
    }

    document.getElementById(newScreen).style.display = "flex";
}