import { game } from "./game.js";
import { selectEngine } from "../ui/selectEngine.js";
import { rand, rollDice, roundToMultiple } from "./utils.js";
import { publishNews } from "../ui/news.js";

export function CalcTeamDevPoints(teamName){
    const eng = game.engineers;
    const team = game.teams[teamName];

    let aeroPts = (eng[team.teamPrincipal].adm + eng[team.teamPrincipal].aero)/2;
    aeroPts += (eng[team.engineers.technicalDirector].adm * eng[team.engineers.technicalDirector].aero)/100;
    aeroPts += eng[team.engineers.chiefDesigner].aero;
    aeroPts += eng[team.engineers.chiefAerodynamicist].aero * 2;
    aeroPts /= 5;
    aeroPts *= ((team.employees/1000)+1)/2;
    aeroPts *= team.teamMorale/100;


    let engPts = (eng[team.teamPrincipal].adm + eng[team.teamPrincipal].eng)/2;
    engPts += (eng[team.engineers.technicalDirector].adm * eng[team.engineers.technicalDirector].eng)/100;
    engPts += eng[team.engineers.chiefDesigner].eng;
    engPts += eng[team.engineers.chiefEngineering].eng * 2;
    engPts /= 5;
    engPts *= ((team.employees/1000)+1)/2;
    engPts *= team.teamMorale/100;

    if(team.brokeCostCap){
        aeroPts -= aeroPts * team.brokeCostCapPenalty;
        engPts -= engPts * team.brokeCostCapPenalty;
    }

    team.aeroPts = Math.round(aeroPts);
    team.engPts = Math.round(engPts);
}

function CalcTeamMorale(teamName){
    const eng = game.engineers;
    const team = game.teams[teamName];
    let morale = team.teamMorale;
    const baseMorale = parseFloat((((eng[team.teamPrincipal].adm*4) + (eng[team.engineers.technicalDirector].adm*2))/6).toFixed(2));
    let moraleGain = baseMorale / (Math.max(team.employees/5, 100));
    
    if(team.teamMorale == undefined){
        morale = baseMorale;
    }

    team.teamMorale = morale;
}


export function BeforeRaceUpdateTeamsStats(){
    for(const t in game.teams) {
        const team = game.teams[t];
        const car = team.car;
        const engine = game.engines[team.engine];

        car.corners = Math.round((((car.downforce + car.weight)/2)*engine.drivability)/100);
        car.straights = Math.round((((car.aerodynamic + car.weight)/2)*engine.power)/100);
        car.reliability = Math.round((car.chassisReliability * engine.reliability)/100);
        
        team.totalInvestments += team.investments.aerodynamics+team.investments.downforce+team.investments.weight+team.investments.reliability;
    
        contractDriver(team.name);
        contractEng(team.name);
    }
}


