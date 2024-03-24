import mapa from './mapa.js'

const date_code = new Date();
const date_code_utc = Date.UTC(
    2024, 2, 1,
    date_code.getUTCHours(),
    date_code.getUTCMinutes(),
    date_code.getUTCSeconds(),
    date_code.getUTCMilliseconds()
);

function mapear(num) {
    num = num.toString()
    let resultado = '';
    // Iterar sobre cada par de dígitos en la cadena numérica
    for (let i = 0; i < num.length; i += 2) {
        // Si quedan menos de dos dígitos y la cadena tiene longitud impar, procesar solo el último dígito
        if (i === num.length - 1 && num.length % 2 !== 0) {
            const caracter = mapa[num[i]];
            resultado += caracter;
        } else {
            const par = num.slice(i, i + 2); // Obtener el par de dígitos
            const caracter = mapa[par]; // Obtener el caracter correspondiente al par de dígitos
            resultado += caracter;
        }
    }
    return resultado;
}


const coded_date_string = mapear(date_code_utc)

console.log("Fecha utc:",date_code_utc)
console.log("Fecha encriptada:", coded_date_string)