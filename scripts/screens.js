const screens = ["team-menu","main-menu"];

export function changeScreen(newScreen){
    screens.forEach(e => {
       document.getElementById(e).style.display = "none"; 
    });
    
    if(newScreen == "team-menu"){
        document.querySelector("body").style.background = "radial-gradient(circle at center, #1e1e1e , #0f0f0f)";
    }

    document.getElementById(newScreen).style.display = "flex";
}