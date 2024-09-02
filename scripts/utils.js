export function rand(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function rollDice(formula) {
    const [numDice, numFaces, bonus] = formula.split(/[d\+]/).map(Number);
  
    const rollTotal = Array.from({ length: numDice }, () => Math.floor(Math.random() * numFaces) + 1)
                         .reduce((sum, val) => sum + val, 0);
  
    return rollTotal + bonus;
}

export function shuffleArr(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function roundToMultiple(number, multiple) {
    if (multiple === 0) {
        return number;
    }

    const quotient = Math.floor(number / multiple);
    const remainder = number % multiple;
    const differenceToNextMultiple = multiple - remainder;

    const rounding = (remainder < differenceToNextMultiple) ? -remainder : differenceToNextMultiple;

    return number + rounding;
}

export function NumberF(number,format,precision){    
    if (format == "ext") {
        if (number === 0) {
            return "-";
        }
    
        let negative = number < 0;
        number = Math.abs(number);
    
        let value = "";
        const M = Math.floor(number / 1_000_000);
        const K = Math.floor((number % 1_000_000) / 1_000);
        
        if (M !== 0) {
            value = M === 1 ? "1 milhão " : `${M} milhões `;
        }
    
        if (K !== 0) {
            value += `${K} mil`;
        }
        
        return negative ? `-${value.trim()}` : value.trim();
    }
    
    if (format == "ext-short") {
        let value = "";
        const T = Math.floor(number / 1_000_000_000_000);
        const B = Math.floor((number % 1_000_000_000_000) / 1_000_000_000);
        const M = Math.floor((number % 1_000_000_000) / 1_000_000);
        const K = Math.floor((number % 1_000_000) / 1_000);
        const KK = Math.floor((number % 1_000_000) / 100_000);
    
        if (T > 0) {
            value = `${T}T `;
        } else if (B > 0) {
            value = `${B}B `;
        } else if (M > 0) {
            value = `${M}M `;
            if (K > 0) {
                value = `${M}.${KK}M`;
            }
        } else if (K > 0) {
            value = `${K}K`;
        } else {
            value = `${number}`;
        }
    
        return value.trim();
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

export function timeConvert(minutes){ //Convert minutes in race lap time format
    const minutesInt = Math.floor(minutes);
    const seconds = Math.floor((minutes - minutesInt) * 60);
    const milliseconds = Math.floor(((minutes - minutesInt) * 60 - seconds) * 1000);
    const secondsStr = seconds.toString().padStart(2, '0');
    const millisecondsStr = milliseconds.toString().padStart(3, '0');

    if(minutesInt <= 0)
        return secondsStr + ':' + millisecondsStr;
    if(minutesInt > 0)
        return minutesInt + ':' + secondsStr + ':' + millisecondsStr;
}