function contractDriver(teamName){
    const team = game.teams[teamName];
    let looking = [];

    if(team.new1driver == "") looking.push("1º Piloto");
    else if(team.new2driver == "") looking.push("2º Piloto");
    else if(team.newTdriver == "") looking.push("Piloto de Testes");

    if(looking.length == 0) return;
    if(team.name == game.team) return;
    
    const remainingRounds = game.championship.tracks.length - game.championship.actualRound;
    let financeFactor = ((team.financialReport["Balance"]*remainingRounds)+team.cash) / team.cash;
    if(!financeFactor) financeFactor = 1;
    if(financeFactor > 2) financeFactor = 2;
    if(financeFactor < -0.5) financeFactor = -0.5;


    let maxValue = Math.max(game.drivers[team.driver1].salary, game.drivers[team.driver2].salary, game.drivers[team.test_driver].salary);
    maxValue += maxValue*financeFactor;

    for (let loops = 0; loops < looking.length; loops++) {
        const lookingFor = looking[loops];
        const selectedDrivers = [];

        for(const d in game.drivers) {
            const driver = game.drivers[d];

            if(driver.salary > maxValue) continue;
            if(driver.newTeam != "" || driver.contractRemainingYears > 0) continue;

            const predictedQuality = ((driver.speed+rand(0,30)-15) + (driver.pace+rand(0,30)-15))/2;
            const costBenefit = (driver.salary/maxValue);
            let rating = predictedQuality * costBenefit;

            if(driver.team == teamName){
                rating *= 1.1;
            }
            if(lookingFor == "1º Piloto"){
                rating *= (driver.experience+10)/100;
            }
            if(lookingFor == "Piloto de Testes"){
                rating /= Math.max((driver.salary/maxValue),6);
            }

            selectedDrivers.push({
                name: driver.name,
                baseRating: rating
            });
        }
        selectedDrivers.sort((a,b) => b.baseRating - a.baseRating);

        /*
        let p = []; //Lista de "prováveis" pilotos
        while (p.length < 3) {
            const valor = Math.floor(Math.random() * 6);
            if (!p.includes(valor)) {
                p.push(valor);
            }
        }
        
        game.news.unshift({
            headline: team.name+" está analisando o mercado",
            date: game.championship.actualRound-1,
            year: game.year,
            content: `Fontes indicam que a equipe ${team.name} está analisando o mercado em busca de um novo ${lookingFor}, os nomes mais cotados são ${selectedDrivers[p[0]].name}, ${selectedDrivers[p[1]].name} e ${selectedDrivers[p[2]].name}.`,
        });
        */

        if(rand(25,100) > ((game.championship.actualRound/game.championship.tracks.length)*100))
            return;

        for(let i = 0; i < selectedDrivers.length; i++){
            if(!selectedDrivers[i] == undefined) continue;

            const driver = game.drivers[selectedDrivers[i].name];
            
            let contractYears = rollDice("1d4+0");


            if(lookingFor == "1º Piloto"){
                driver.newTeam = team.name;
                driver.newStatus = lookingFor;
                driver.newContractRemainingYears = contractYears;
                driver.newSalary = driver.salary;
                team.new1driver = driver.name;
                publishNews("New Driver Hire", [team.name, driver.name, lookingFor, contractYears]);
                
                delete selectedDrivers[i];
                break;
            }
            if(lookingFor == "2º Piloto"){
                driver.newTeam = team.name;
                driver.newStatus = lookingFor;
                driver.newContractRemainingYears = contractYears;
                driver.newSalary = driver.salary;
                team.new2driver = driver.name;
                publishNews("New Driver Hire", [team.name, driver.name, lookingFor, contractYears]);

                delete selectedDrivers[i];
                break;
            }
            if(lookingFor == "Piloto de Testes"){
                let chanceOfExpDriverReject;
                if(driver.age <= driver.careerPeak)
                    chanceOfExpDriverReject = Math.round((driver.experience/100)*100);
                else
                    chanceOfExpDriverReject = 10;

                if(rand(0,100) < chanceOfExpDriverReject)
                    continue;

                driver.newTeam = team.name;
                driver.newStatus = lookingFor;
                driver.newContractRemainingYears = contractYears;
                driver.newSalary = driver.salary;
                team.newTdriver = driver.name;
                publishNews("New Driver Hire", [team.name, driver.name, lookingFor, contractYears]);

                delete selectedDrivers[i];
                break;
            }
        }
    }
}


