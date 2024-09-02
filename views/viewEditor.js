import { editTeam } from "../scripts/editor.js";
import { genID } from "../scripts/utils.js";

export let DB;
let folderFilepath;

export function viewEditor(){
    let html = "";

    html += `
    <div id="editor-header">
        <ul>
            <li><button type="button" id="new-db">Novo</button></li>
            <li><button type="button" id="load-db">Carregar</button></li>
            <li><button type="button" id="save-db" disabled>Salvar</button></li>
        </ul>
        <div id="editor-header-load-file">
            <input type="file" id="editor-file-input" name="file" accept=".json" />
        </div>
    </div>
    <div id="editor-main-content"></div>
    `

    document.querySelector("#editor-menu-interface").innerHTML = html;
    
    document.querySelector("#new-db").addEventListener("click", e => {

        if(confirm("Are you sure?") != true){
            return;
        }

        DB = {
            DB_NAME: "",
            championship: {
                teams: [],
                tracks: [],
                budgetCap: 135000,
                pointsSystem: [25,18,15,12,10,8,6,4,2,1],
                minDriversInTeams: 2,
                maxDriversInTeams: 2
            },
            teams: {},
            drivers: {}
        };

        renderDBData();
    });
    
    document.querySelector("#load-db").addEventListener("click", e => {
        const fileInputDiv = document.querySelector("#editor-header-load-file");

        const fileInput = document.querySelector("#editor-file-input");
        
        fileInput.click();
        fileInput.addEventListener("change", e => {
            const fileName = e.target.files[0].name;
            
            console.log("./db/"+fileName)

            folderFilepath

            fetch("./db/"+fileName)
            .then(res => res.json())
            .then(loadedDB => {
                DB = loadedDB
                renderDBData();
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


    document.querySelector("#save-db").addEventListener("click", async e => {
        const JSONToFile = (filename) => {
            const blob = new Blob([JSON.stringify(DB, null, 2)], {
              type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.json`;
            a.click();
            URL.revokeObjectURL(url);
        };

        const { value: filename } = await Swal.fire({
            title: "Filename",
            input: "text",
            inputAttributes: {
              maxlength: "100",
              autocapitalize: "off",
              autocorrect: "off"
            },
            showCancelButton: false,
            confirmButtonText: "Save",
            showLoaderOnConfirm: true
        })

        if(filename)
            JSONToFile(filename);
    });
}


function renderDBData(){
    let html = "";

    console.log(DB);
    document.querySelector("#save-db").disabled = false;

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
    <input type="text" id="filter-driver" placeholder="Filter" />
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
            renderDBData(editTeam(e.target.innerHTML, DB));
        });
    });

    document.querySelector("#filter-driver").addEventListener("input", e => {
        const filter = document.querySelector("#filter-driver").value.toLowerCase();

        const driversBtns = document.querySelectorAll("#drivers-buttons-container button");

        driversBtns.forEach(e => {
            if(e.innerHTML.toLowerCase().includes(filter)){
                e.style.display = "block";
            }
            else {
                e.style.display = "none";
            }
        });
    });
}


function driversValidation(DB){
    for(const teamName in DB.teams){
        const team = DB.teams[teamName];



        //if(team.driver1)
    }
}