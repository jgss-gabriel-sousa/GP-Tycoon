import { game } from "../game.js";
import { CalcTeamDevPoints, CalcTeamMorale } from "../teams.js";
import { roundToMultiple } from "../utils.js";
import { calcTeamsReputation } from "./calcTeamsReputation.js";

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

        //delete car.speed;
        
        car.corners = (((car.downforce + car.weight)/2)*engine.drivability)/100;
        car.straights = (((car.aerodynamic + car.weight)/2)*engine.power)/100;
        car.reliability = (car.chassisReliability * engine.reliability)/100;

        team.newCar = {
            aerodynamic: 0,
            downforce: 0,
            weight: 0,
            chassisReliability: 0,
        };
        
        team.aeroPts = 0;
        team.engPts = 0;
        team.brokeCostCap = false;
        team.brokeCostCapPenalty = 0;
        team.devFocusActualSeason = team.devFocusActualSeason ?? 50;
        team.devFocusNextSeason = team.devFocusNextSeason ?? 50;

        team.factories = Math.ceil(team.employees/250);

        team.bank = {};
        team.bank.loans = [];
        team.bank.loanInterestRate = 1.5;
        team.bank.credit = roundToMultiple(Math.round((team.cash * team.politicalForce)/1000),500)*1000;

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
        team.financialReport["Drivers Academy"] = 0;
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
        team.financialReport["Loan Payment"] = 0;

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