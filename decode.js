/*Estructura:   xxxx
                Verificador
                DATE
                xx
                PASS
                LENGTHCODED
                xx;    */

import mapa from './encypt/mapa.js'

function decode(password) {
const date_function = new Date();

const longitud_date = 9;
let primo = 100267;
//const rango_verificador = 70;
const encode_length = 100;
const final_noise = 2;
const numberOfComponents = 3;
const mapa_inverso = invertir(mapa);
const middle_noise= 2;

function invertir(objeto) {
    const objetoInverso = {};
    for (let clave in objeto) {
        const valor = objeto[clave];
        objetoInverso[valor] = clave;
    }
    return objetoInverso;
}

function mapear_inverso(cadena) {
    let resultado = '';
    for (let i = 0; i < cadena.length; i++) {
        const caracterActual = cadena[i];
        // Verificar si el caracter es una letra
        if (/[a-zA-Z]/.test(caracterActual)) {
            // Obtener el valor de la letra del mapa_inverso y añadirlo a resultado
            resultado += mapa_inverso[caracterActual];
        }
        // Verificar si el caracter es un número
        else if (!isNaN(parseInt(caracterActual))) {
            // Obtener el siguiente caracter
            const siguienteCaracter = cadena[i + 1];
            // Formar el número con el caracter actual y el siguiente
            const par = caracterActual + siguienteCaracter;
            // Obtener el valor del número del mapa_inverso y añadirlo a resultado

            resultado += mapa_inverso[par];
            // Incrementar el índice para saltar al siguiente caracter
            i++;
        }
    }

    return resultado;
}

//1 OBTENER PASS:
function obtener_componentes (numero,cadena) {
    const componentes = [];
    let indice = 0;

    for (let i = 0; i < cadena.length; i++) {
        const longitud = parseInt(cadena[i]) === 0 ? 2 : 3;
        const componente = parseInt(numero.toString().slice(indice, indice + longitud));
        componentes.push(componente);
        indice += longitud;
    }

    return componentes;
}

//Obtener length de pass: Valor original de la posición -3 = final noise + 1

const got_length = (password[password.length - (final_noise+1)]).charCodeAt(0) - encode_length;
// Obtener pass: 
const pass= password.substring(password.length - got_length - final_noise -1, password.length-(final_noise+1))
//Decodificar pass: 
const pass_deco = mapear_inverso(pass)
const num_original = Math.round(pass_deco/primo)

//Obtener verificador: 
const verificador = password[4]
//const verificador_descodificado = verificador_enmascarado.charCodeAt(0)-rango_verificador //Porque estoy usando el decimal
const verificador_binario = parseInt(verificador, 10).toString(2).padStart(numberOfComponents, '0');

//Obtener componentes
const components = obtener_componentes(num_original,verificador_binario)


//3 DECODE DATE:
const showed_date  = password.substring(5, password.length - (final_noise + 1 + got_length + middle_noise) )
const product_components = components.reduce((accumulator, currentValue) => accumulator * currentValue, 1);
const date_decripted = mapear_inverso(showed_date)
const reorder = parseInt(
    date_decripted.slice(-components[1] % 10) + date_decripted.slice(0, -components[1] % 10),10)

const got_date = reorder/product_components;

//4 Comparar: 
let date_function_utc = Date.UTC(
    2024, 2, 1,
    date_function.getUTCHours(),
    date_function.getUTCMinutes(),
    date_function.getUTCSeconds(),
    date_function.getUTCMilliseconds()
);
date_function_utc = parseInt(date_function_utc.toString().slice(-longitud_date), 10)

const diferencia = Math.abs(date_function_utc - got_date);
const diferencia_decisegundos = Math.floor(diferencia / 100); // Convertir la diferencia a décimas de segundo

//console.log("Redondedo independiente:", Math.floor(got_date/100), Math.floor(date_function_utc/100));

const response = {
    "fechaFunción": date_function,
    "fechaFuncionUTC": date_function_utc,
    "fechaObtenida": got_date,
    "Diferencia": diferencia,
    "valido": diferencia_decisegundos<6,
    }

return response

}

export default decode;