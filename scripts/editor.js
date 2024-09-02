export function addDriver(){
    let html = "";

    html += `<div>`;
    html += `</div>`;
    
    
    Swal.fire({
        title: `Adicionar Piloto`,
        html: html,
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    }).then(e => {
        return;
    });
    
}

export function editDriver(){
}

export function removeDriver(){    
}

//#########################################################

export function addTeam(){
    let html = "";

    html += `<div>`;
    html += `</div>`;
    
    
    Swal.fire({
        title: `Adicionar Equipe`,
        html: html,
        showCloseButton: true,
        focusConfirm: false,
        showConfirmButton: false,
    })
    
}

export function editTeam(){
}

export function removeTeam(){    
}