function contractEng(teamName){
    const team = game.teams[teamName];
    let looking = [];

    if(team.teamPrincipal == "")                        looking.push("Chefe de Equipe");
    else if(team.engineers.technicalDirector == "")     looking.push("Diretor Técnico");
    else if(team.engineers.chiefDesigner == "")         looking.push("Designer Chefe");
    else if(team.engineers.chiefAerodynamicist == "")   looking.push("Aerodinamicista Chefe");
    else if(team.engineers.chiefEngineering == "")      looking.push("Engenheiro Chefe");

    if(looking.length == 0) return;
    if(team.name == game.team) return;
    
    let financeFactor = ((team.financialReport["Balance"])+team.cash) / team.cash;
    if(!financeFactor) financeFactor = 1;
    if(financeFactor > 2) financeFactor = 2;
    if(financeFactor < -0.5) financeFactor = -0.5;

    let maxValue = Math.max(
        game.engineers[team.teamPrincipal].salary, 
        game.engineers[team.engineers.technicalDirector].salary, 
        game.engineers[team.engineers.chiefDesigner].salary,
        game.engineers[team.engineers.chiefAerodynamicist].salary,
        game.engineers[team.engineers.chiefEngineering].salary
    );
    maxValue += maxValue * financeFactor;

    for (let loops = 0; loops < looking.length; loops++) {
        const lookingFor = looking[loops];
        const selectedEngs = [];

        for(const d in game.engineers) {
            const eng = game.engineers[d];

            if(eng.salary > maxValue) continue;
            if(eng.team) continue;
            if(eng.name == "") continue;

            const predictedQuality = (eng.adm + eng.aero + eng.adm + rand(0,100))/4;
            const costBenefit = (eng.salary / maxValue);
            let rating = predictedQuality * costBenefit;

            if(lookingFor == "Chefe de Equipe" || lookingFor == "Diretor Técnico"){
                rating *= (eng.adm/100)+1;
            }
            if(lookingFor == "Designer Chefe"){
                rating *= (eng.eng/100)+1;
                rating *= (eng.aero/100)+1;
            }
            if(lookingFor == "Aerodinamicista Chefe"){
                rating *= (eng.aero/100)+1;
            }
            if(lookingFor == "Engenheiro Chefe"){
                rating *= (eng.eng/100)+1;
            }

            selectedEngs.push({
                name: eng.name,
                baseRating: rating
            });
        }
        selectedEngs.sort((a,b) => b.baseRating - a.baseRating);

        for(let i = 0; i < selectedEngs.length; i++){
            if(!selectedEngs[i]) continue;

            const eng = game.engineers[selectedEngs[i].name];
            
            eng.team = team.name;
            eng.occupation = lookingFor;
            if(lookingFor == "Chefe de Equipe"){
                team.teamPrincipal = eng.name;
            }
            if(lookingFor == "Diretor Técnico"){
                team.engineers.technicalDirector = eng.name;
            }
            if(lookingFor == "Designer Chefe"){
                team.engineers.chiefDesigner = eng.name;
            }
            if(lookingFor == "Aerodinamicista Chefe"){
                team.engineers.chiefAerodynamicist = eng.name;
            }
            if(lookingFor == "Engenheiro Chefe"){
                team.engineers.chiefEngineering = eng.name;
            }

            delete selectedEngs[i];
            break;
        }
    }
}

export function StartTeamsStats(){
    for(const t in game.teams) {
        const team = game.teams[t];
        const car = team.car;
        const engine = game.engines[team.engine];

        team.new1driver = "";
        team.new2driver = "";
        team.newTdriver = "";

        team.newEngine = "";

        car.weight = (car.downforce + car.speed)/2;
        car.aerodynamic = car.speed;
        car.chassisReliability = car.reliability;

        delete car.speed;
        
        car.corners = (((car.downforce + car.weight)/2)*engine.drivability)/100;
        car.straights = (((car.aerodynamic + car.weight)/2)*engine.power)/100;
        car.reliability = (car.chassisReliability * engine.reliability)/100;

        team.newCar = {};
        team.newCar.aerodynamic = 0;
        team.newCar.downforce = 0;
        team.newCar.weight = 0;
        team.newCar.chassisReliability = 0;
        
        team.aeroPts = 0;
        team.engPts = 0;
        team.brokeCostCap = false;
        team.brokeCostCapPenalty = 0;
        team.devFocusActualSeason = team.devFocusActualSeason ?? 50;
        team.devFocusNextSeason = team.devFocusNextSeason ?? 50;

        team.factories = Math.ceil(team.employees/250);

        team.investments = team.investments ?? {};
        team.investments.aerodynamics = team.investments.aerodynamics ?? 500;
        team.investments.weight = team.investments.weight ?? 500;
        team.investments.downforce = team.investments.downforce ?? 500;
        team.investments.reliability = team.investments.reliability ?? 500;
        team.totalInvestments = 0;

        team.financialReport = {};
        team.financialReport["Prize per Point"] = 0;
        team.financialReport["Prize per Place"] = 0;
        team.financialReport["Drivers"] = 0;
        team.financialReport["Engineers"] = 0;
        team.financialReport["Employees"] = 0;
        team.financialReport["Development Investments"] = 0;
        team.financialReport["Major Sponsor"] = 0;
        team.financialReport["Sponsors"] = 0;
        team.financialReport["Factory Sponsor"] = 0;
        team.financialReport["Balance"] = 0;
        team.financialReport["Engine"] = 0;
        team.financialReport["Fines"] = 0;
        team.financialReport["Constructions"] = 0;
        team.financialReport["Fees"] = 0;

        team.balanceHistoric = {
            raw: {value:[],legend:[]},
            accumulated: {value:[],legend:[]},
            year: {value:[],legend:[]},
        };
        
        CalcTeamMorale(team.name);
        CalcTeamDevPoints(team.name);
    }

    calcTeamsReputation();
}

