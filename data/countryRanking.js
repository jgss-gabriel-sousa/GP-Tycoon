import { rand } from "../utils.js";

function getCountriesByTier(tier){
    return Object.entries(countryRanking)
        .filter(([country, countryTier]) => countryTier === tier)
        .map(([country]) => country);
}

export function getRandomCountry(){
    let r = rand(0,1000);
    let countries = [];

    if(r >= 500) countries = getCountriesByTier(1);
    else if(r >= 250) countries = getCountriesByTier(2);
    else if(r >= 125) countries = getCountriesByTier(3);
    else if(r >= 62) countries = getCountriesByTier(4);
    else if(r >= 31) countries = getCountriesByTier(5);
    else countries = getCountriesByTier(6);

    const randomIndex = Math.floor(Math.random() * countries.length);
    return countries[randomIndex];
}

export function getCountryEthnicity(countryName) {
    const ethnicities = {
        european: [
            'IT', 'DE', 'GB', 'FR', 'AU', 'FI', 'CA', 'ES', 'NL',
            'BE', 'AT', 'SE', 'IE', 'PT', 'DK', 'MC', 'NZ', 'GR',
            'PL', 'HU', 'CH', 'EE', 'NO', 'RO', 'UA', 'LT', 'LV',
            'BG', 'LU', 'BR', 'AR', 'US', 'RU', 'HR', 'SI', 'IL',
            'RO', 'UA', 'RS', 'BG', 'SK', 'LT', 'LV', 'CZ', 'TR',
        ],
        indian: ['IN'],
        asian: ['JP', 'KR', 'SG', 'ID', 'TH', 'CN'],
        latin: ['BR', 'AR', 'MX', 'CL', 'CO', 'PE'],
        arab: ['AE', 'EG', 'SA', 'QA', 'KW'],
        african: ['ZA', 'NG'],
    };

    const countryEthnicities = [];

    // Check the country and add the corresponding ethnicities to the array
    Object.entries(ethnicities).forEach(([ethnicity, countries]) => {
        if (countries.includes(countryName)) {
            countryEthnicities.push(ethnicity);
        }
    });

    if(countryEthnicities.length == 0) countryEthnicities.push("generic");

    const ethnicityData = {
        ethnicity: countryEthnicities[rand(0, countryEthnicities.length)],
    }

    if(ethnicityData.ethnicity == "european"){
        ethnicityData["maleImgs"] = 19;
        ethnicityData["femaleImgs"] = 4;
    }
    if(ethnicityData.ethnicity == "indian"){
        ethnicityData["maleImgs"] = 5;
        ethnicityData["femaleImgs"] = 4;
    }
    if(ethnicityData.ethnicity == "asian"){
        ethnicityData["maleImgs"] = 7;
        ethnicityData["femaleImgs"] = 4;
    }
    if(ethnicityData.ethnicity == "latin"){
        ethnicityData["maleImgs"] = 11;
        ethnicityData["femaleImgs"] = 4;
    }
    if(ethnicityData.ethnicity == "arab"){
        ethnicityData["maleImgs"] = 4;
        ethnicityData["femaleImgs"] = 4;
    }
    if(ethnicityData.ethnicity == "african"){
        ethnicityData["maleImgs"] = 14;
        ethnicityData["femaleImgs"] = 2;
    }
    if(ethnicityData.ethnicity == "generic"){
        ethnicityData["maleImgs"] = 5;
        ethnicityData["femaleImgs"] = 1;
    }

    return ethnicityData;
}

export const countryRanking = {
    // Tier 1 (Alta probabilidade)
    'IT': 1, // Itália
    'DE': 1, // Alemanha
    'GB': 1, // Reino Unido
    'FR': 1, // França
    
    'AU': 2, // Austrália
    'US': 2, // Estados Unidos
    'BR': 2, // Brasil
    'FI': 2, // Finlândia
    'CA': 2, // Canadá
    'ES': 2, // Espanha
    'NL': 2, // Países Baixos
    'BE': 2, // Bélgica
    'JP': 2, // Japão
  
    'AT': 3, // Áustria
    'SE': 3, // Suécia
    'AR': 3, // Argentina
    'MX': 3, // México
    'IE': 3, // Irlanda
    'PT': 3, // Portugal
    'DK': 3, // Dinamarca
    'MC': 3, // Mônaco
    'NZ': 3, // Nova Zelândia
  
    'RU': 4, // Rússia
    'CN': 4, // China
    'IN': 4, // Índia
    'ZA': 4, // África do Sul
    'PL': 4, // Polônia
    'HU': 4, // Hungria
    'CO': 4, // Colômbia
    'CL': 4, // Chile
    'CH': 4, // Suíça
  
    'SG': 5, // Singapura
    'EE': 5, // Estônia
    'TR': 5, // Turquia
    'GR': 5, // Grécia
    'CZ': 5, // República Tcheca
    'KR': 5, // Coreia do Sul
    'ID': 5, // Indonésia
    'TH': 5, // Tailândia
    'AE': 5, // Emirados Árabes Unidos
    'EG': 5, // Egito
    'NG': 5, // Nigéria
    'IL': 5, // Israel
    'HR': 5, // Croácia
    'SI': 5, // Eslovênia 
  
    // Tier 6 (Baixa probabilidade)
    'RO': 6, // Romênia
    'UA': 6, // Ucrânia
    'NO': 6, // Noruega
    'MY': 6, // Malásia
    'PH': 6, // Filipinas
    'VN': 6, // Vietnã
    'PE': 6, // Peru
    'SA': 6, // Arábia Saudita
    'QA': 6, // Catar
    'KW': 6, // Kuwait
    'MA': 6, // Marrocos
    'SK': 6, // Eslováquia 
    'RS': 6, // Sérvia  
    'LT': 6, // Lituânia   
    'LV': 6, // Letônia    
    'BG': 6, // Bulgária     
    'LU': 6, // Luxemburgo      
  };