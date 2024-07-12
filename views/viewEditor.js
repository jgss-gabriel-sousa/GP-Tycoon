import { genID } from "../scripts/utils.js";

export function viewEditor(){
    let html = "";

    html += `
    <div id="editor-header">
        <ul>
            <li><button type="button" id="new-db">Novo</button></li>
            <li><button type="button" id="load-db">Carregar</button></li>
        </ul>
        <div id="editor-header-load-file">
            <input type="file" id="editor-file-input" name="file" accept=".GPdb" />
        </div>
    </div>
    <div id="editor-main-content"></div>
    `

    document.querySelector("#editor-menu-interface").innerHTML = html;
    
    document.querySelector("#load-db").addEventListener("click", e => {
        const fileInputDiv = document.querySelector("#editor-header-load-file");

        const fileInput = document.querySelector("#editor-file-input");
        
        fileInput.click();
        fileInput.addEventListener("change", e => {
            const fileName = e.target.files[0].name;
    
            fetch("./db/"+fileName)
            .then(res => res.json())
            .then(DB => {
                renderDBData(DB);
                fileInputDiv.style.display = "none";
                fileInput.removeEventListener("change", {});
            })
            .catch(e => console.error(e));
    
        });

        /*
        if(fileInputDiv.style.display != "none"){
            fileInputDiv.style.display = "block";

            const fileInput = document.querySelector("#editor-file-input");
            fileInput.addEventListener("change", e => {
                const fileName = e.target.files[0].name;
        
                fetch("./db/"+fileName)
                .then(res => res.json())
                .then(DB => {
                    renderDBData(DB);
                    fileInputDiv.style.display = "none";
                    fileInput.removeEventListener("change", {});
                })
                .catch(e => console.error(e));
        
            });
        }*/
    });
}


function renderDBData(DB){
    let html = "";

    console.log(DB)

    let championshipRulesHTML = "";
    for(const key in DB.championship){
        if(key == "teams" || key == "tracks"){
            continue;            
        }
        else{
            championshipRulesHTML += `<div><p>${key}: </p><input value="${DB.championship[key]}"></div>`;
        }
    }    

    html += `
    <h2><input value="${DB.DB_NAME}"></h2>
    <h3>Championship</h3>
    <h4>Rules:</h4>
    ${championshipRulesHTML}
    <h4>Teams:</h4>
    <table>
        <tr>
            <th>Name</th>
            <th>in champ?</th>
            <th colspan="${DB.championship.maxDriversInTeams}">Drivers</th>
            <th>Test Driver</th>
        </tr>`;

    for(const teamName in DB.teams){
        const team = DB.teams[teamName];
        const drivers = DB.drivers;

        html += `
        <tr class="team-row">
            <td><button>${team.name}</button></td>
            <td><input type="checkbox" ${DB.championship.teams.includes(teamName) ? "checked" : ""}></td>`

        for (let i = 0; i < DB.championship.maxDriversInTeams; i++) {
            const teamDriver = team["driver"+(i+1)];
            
            html += `<td><select>`
            for(const driver in drivers){
                html += `<option value="${driver}" ${driver == teamDriver ? "selected" : ""}>${driver}</option>`
            }
            html += `<option value="" ${drivers[teamDriver] == undefined ? "selected" : ""}></option>`
            html += `</select></td>`
        }

        //############# TEST DRIVER #############
        html += `<td><select>`
        for(const driver in drivers){
            html += `<option value="${driver}" ${driver == team.test_driver ? "selected" : ""}>${driver}</option>`
        }
        html += `<option value="" ${drivers[team.test_driver] == undefined ? "selected" : ""}></option>`
        html += `</select></td>`
        //#######################################

        html += `
        </tr>`;
    }

    html += `
    </table>
    <button>Add Team</button>
    <hr>
    <h4>Drivers:</h4>
    <button>Add Driver</button>
    <div id="drivers-buttons-container">
    `;

    let driversWithError = driversValidation(DB);

    for (const driverName in DB.drivers) {
        const driver = DB.drivers[driverName];

        html += `<button>${driverName}</button>`;
    }


    html += `
    </div>
    `;

    document.querySelector("#editor-main-content").innerHTML = html;

    document.querySelectorAll(".team-row button").forEach(e => {
        e.addEventListener("click", e => {
            console.log(e.target.value);
        });
    });
}


function driversValidation(DB){
    for(const teamName in DB.teams){
        const team = DB.teams[teamName];



        //if(team.driver1)
    }
}