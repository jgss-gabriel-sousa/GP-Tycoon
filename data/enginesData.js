class Engine {
    constructor(power, torque, efficiency, reliability, cost) {
        this.power = power;
        this.torque = torque;
        this.efficiency = efficiency;
        this.reliability = reliability;
        this.cost = cost;
        this.maxClients = 0;
        this.maxClients = 0;
        this.clientPowerReduction = reliability;
    }
}

export const enginesData = {
    "Ferrari": {
        power: 95,
        torque: 80,
        reliability: 95,
        cost: 20000,
        blackList: ["Mercedes","Alpine","Red Bull"],
        minContractLength: 1,
    },
    "Renault": {
        power: 91,
        torque: 75,
        reliability: 70,
        cost: 10000,
        blackList: ["Ferrari","Mercedes"],
        minContractLength: 2,
    },
    "Red Bull": {
        power: 100,
        torque: 85,
        reliability: 90,
        cost: 15000,
        blackList: ["Ferrari","McLaren","Alpine","Mercedes"],
        minContractLength: 2,
    },
    "Mercedes": {
        power: 90,
        torque: 70,
        reliability: 80,
        cost: 20000,
        blackList: ["Ferrari","Red Bull","Alpine"],
        minContractLength: 1,
    },
    "Porsche": {
        power: 70,
        torque: 60,
        reliability: 40,
        cost: 20000,
        blackList: ["Ferrari","Mercedes","Alpine"],
        minContractLength: 3,
    },
    "Honda": {
        power: 95,
        torque: 80,
        reliability: 80,
        cost: 20000,
        blackList: ["Ferrari","Mercedes","Alpine","Red Bull"],
        minContractLength: 3,
    },
}