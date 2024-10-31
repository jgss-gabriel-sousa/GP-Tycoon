import { editTeam } from "../scripts/editor.js";
import { genID } from "../scripts/utils.js";

export let DB;
let folderFilepath;

export function viewEditor() {
    const html = `
    <div id="editor-crud">
        <ul>
            <li><button type="button" id="new-db">Novo</button></li>
            <li><button type="button" id="load-db">Carregar</button></li>
            <li><button type="button" id="save-db" disabled>Salvar</button></li>
        </ul>
        <div id="editor-crud-load-file">
            <input type="file" id="editor-file-input" name="file" accept=".json" />
        </div>
    </div>
    <div id="editor-tab-selection">
        <ul>
            <li><button type="button" class="selected" id="view-rules">Rules</button></li>
            <li><button type="button" id="view-drivers">Drivers</button></li>
            <li><button type="button" id="view-teams">Teams</button></li>
            <li><button type="button" id="view-engineers">Engineers</button></li>
        </ul>
    </div>
    <div id="editor-main-content"></div>
    `;
    
    document.querySelector("#editor-menu-interface").innerHTML = html;

    setupEventListeners();
}

function setupEventListeners() {
    document.querySelector("#new-db").addEventListener("click", createNewDB);
    document.querySelector("#load-db").addEventListener("click", loadDB);
    document.querySelector("#save-db").addEventListener("click", saveDB);

    const tabButtons = document.querySelectorAll("#editor-tab-selection > ul > li > button");
    tabButtons.forEach((button) => button.addEventListener("click", handleTabSelection));
}

function createNewDB() {
    if (document.querySelector("#editor-main-content").innerHTML !== "" && !confirm("Are you sure?")) {
        return;
    }

    DB = {
        DB_NAME: "",
        championship: {
            teams: [],
            tracks: [],
            budgetCap: 135000,
            pointsSystem: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
            minDriversInTeams: 2,
            maxDriversInTeams: 2
        },
        teams: {},
        drivers: {}
    };

    renderDBData();
}

function loadDB() {
    const fileInput = document.querySelector("#editor-file-input");
    fileInput.click();
    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await fetch(`./db/${file.name}`);
            DB = await response.json();
            renderDBData();
            fileInput.value = ""; // Reset input after load
        } catch (error) {
            console.error("Error loading DB:", error);
        }
    });
}

async function saveDB() {
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
    });

    if (filename) {
        const blob = new Blob([JSON.stringify(DB, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

function renderDBData() {
    document.querySelector("#save-db").disabled = false;
    const activeTab = document.querySelector("#editor-tab-selection > ul > li > button.selected").id;
    document.querySelector("#editor-main-content").innerHTML = getTabContent(activeTab);
}

function getTabContent(tabId) {
    switch (tabId) {
        case "view-rules":
            return renderRulesTab();
        case "view-drivers":
            return renderDriversTab();
        case "view-teams":
            return renderTeamsTab();
        case "view-engineers":
            return renderEngineersTab();
        default:
            return "<p>Tab not found</p>";
    }
}

function renderRulesTab() {
    let html = `<h2><input value="${DB.DB_NAME}" placeholder="DB Name"></h2><br>`;
    for (const key in DB.championship) {
        if (key === "teams" || key === "tracks") continue;
        html += `<div><p>${key}: </p><input value="${DB.championship[key]}"></div>`;
    }
    return html;
}

function renderDriversTab() {
    let html = `
        <h4>Drivers:</h4>
        <button>Add Driver</button>
        <input type="text" id="filter-driver" placeholder="Filter" />
        <div id="drivers-buttons-container">
    `;
    for (const driverName in DB.drivers) {
        html += `<button>${driverName}</button>`;
    }
    html += `</div>`;
    return html;
}

function renderTeamsTab() {
    let html = `
        <table>
            <tr>
                <th>Name</th>
                <th>In Championship</th>
                <th colspan="${DB.championship.maxDriversInTeams}">Drivers</th>
                <th>Test Driver</th>
            </tr>
    `;
    for (const teamName in DB.teams) {
        const team = DB.teams[teamName];
        html += `
            <tr class="team-row">
                <td><button>${team.name}</button></td>
                <td><input type="checkbox" ${DB.championship.teams.includes(teamName) ? "checked" : ""}></td>
        `;
        for (let i = 0; i < DB.championship.maxDriversInTeams; i++) {
            const teamDriver = team[`driver${i + 1}`];
            html += `<td><select>${generateDriverOptions(teamDriver)}</select></td>`;
        }
        html += `<td><select>${generateDriverOptions(team.test_driver)}</select></td></tr>`;
    }
    html += `</table><button>Add Team</button>`;
    return html;
}

function renderEngineersTab() {
    return "";
}

function generateDriverOptions(selectedDriver) {
    let options = `<option value=""></option>`;
    for (const driverName in DB.drivers) {
        options += `<option value="${driverName}" ${driverName === selectedDriver ? "selected" : ""}>${driverName}</option>`;
    }
    return options;
}

function handleTabSelection(e) {
    document.querySelectorAll(`#editor-tab-selection > ul > li > button`).forEach((el) => el.classList.remove("selected"));
    e.target.classList.add("selected");
    renderDBData();
}
