export function Driver(name,country,ability,salary){
    this.name = name;
    this.country = country;
    this.ability = ability;
    this.salary = salary;
}

export function rand(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function numberFormatted(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function numberBalanceFormatted(number){
    let value;
    if(number < 10){
        value = number.toFixed(1);
    }
    else{
        value = Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    if(value > 0)
        value = "+"+value;
    
    return value;
}

export function translateSeason(season){
    if(season == "spring")  return "Primavera";
    if(season == "summer")  return "Verão";
    if(season == "autumn")  return "Outono";
    if(season == "winter")  return "Inverno";
}

export function average(array){
    let total = 0;
    let count = 0;

    array.forEach(function(item, index) {
        total += item;
        count++;
    });

    return total / count;
}
