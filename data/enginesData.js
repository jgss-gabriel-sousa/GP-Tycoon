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
        efficiency: 85,
        reliability: 95,
        cost: 20,
        investments: 0,
    },
    "Renault": {
        power: 91,
        torque: 75,
        efficiency: 95,
        reliability: 70,
        cost: 10,
        investments: 0,
    },
    "Red Bull": {
        power: 100,
        torque: 85,
        efficiency: 70,
        reliability: 90,
        cost: 15,
        investments: 0,
    },
    "Mercedes": {
        power: 90,
        torque: 70,
        efficiency: 75,
        reliability: 80,
        cost: 20,
        investments: 0,
    },
}