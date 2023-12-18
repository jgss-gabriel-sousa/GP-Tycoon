export function rand(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function rollDice(formula) {
    // Extrai o número de dados, faces dos dados e bônus da fórmula de dados
    const [numDice, numFaces, bonus] = formula.split(/[d\+]/).map(Number);
  
    // Gera um número aleatório para cada dado e soma-os
    const rollTotal = Array.from({ length: numDice }, () => Math.floor(Math.random() * numFaces) + 1)
                         .reduce((sum, val) => sum + val, 0);
  
    // Retorna o resultado da rolagem, com o bônus adicionado
    return rollTotal + bonus;
}

export function shuffleArr(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function NumberF(number,format,precision){    
    if(format == "ext"){
        let value = "";
        const M = Math.floor(number/1000000);
        let K = Math.floor((number%1000000)/1000);
        
        if(M > 0 || M < 0){
            if(M == 1)
                value = M+" milhão ";
            else
                value = M+" milhões ";
        }

        if(M != 0)
            K = Math.abs(K);

        if(K != 0)
            value += K+" mil";
        return value;
    }
    if(format == "ext-short"){
        let value = "";
        const M = parseInt(number/1000000,10);
        const K = Math.round((number-(M*1000000))/1000,10);
        const KK = Math.round((number-(M*1000000))/100000,10);

        if(M > 0 || M <= 0){
            value = M+"M";
        }
        if(M > 0 && K > 0){
            if(K != 0)
                value = M+"."+KK+"M";
        }
        if(M <= 0 && K > 0){
            if(K != 0)
                value = K+"K";
        }
        if(M == 0 && K == 0){
            value = K+"K";
        }
        else if(M < 0 && K < 0){
            if(K != 0)
                value += -(K)+"K"; 
        }

        return value;
    }
    
    if(precision == 0){
        number = number.toString().replace(".", ",");
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    else
        return number.toFixed(precision);
}

export function average(array){
    let total = 0;

    array.forEach(e => {
        total += e;
    });

    if(array.length == 0) return 0;
    return total / array.length;
}

export function preloadImage(url){
    const img = new Image();
    img.src = url;
}

export function blankSpaceRmv(string){
    return string.replace(/\s/g, "_");
}

export function genID(string){
    string = string.replace(/\s/g, "-");
    string = string.replace(/\./g, "-");
    string = string.replace(/'/g, "-");
    string = accentsTidy(string);
    return string;
}

export function accentsTidy(string){
    let r = string.toLowerCase();
    const non_asciis = {'a': '[àáâãäå]', 'ae': 'æ', 'c': 'ç', 'e': '[èéêë]', 'i': '[ìíîï]', 'n': 'ñ', 'o': '[òóôõö]', 'oe': 'œ', 'u': '[ùúûűü]', 'y': '[ýÿ]'};
    
    for(let i in non_asciis){
        r = r.replace(new RegExp(non_asciis[i], 'g'), i);
    }

    return r;
}

export function setBarProgress(value, barElement){
    if(value <= 1){
        value *= 100;
    }

    document.querySelector(barElement).style.width = value+"%";
    document.querySelector(barElement+" span").innerText = value+"%";
}

export function hoursBetweenDates(first, second){
    const msBetweenDates = Math.abs(first - second);
    return msBetweenDates / (60 * 60 * 1000); //minutes * seconds * ms
}