export function UpdateTeamAfterRace(){
    game.championship.createStandings();

    let sumOfTeamsPows = 0;
    for (let i = 0; i < game.championship.teamStandings.length; i++) {
        sumOfTeamsPows += Math.pow((i+1),1.5);
    }

    game.contractsFailed = [];

    function calcBalance(team, eng, raceResult){
        let balance = 0;
        let teamPoints = 0;

        function setBalance(name, type, value){
            if(type == "profit"){
                balance += value;
                team.financialReport[name] += value;
            }
            else if(type == "expense"){
                balance -= value;
                team.financialReport[name] -= value;
            }
        }

        for(let i = 0; i < game.championship.pointsSystem.length; i++){
            if(raceResult[i] == team.driver1 || raceResult[i] == team.driver2){
                teamPoints += game.championship.pointsSystem[i];
            }
        }

        let EngineersCost = 0;
        EngineersCost += eng[team.teamPrincipal].salary;
        EngineersCost += eng[team.engineers.technicalDirector].salary;
        EngineersCost += eng[team.engineers.chiefDesigner].salary;
        EngineersCost += eng[team.engineers.chiefAerodynamicist].salary;
        EngineersCost += eng[team.engineers.chiefEngineering].salary;

        let prizePerPlaceValue = 0;
        for (let i = 0; i < game.championship.teamStandings.length; i++) {
            const teamName = game.championship.teamStandings[i][0];

            if(teamName == team.name){
                prizePerPlaceValue = ((3000000/(Math.pow(i+1,1.1)))/Math.pow(sumOfTeamsPows,1.08));
                break;
            }
        }
        
        const driversCost = (1000*game.drivers[team.driver1].salary) + (game.drivers[team.driver2].salary*1000) + (game.drivers[team.test_driver].salary*1000);

        setBalance("Prize per Point",   "profit",   teamPoints * 200);
        setBalance("Prize per Place",   "profit",   prizePerPlaceValue);
        setBalance("Major Sponsor",     "profit",   team.majorSponsor_value);
        setBalance("Sponsors",          "profit",   team.sponsor_value * team.sponsors.length);
        setBalance("Factory Sponsor",   "profit",   team.factorySponsor_value);

        setBalance("Drivers",           "expense",  driversCost);
        setBalance("Engineers",         "expense",  EngineersCost);
        setBalance("Employees",         "expense",  team.employees * 2.5);
        setBalance("Development Investments", "expense", team.investments.aerodynamics+team.investments.downforce+team.investments.weight+team.investments.reliability);
        setBalance("Constructions",     "expense",  0);
        setBalance("Fees",              "expense",  0);

        team.cash += balance;
        team.financialReport["Balance"] += balance;
        return balance;
    }

    function calcTeamUpgrades(team){
        function calcUpgradeNew(aeroOrEng, investment){
            const rand = (2+(Math.random() + 1))/3;
            let up = (aeroOrEng/100)*(90*(investment/(investment+30))-80)*(team.devFocusNextSeason/100)*(23/game.championship.tracks.length);
            
            if(Math.random()*100 < 10){
                up *= ((game.drivers[team.test_driver].speed * game.drivers[team.test_driver].pace)/10000);
            }
            if(Math.random()*100 < 5){
                up *= -1;
            }
            if(Math.random()*100 < 5){
                up *= 0;
            }
            return up*rand;
        }
        function calcUpgradeActual(aeroOrEng, investment){
            let up = aeroOrEng*((investment/(investment+1))*investment*0.000005)*(team.devFocusActualSeason/100)*(23/game.championship.tracks.length);
            
            if(Math.random()*100 < 10){
                up *= ((game.drivers[team.test_driver].speed * game.drivers[team.test_driver].pace)/10000);
            }
            return up;
        }

        team.newCar.aerodynamic += calcUpgradeNew(team.aeroPts, team.investments.aerodynamics);
        team.newCar.downforce += calcUpgradeNew(team.aeroPts, team.investments.downforce);
        team.newCar.weight += calcUpgradeNew(team.engPts, team.investments.weight);
        team.newCar.chassisReliability += calcUpgradeNew(team.engPts, team.investments.reliability);

        team.car.aerodynamic += calcUpgradeActual(team.aeroPts, team.investments.aerodynamics);
        team.car.downforce += calcUpgradeActual(team.aeroPts, team.investments.downforce);
        team.car.weight += calcUpgradeActual(team.engPts, team.investments.weight);
        team.car.chassisReliability += calcUpgradeActual(team.engPts, team.investments.reliability);

        const properties = ['aerodynamic', 'downforce', 'weight', 'chassisReliability'];
        function limitPropertiesToRange(obj){
            for(const prop of properties){
                obj[prop] = Math.max(0, Math.min(100, obj[prop]));
            }
        }
        limitPropertiesToRange(team.newCar);
        limitPropertiesToRange(team.car);
    }

    for(const t in game.teams) {
        const team = game.teams[t];
        const eng = game.engineers;

        const actualRace = game.championship.tracks[game.championship.actualRound-2];
        const raceResult = game.championship.results[actualRace];

        const balance = calcBalance(team, eng, raceResult);
        CalcTeamMorale(team.name);
        CalcTeamDevPoints(team.name);
        calcTeamUpgrades(team);

        if(team.balanceHistoric.raw.value.length >= 20){
            team.balanceHistoric.raw.value.shift();
            team.balanceHistoric.raw.legend.shift();

            team.balanceHistoric.accumulated.value.shift();
            team.balanceHistoric.accumulated.legend.shift();
        }

        team.balanceHistoric.raw.value.push(balance);
        team.balanceHistoric.raw.legend.push(`${game.championship.actualRound-1}/${game.championship.tracks.length}`);

        team.balanceHistoric.accumulated.value.push(team.financialReport["Balance"]);
        team.balanceHistoric.accumulated.legend.push(`${game.championship.actualRound-1}/${game.championship.tracks.length}`);
    }
}


