import { circuitsData } from "../../data/circuits.js";
import { Championship } from "../championship.js";
import { game } from "../game.js";
import { genTeamMainMenu } from "../../ui/mainMenu.js";
import { BeforeRaceUpdateTeamsStats, UpdateTeamAfterRace } from "../teams.js";

export const RunRaceSimulation = () => {
    if(Championship.actualRound > Championship.tracks.length){
        seasonOverviewUI("end");
        simulateOthersSeries();
        return;
    }

    BeforeRaceUpdateTeamsStats();

    const raceName = Championship.tracks[Championship.actualRound-1];
    
    let TimeTableHTML = Championship.genGridTableHTML();

    let timerInterval;
    const qualifyUI = {
        title: `Classificação GP ${raceName}`,
        html: `
            <div id="time-table">${TimeTableHTML}</div>
        `,
        width: "50em",
        focusConfirm: true,
        allowOutsideClick: false,
        confirmButtonText: "Ok",
        didOpen: () => {
            Swal.disableButtons();
            const timeTable = Swal.getHtmlContainer().querySelector("#time-table")
            const qsection = Swal.getHtmlContainer().querySelector("#actual-qsection")
            let i = 0;

            timerInterval = setInterval(() => {
                i++;
                TimeTableHTML = Championship.genGridTableHTML();
                timeTable.innerHTML = TimeTableHTML;

                if(i == 10 && Championship.race.qSection == "Q1"){
                    Championship.race.qSection = "Q2";
                    i = 0;
                }

                if(i == 10 && Championship.race.qSection == "Q2"){
                    Championship.race.qSection = "Q3";
                    i = 0;
                }

                if(i == 10 && Championship.race.qSection == "Q3"){
                    clearInterval(timerInterval);
                    TimeTableHTML = Championship.genGridTableHTML("end");
                    timeTable.innerHTML = TimeTableHTML;
                    Swal.enableButtons();
                }
            }, game.settings["race-simulation-speed"]);
        },
    }

    const raceUI = {
        title: "GP "+raceName,
        html: `
        <div id="race">
            <div id="buttons-raceSim">
                <button id="change-tire">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16.5 22c2.485 0 4.5-4.477 4.5-10S18.985 2 16.5 2M12 12c0 5.523-2.015 10-4.5 10S3 17.523 3 12S5.015 2 7.5 2S12 6.477 12 12ZM7.5 2h9m-9 20h9"/><path stroke-linecap="round" d="M9 12c0 3.314-.672 6-1.5 6S6 15.314 6 12s.672-6 1.5-6S9 8.686 9 12Zm0 0H8" opacity="0.5"/></g></svg>
                </button>

                <button id="driving-style">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M11.994 21q-1.852 0-3.491-.707q-1.64-.708-2.864-1.932t-1.932-2.864Q3 13.857 3 12.007q0-1.875.71-3.512q.711-1.637 1.93-2.856q1.218-1.218 2.862-1.928Q10.147 3 11.994 3q1.87 0 3.509.71q1.64.711 2.858 1.93q1.218 1.218 1.928 2.855q.711 1.637.711 3.511q0 1.852-.71 3.494q-.711 1.642-1.93 2.86q-1.218 1.219-2.855 1.93q-1.637.71-3.511.71M12 16.5q1.385 0 2.723.39q1.339.389 2.492 1.156q1.343-1.13 2.064-2.71Q20 13.755 20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 1.76.718 3.34q.719 1.581 2.067 2.706q1.153-.767 2.492-1.157Q10.615 16.5 12 16.5m.003 1q-1.143 0-2.234.308q-1.09.307-2.08.884q.951.635 2.053.971q1.101.337 2.26.337q1.158 0 2.258-.337q1.1-.336 2.052-.97q-.99-.578-2.078-.885q-1.088-.308-2.231-.308M7 10.808q.329 0 .568-.24q.24-.24.24-.568q0-.329-.24-.568q-.24-.24-.568-.24q-.329 0-.568.24q-.24.24-.24.568q0 .329.24.568q.24.24.568.24m3-3q.329 0 .568-.24q.24-.24.24-.568q0-.329-.24-.568q-.24-.24-.568-.24q-.329 0-.568.24q-.24.24-.24.568q0 .329.24.568q.24.24.568.24m7 3q.329 0 .568-.24q.24-.24.24-.568q0-.329-.24-.568q-.24-.24-.568-.24q-.329 0-.568.24q-.24.24-.24.568q0 .329.24.568q.24.24.568.24M12 13.5q.633 0 1.066-.434q.434-.433.434-1.066q0-.325-.129-.609t-.348-.514l1.58-3.977q.08-.188-.006-.384t-.277-.274q-.18-.079-.374.002q-.194.08-.27.28L12.059 10.5q-.635-.029-1.096.409q-.462.437-.462 1.091q0 .633.434 1.066q.433.434 1.066.434m0 4"/></svg>
                </button>

                <button id="play-anthem">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M22 6c-1 5-7 5-7 5H4c-1 0-2-1-2-1H1v4h1s1-1 2-1h.3c-.2.3-.3.6-.3 1v2c0 1.1.9 2 2 2h1v1h2v-1h1v1h2v-1h1v1h2v-1h1c1.1 0 2-.9 2-2v-2c0-.1 0-.3-.1-.4c1.7.6 3.5 1.8 4.1 4.4h1V6zM6 16.5c-.3 0-.5-.2-.5-.5v-2c0-.3.2-.5.5-.5h1v3zm3 0v-3h1v3zm3 0v-3h1v3zm4.5-.5c0 .3-.2.5-.5.5h-1v-3h1c.3 0 .5.2.5.5zM9 10H7V9h2zm3 0h-2V9h2zm3 0h-2V9h2z"/></svg>
                </button>
            </div>

            <div id="race-cars"></div>
            <div id="time-table"></div>
            <div id="podium" style="display: none;"></div>
        </div>
        `,
        width: "100%",
        focusConfirm: true,
        allowOutsideClick: false,
        confirmButtonText: "Ok",
        didOpen: () => {
            Swal.disableButtons();

            const timeTable = Swal.getHtmlContainer().querySelector("#time-table");
            const cars = Swal.getHtmlContainer().querySelector("#race-cars");
            const podium = Swal.getHtmlContainer().querySelector("#podium");
        
            cars.innerHTML = Championship.VisualRaceSim("start");

            let tickRate = game.settings["race-simulation-speed"];
            
            if(!game.settings["visual-race-simulation"])
                tickRate /= 4;

            timerInterval = setInterval(e => {
                timeTable.innerHTML = Championship.genRaceTableHTML();
                Championship.VisualRaceSim();

                if(Championship.race.lap == circuitsData[raceName].laps){
                    clearInterval(timerInterval);
                    Swal.enableButtons();
                }
            }, tickRate);
        },
    }

    Swal.fire(qualifyUI).
    then(e => Swal.fire(raceUI)).
    then(e => 
    Swal.fire({
        title: `Resultado GP ${raceName}`,
        html: `
        <div id="race">
            <div id="time-table"></div>
            <div id="podium"></div>
        </div>
        `,
        width: "100%",
        focusConfirm: true,
        allowOutsideClick: false,
        confirmButtonText: "Ok",
        didOpen: () => {
            const timeTable = Swal.getHtmlContainer().querySelector("#time-table");
            const podium = Swal.getHtmlContainer().querySelector("#podium");

            timeTable.innerHTML = Championship.genRaceTableHTML("end");
            podium.innerHTML = Championship.genRaceTableHTML("podium");
        },
    })).
    then(e => {
        //##############################################################
        // UPDATE STATS

        const grid = Championship.race.grid;
        grid.forEach(e => {
            game.drivers[e.name].gps++;
        });

        const finalResult = Championship.race.finalResult;

        game.drivers[grid[0].name].poles++;
        game.drivers[finalResult[0].name].wins++;
        game.drivers[finalResult[0].name].podiums++;
        game.drivers[finalResult[1].name].podiums++;
        game.drivers[finalResult[2].name].podiums++;

        //##############################################################

        Championship.results[raceName] = Championship.race.positions;
        Championship.actualRound++;

        UpdateTeamAfterRace();
        genTeamMainMenu();

        Championship.race = {
            grid: {},
            qSection: "Q1",
            qDrivers: [],

            raceDrivers: [],
            finalResult: [],
            positions: [],
            condition: "",
            safetyCarLaps: 0,

            retires: [],
            rain: 0,
            lap: 0,
            simTick: 0,
            log: [],
        }
    });
}