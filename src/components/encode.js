import mapa from './mapa.js'

//Nota importante: si numberOfComponentes es mayor a 3, hay más de 10 resultados posibles para verificador
//...en ese caso, tengo que usar forzosamente la representación ascii, o puedo tener dos cifras y no sabría cómo manejarlo

function encode() {
const longitud_date = 9;
let primo = 100267;
let verificador = '';
let cadena = '';
let numberOfComponents = 3;
let components = []
const rango_verificador = 70;
const encode_length = 100;
const middle_noise= 2;
const final_noise = 2;


function mapear(num_string) {
    let resultado = '';
    // Iterar sobre cada par de dígitos en la cadena numérica
    for (let i = 0; i < num_string.length; i += 2) {
        // Si quedan menos de dos dígitos y la cadena tiene longitud impar, procesar solo el último dígito
        if (i === num_string.length - 1 && num_string.length % 2 !== 0) {
            const caracter = mapa[num_string[i]];
            resultado += caracter;
        } else {
            const par = num_string.slice(i, i + 2); // Obtener el par de dígitos
            const caracter = mapa[par]; // Obtener el caracter correspondiente al par de dígitos
            resultado += caracter;
        }
    }
    return resultado;
}

function generateRandom(howMany) {
    let cadena = '';
    for (let i = 0; i < howMany; i++) {
        let randomNumber;
        do {
            // Generar un número aleatorio entre 48 y 122 (incluyendo números, letras mayúsculas y minúsculas)
            randomNumber = Math.floor(Math.random() * (122 - 48 + 1)) + 48;
        } while ((randomNumber >= 58 && randomNumber <= 64) || (randomNumber >= 91 && randomNumber <= 96)); // Evitar caracteres especiales
        cadena += String.fromCharCode(randomNumber);
    }
    return cadena;
}

// GENERACIÓN Y ENCRIPTACIÓN PRIME
for (let i = 0; i < numberOfComponents; i++) {
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * (122 - 65 + 1)) + 65;
    } while (randomNumber >= 91 && randomNumber <= 96); // Evitar números entre 91 y 96
    // Agregar el número a la cadena
    cadena += randomNumber;
    // Agregar el dígito verificador
    verificador += (randomNumber > 99) ? '1' : '0';
    components.push(randomNumber)
}
const verificadorDecimal = parseInt(verificador, 2);
//const verificador_enmascarado = String.fromCharCode(verificadorDecimal+rango_verificador)
const cifrado = ((parseInt(cadena, 10))*primo).toString()
const showed_pass = mapear(cifrado)

//GENERACIÓN Y ENCRIPTACIÓN DE FECHA
const date_code = new Date();
let date_code_utc = Date.UTC(
    2024, 2, 1,
    date_code.getUTCHours(),
    date_code.getUTCMinutes(),
    date_code.getUTCSeconds(),
    date_code.getUTCMilliseconds()
);

date_code_utc = parseInt(date_code_utc.toString().slice(-longitud_date), 10);
const product_components = components.reduce((accumulator, currentValue) => accumulator * currentValue, 1);
const multiplied_date = (date_code_utc*product_components).toString()
const date_to_map = multiplied_date.slice(components[1] % 10) + multiplied_date.slice(0, components[1] % 10);
const showed_date = mapear(date_to_map);

return `${generateRandom(4)}${verificadorDecimal}${showed_date}${generateRandom(middle_noise)}${showed_pass}${String.fromCharCode(encode_length+showed_pass.length)}${generateRandom(final_noise)}`
}


export default encode;