export function YearUpdateTeamsStats(){
    game.championship.drivers = [];

    for(const t in game.teams) {
        const team = game.teams[t];
        const car = team.car;
        let engine = game.engines[team.engine];

        team.driver1 = team.new1driver;
        team.driver2 = team.new2driver;
        team.test_driver = team.newTdriver;

        if(!team.driver1 || !team.driver2 || !team.test_driver){
            for(const d in game.drivers) {
                const driver = game.drivers[d];

                if(!driver.team && driver.newTeam != "Aposentadoria"){
                    if(team.driver1 == ""){
                        driver.team = team.name;
                        driver.status = "1º Piloto";
                        driver.contractRemainingYears = rollDice("1d4+0");
                        team.new1driver = driver.name;
                        team.driver1 = driver.name;
                        continue;
                    }
                    if(!team.driver2){
                        driver.team = team.name;
                        driver.status = "2º Piloto";
                        driver.contractRemainingYears = rollDice("1d4+0");
                        team.new2driver = driver.name;
                        team.driver2 = driver.name;
                        continue;
                    }
                    if(!team.test_driver){
                        driver.team = team.name;
                        driver.status = "Piloto de Testes";
                        driver.contractRemainingYears = rollDice("1d4+0");
                        team.newTdriver = driver.name;
                        team.test_driver = driver.name;
                        continue;
                    }
                }
            }
        }
        
        if(game.drivers[team.driver1].contractRemainingYears == 0)  team.new1driver = "";
        if(game.drivers[team.driver2].contractRemainingYears == 0)  team.new2driver = "";
        if(game.drivers[team.test_driver].contractRemainingYears == 0)  team.newTdriver = "";

        car.aerodynamic = team.newCar.aerodynamic;
        car.downforce = team.newCar.downforce;
        car.weight = team.newCar.weight;
        car.chassisReliability = team.newCar.chassisReliability;

        team.newCar.aerodynamic = 0;
        team.newCar.downforce = 0;
        team.newCar.weight = 0;
        team.newCar.chassisReliability = 0;

        team.engineContract--;

        if(team.engineContract < 0 && team.newEngine != ""){
            team.engine = team.newEngine;
            team.engineContract = team.newEngineContract;
            team.newEngine = "";
            team.newEngineContract = "";
        }
        else if(team.engineContract == -1 && team.newEngine == ""){
            if(team.name == game.team){
                selectEngine(true);
                team.newEngine = "";
                team.newEngineContract = "";
            }
            else{
                const possibles = [];

                for(const e in game.engines){
                    if(!game.engines[e].blackList.includes(team.name)){
                        possibles.push(e);
                    }
                }

                team.newEngine = possibles[rand(0, possibles.length)];
                team.newEngineContract = rand(1, 6);
            }
        }
            
        if((game.championship.budgetCap - team.totalInvestments) >= 0){
            team.brokeCostCap = false;
            team.brokeCostCapPenalty = 0;
        }
        else{
            team.brokeCostCap = true;
            team.brokeCostCapPenalty = (team.totalInvestments / game.championship.budgetCap) - 1;
            team.brokeCostCapPenalty = team.brokeCostCapPenalty > 0.95 ? 0.95 : team.brokeCostCapPenalty;
            
            game.news.unshift({
                headline: team.name+" estourou o Teto de Gastos",
                date: game.championship.actualRound-1,
                year: game.year,
                content: `${team.name} será penalizada em ${Math.round(team.brokeCostCapPenalty*100)}% de seus Pontos de Desenvolvimento`,
            });

            if(team.name == game.team){
                Swal.fire(`<p>Sua equipe estourou o Teto de Gastos, seus Pontos de Desenvolvimento serão penalizados em ${Math.round(team.brokeCostCapPenalty*100)}%</p>`);
            }
        }

        engine = game.engines[team.engine];
        car.corners = Math.round((((car.downforce + car.weight)/2)*engine.drivability)/100);
        car.straights = Math.round((((car.aerodynamic + car.weight)/2)*engine.power)/100);
        car.reliability = Math.round((car.chassisReliability * engine.reliability)/100);

        if(team.balanceHistoric.year.value.length >= 5){
            team.balanceHistoric.year.value.shift();
            team.balanceHistoric.year.legend.shift();
        }
        team.balanceHistoric.year.value.push(team.financialReport["Balance"]);
        team.balanceHistoric.year.legend.push(`${game.year-1}`);

        team.totalInvestments = 0;

        team.financialReport = {};
        team.financialReport["Prize per Point"] = 0;
        team.financialReport["Prize per Place"] = 0;
        team.financialReport["Drivers"] = 0;
        team.financialReport["Engineers"] = 0;
        team.financialReport["Employees"] = 0;
        team.financialReport["Development Investments"] = 0;
        team.financialReport["Major Sponsor"] = 0;
        team.financialReport["Sponsors"] = 0;
        team.financialReport["Factory Sponsor"] = 0;
        team.financialReport["Balance"] = 0;
        team.financialReport["Engine"] = 0;
        team.financialReport["Fines"] = 0;
        team.financialReport["Constructions"] = 0;
        team.financialReport["Fees"] = 0;

        team.balanceHistoric.raw = {value:[],legend:[]};
        team.balanceHistoric.accumulated = {value:[],legend:[]};
        
        CalcTeamDevPoints(team.name);

        game.championship.drivers.push(team.driver1);
        game.championship.drivers.push(team.driver2);

        let endResult; 
        let endPos; 
        for(let i = 0; i < game.championship.teamStandings.length; i++) {
            const t = game.championship.teamStandings[i];

            if(t[0] == team.name){
                endResult = t;
                endPos = i+1;
            }
        }
        if(endResult){
            team.history.lastResults[game.year] = {
                position: endPos,
                pts: endResult[1],
                wins: endResult[2],
                podiums: endResult[3],
                bestFinish: endResult[4],
            };
        }
    }

    calcTeamsReputation();
}

