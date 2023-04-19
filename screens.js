const screens = ["team-menu","main-menu","players-menu"];

export function changeScreen(newScreen){
    screens.forEach(e => {
       document.getElementById(e).style.display = "none"; 
    });

    document.getElementById(newScreen).style.display = "flex";
}