/*

"Max Verstappen": {
    name: "Max Verstappen",
    age: 25,
    country: "NL",
    
    performance: 0, // =  (Pontos / Pontos Possíveis) x (1 + Voltas Mais Rápidas / Total de Voltas) x (1 + Posições Ganhas / Posições Possíveis) x (1 + (Pole Positions + Vitórias) / (Total de Corridas - Pole Positions))
    expectation: 0,

    speed: 0,
    pace: 0,
    setup: 0,
    morale: 0,

    motivation: 0,
    experience: 0, // Anos da carreira na F1 (Max de 15)

    ability: 0,
},

*/

export const driversData = {
    "Lewis Hamilton": {
        name: "Lewis Hamilton",
        team: "Mercedes",
        status: "1º Piloto",
        age: 37,
        country: "GB",
        speed: 95,
        pace: 95,
        experience: 15,
        titles: 7,
        gps: 310,
        wins: 103,
        podiums: 191,
        poles: 103,
        contractRemainingYears: 0,
    },
    "George Russell": {
        name: "George Russell",
        team: "Mercedes",
        status: "2º Piloto",
        age: 24,
        country: "GB",
        speed: 96,
        pace: 95,
        experience: 3,
        titles: 0,
        gps: 82,
        wins: 1,
        podiums: 9,
        poles: 1,
        contractRemainingYears: 1,
    },
    "Mick Schumacher": {
        name: "Mick Schumacher",
        team: "Mercedes",
        status: "Piloto de Testes",
        age: 22,
        country: "DE",
        speed: 82,
        pace: 79,
        experience: 1,
        titles: 0,
        gps: 40,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 0,
    },
    "Max Verstappen": {
        name: "Max Verstappen",
        team: "Red Bull",
        status: "1º Piloto",
        age: 25,
        country: "NL",
        speed: 98,
        pace: 97,
        experience: 6*2,
        titles: 2,
        gps: 163,
        wins: 35,
        podiums: 77,
        poles: 20,
        contractRemainingYears: 5,
    },
    "Sergio Pérez": {
        name: "Sergio Pérez",
        team: "Red Bull",
        status: "2º Piloto",
        age: 32,
        country: "MX",
        speed: 91,
        pace: 94,
        experience: 11,
        titles: 0,
        gps: 235,
        wins: 4,
        podiums: 26,
        poles: 1,
        contractRemainingYears: 1,
    },
    "Daniel Ricciardo": {
        name: "Daniel Ricciardo",
        team: "Red Bull",
        status: "Piloto de Testes",
        age: 33,
        country: "AU",
        speed: 88,
        pace: 90,
        experience: 11,
        titles: 0,
        gps: 232,
        wins: 8,
        podiums: 32,
        poles: 3,
        contractRemainingYears: 0,
    },
    "Charles Leclerc": {
        name: "Charles Leclerc",
        team: "Ferrari",
        status: "1º Piloto",
        age: 24,
        country: "MC",
        speed: 97,
        pace: 94,
        experience: 4,
        titles: 0,
        gps: 102,
        wins: 5,
        podiums: 24,
        poles: 18,
        contractRemainingYears: 1,
    },
    "Carlos Sainz Jr.": {
        name: "Carlos Sainz Jr.",
        team: "Ferrari",
        status: "2º Piloto",
        age: 24,
        country: "ES",
        speed: 87,
        pace: 91,
        experience: 3,
        titles: 0,
        gps: 82,
        wins: 1,
        podiums: 9,
        poles: 1,
        contractRemainingYears: 1,
    },
    "Antonio Giovinazzi": {
        name: "Antonio Giovinazzi",
        team: "Ferrari",
        status: "Piloto de Testes",
        age: 29,
        country: "IT",
        speed: 84,
        pace: 84,
        experience: 3,
        titles: 0,
        gps: 62,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 0,
    },
    "Fernando Alonso": {
        name: "Fernando Alonso",
        team: "Aston Martin",
        status: "1º Piloto",
        age: 40,
        country: "ES",
        speed: 97,
        pace: 92,
        experience: 18,
        titles: 2,
        gps: 355,
        wins: 32,
        podiums: 99,
        poles: 22,
        contractRemainingYears: 1,
    },
    "Lance Stroll": {
        name: "Lance Stroll",
        team: "Aston Martin",
        status: "2º Piloto",
        age: 23,
        country: "CA",
        speed: 87,
        pace: 84,
        experience: 4,
        titles: 0,
        gps: 122,
        wins: 0,
        podiums: 3,
        poles: 1,
        contractRemainingYears: 6,
    },
    "Felipe Drugovich": {
        name: "Felipe Drugovich",
        team: "Aston Martin",
        status: "Piloto de Testes",
        age: 22,
        country: "BR",
        speed: 87,
        pace: 88,
        experience: 0,
        titles: 0,
        gps: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 0,
    },
    "Lando Norris": {
        name: "Lando Norris",
        team: "McLaren",
        status: "1º Piloto",
        age: 22,
        country: "GB",
        speed: 93,
        pace: 96,
        experience: 3,
        titles: 0,
        gps: 82,
        wins: 0,
        podiums: 6,
        poles: 1,
        contractRemainingYears: 2,
    },
    "Oscar Piastri": {
        name: "Oscar Piastri",
        team: "McLaren",
        status: "2º Piloto",
        age: 21,
        country: "AU",
        speed: 90,
        pace: 89,
        experience: 0,
        titles: 0,
        gps: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 1,
    },
    "Álex Palou": {
        name: "Álex Palou",
        team: "McLaren",
        status: "Piloto de Testes",
        age: 26,
        country: "ES",
        speed: 88,
        pace: 87,
        experience: 0,
        titles: 0,
        gps: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 0,
    },
    "Valtteri Bottas": {
        name: "Valtteri Bottas",
        team: "Alfa Romeo",
        status: "1º Piloto",
        age: 33,
        country: "FI",
        speed: 88,
        pace: 89,
        experience: 10,
        titles: 0,
        gps: 200,
        wins: 10,
        podiums: 67,
        poles: 20,
        contractRemainingYears: 1,
    },
    "Zhou Guanyu": {
        name: "Zhou Guanyu",
        team: "Alfa Romeo",
        status: "2º Piloto",
        age: 23,
        country: "CN",
        speed: 89,
        pace: 87,
        experience: 1,
        titles: 0,
        gps: 22,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 0,
    },
    "Théo Pourchaire": {
        name: "Théo Pourchaire",
        team: "Alfa Romeo",
        status: "Piloto de Testes",
        age: 19,
        country: "FR",
        speed: 85,
        pace: 86,
        experience: 0,
        titles: 0,
        gps: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 0,
    },
    "Yuki Tsunoda": {
        name: "Yuki Tsunoda",
        team: "AlphaTauri",
        status: "1º Piloto",
        age: 22,
        country: "JP",
        speed: 91,
        pace: 88,
        experience: 2,
        titles: 0,
        gps: 42,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 0,
    },
    "Nyck de Vries": {
        name: "Nyck de Vries",
        team: "AlphaTauri",
        status: "2º Piloto",
        age: 27,
        country: "NL",
        speed: 85,
        pace: 85,
        experience: 1,
        titles: 0,
        gps: 1,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 1,
    },
    "Liam Lawson": {
        name: "Liam Lawson",
        team: "AlphaTauri",
        status: "Piloto de Testes",
        age: 20,
        country: "NZ",
        speed: 85,
        pace: 84,
        experience: 0,
        titles: 0,
        gps: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 0,
    },
    "Esteban Ocon": {
        name: "Esteban Ocon",
        team: "Alpine",
        status: "1º Piloto",
        age: 26,
        country: "FR",
        speed: 88,
        pace: 87,
        experience: 6,
        titles: 0,
        gps: 111,
        wins: 1,
        podiums: 2,
        poles: 0,
        contractRemainingYears: 1,
    },
    "Pierre Gasly": {
        name: "Pierre Gasly",
        team: "Alpine",
        status: "2º Piloto",
        age: 26,
        country: "FR",
        speed: 88,
        pace: 87,
        experience: 6,
        titles: 0,
        gps: 108,
        wins: 1,
        podiums: 3,
        poles: 0,
        contractRemainingYears: 1,
    },
    "Jack Doohan": {
        name: "Jack Doohan",
        team: "Alpine",
        status: "Piloto de Testes",
        age: 19,
        country: "AU",
        speed: 84,
        pace: 85,
        experience: 0,
        titles: 0,
        gps: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 0,
    },
    "Kevin Magnussen": {
        name: "Kevin Magnussen",
        team: "Haas",
        status: "1º Piloto",
        age: 30,
        country: "DK",
        speed: 86,
        pace: 85,
        experience: 7,
        titles: 0,
        gps: 141,
        wins: 0,
        podiums: 1,
        poles: 1,
        contractRemainingYears: 1,
    },
    "Nico Hülkenberg": {
        name: "Nico Hülkenberg",
        team: "Haas",
        status: "2º Piloto",
        age: 35,
        country: "DE",
        speed: 87,
        pace: 86,
        experience: 11,
        titles: 0,
        gps: 181,
        wins: 0,
        podiums: 0,
        poles: 1,
        contractRemainingYears: 0,
    },
    "Pietro Fittipaldi": {
        name: "Pietro Fittipaldi",
        team: "Haas",
        status: "Piloto de Testes",
        age: 26,
        country: "BR",
        speed: 83,
        pace: 83,
        experience: 1,
        titles: 0,
        gps: 2,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 0,
    },
    "Alexander Albon": {
        name: "Alexander Albon",
        team: "Williams",
        status: "1º Piloto",
        age: 26,
        country: "TH",
        speed: 88,
        pace: 91,
        experience: 3,
        titles: 0,
        gps: 59,
        wins: 0,
        podiums: 2,
        poles: 0,
        contractRemainingYears: 1,
    },
    "Logan Sargeant": {
        name: "Logan Sargeant",
        team: "Williams",
        status: "2º Piloto",
        age: 22,
        country: "US",
        speed: 84,
        pace: 84,
        experience: 0,
        titles: 0,
        gps: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 0,
    },
    "Jamie Chadwick": {
        name: "Jamie Chadwick",
        team: "Williams",
        status: "Piloto de Testes",
        age: 24,
        country: "GB",
        speed: 82,
        pace: 81,
        experience: 0,
        titles: 0,
        gps: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        contractRemainingYears: 0,
    }
}