function calcTeamsReputation(){
    let teamsPerformance = {};

    for(const t in game.teams){
        const team = game.teams[t];

        for(const year in team.history.lastResults){
            if(parseInt(year) < game.year-3) continue;

            if(!teamsPerformance[year])
                teamsPerformance[year] = {maxPts:0};

            let pts = team.history.lastResults[year].pts;

            teamsPerformance[year][team.name] = pts;

            if(pts > teamsPerformance[year].maxPts)
                teamsPerformance[year].maxPts = pts;
        }
    }

    for(const y in teamsPerformance){
        for(const t in teamsPerformance[y]){
            if(t == "maxPts")
                continue;

            teamsPerformance[y][t] = teamsPerformance[y][t] / teamsPerformance[y].maxPts;
        }

        delete teamsPerformance[y].maxPts;
    }

    const performance = {};
    for(const y in teamsPerformance){
        for(const t in teamsPerformance[y]){
            let modif = 4;

            if(y == game.year-1) modif = 4;
            if(y == game.year-2) modif = 2;
            if(y == game.year-3) modif = 1;

            if(!performance[t])
                performance[t] = 0;

            performance[t] += teamsPerformance[y][t] * modif;
        }
    }
    for(const t in performance){
        performance[t] /= 7;
    }
    let maxPerformance;
    for(const t in performance){
        if(performance[t] > maxPerformance || !maxPerformance)
            maxPerformance = performance[t];
    }
    for(const t in game.teams){
        performance[t] = performance[t] / maxPerformance;
        performance[t] = roundToMultiple((performance[t]*5), 0.5);
    }

    const fans = {};
    let maxFans;
    for(const t in game.teams){
        const team = game.teams[t];

        if(team.fans > maxFans || !maxFans)
            maxFans = team.fans;
    }
    for(const t in game.teams){
        fans[t] = game.teams[t].fans / maxFans;
        fans[t] = roundToMultiple((fans[t]*5), 0.5);
    }

    const political = {};
    let maxPolitical;
    for(const t in game.teams){
        const team = game.teams[t];

        if(team.politicalForce > maxPolitical || !maxPolitical)
            maxPolitical = team.politicalForce;
    }
    for(const t in game.teams){
        political[t] = game.teams[t].politicalForce / maxPolitical;
        political[t] = roundToMultiple((political[t]*5), 0.5);
    }

    const dev = {};
    let maxDev;
    for(const t in game.teams){
        const team = game.teams[t];

        let devCap = (team.aeroPts + team.engPts)/2;

        if(devCap > maxDev || !maxDev)
            maxDev = devCap;
    }
    for(const t in game.teams){
        const team = game.teams[t];
        let devCap = (team.aeroPts + team.engPts)/2;
        dev[t] = devCap / maxDev;
        dev[t] = roundToMultiple((dev[t]*5), 0.5);
    }

    const tradition = {};
    let maxTitles;
    for(const t in game.teams){
        const team = game.teams[t];

        if(team.history.titles > maxTitles || !maxTitles)
            maxTitles = team.history.titles;
    }
    for(const t in game.teams){
        tradition[t] = game.teams[t].history.titles / maxTitles;
        tradition[t] = roundToMultiple((tradition[t]*5), 0.5);
    }

    let championshipReputation = 0;
    for(const t in game.teams){
        const team = game.teams[t];

        const oldReputation = team.reputation;
        team.reputation = roundToMultiple(((performance[team.name]*4) + (dev[team.name]*2) + (political[team.name]*2) + fans[team.name] + tradition[team.name]) / 10, 0.5);
        team.performance = performance[team.name];
        team.fansReputation = fans[team.name];
        team.tradition = tradition[team.name];
        team.developmentReputation = dev[team.name];
        team.politicalReputation = political[team.name];

        if(game.championship.teams.includes(team.name))
            championshipReputation += team.reputation;

        if(team.reputation > oldReputation+1) team.reputation = oldReputation+1;
        if(team.reputation < oldReputation-1) team.reputation = oldReputation-1;
        
        let repName;
        if(team.reputation == 5)    repName = "Dominante";
        if(team.reputation == 4.5)  repName = "Poderosa";
        if(team.reputation == 4)    repName = "Respeitável";
        if(team.reputation == 3.5)  repName = "Competitiva";
        if(team.reputation == 3)    repName = "Emergente";
        if(team.reputation == 2.5)  repName = "Razóavel";
        if(team.reputation == 2)    repName = "Mediana";
        if(team.reputation == 1.5)  repName = "Limitada";
        if(team.reputation == 1)    repName = "Enfraquecida";
        if(team.reputation == 0.5)  repName = "Fundo de Grid";
        if(team.reputation == 0)    repName = "Nanica";

        team.reputationTitle = repName;

        if(oldReputation < team.reputation)     publishNews("Increase Reputation", [team.name, team.reputationTitle, team.reputation]);
        if(oldReputation > team.reputation)     publishNews("Decrease Reputation", [team.name, team.reputationTitle, team.reputation]);
    }
    championshipReputation = Math.round(championshipReputation/game.championship.teams.length);
}