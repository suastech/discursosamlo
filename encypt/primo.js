import mapa from './mapa.js'

const longitud_date = 9;
let primo = 100267;
let verificador = '';
let cadena = '';
let numberOfComponents = 3;
let components = []
const rango_verificador = 100;
const mapa_inverso = invertir(mapa)

function invertir(objeto) {
    const objetoInverso = {};
    for (let clave in objeto) {
        const valor = objeto[clave];
        objetoInverso[valor] = clave;
    }
    return objetoInverso;
}

function mapear(num) {
    num= num.toString()
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
// Generar aleatoriamente 3 números entre 65 y 122
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
//Obtener componentes: Esto ya es desencriptación
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

// Encriptación
const verificadorDecimal = parseInt(verificador, 2);
const verificador_enmascarado = String.fromCharCode(verificadorDecimal+rango_verificador)
const cadena_numero = parseInt(cadena, 10)
const cifrado = cadena_numero*primo;
const showed_pass = mapear(cifrado, mapa)

//ENCRIPTAR FECHA
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
//Inversión:
const date_to_map = multiplied_date.slice(components[1] % 10) + multiplied_date.slice(0, components[1] % 10);
const showed_date = mapear(date_to_map);

//Desencriptar Fecha: 
const date_decripted = mapear_inverso(showed_date)
const reorder = parseInt(
    date_decripted.slice(-components[1] % 10) + date_decripted.slice(0, -components[1] % 10),10)
const got_date = reorder/product_components;

//Pensar ¿cómo esconder el verificador_enmascarado:
//OJO: sólo adopta 8 valores. 

//Desencriptación:
const string_a_numero_cifrado = mapear_inverso(showed_pass)
const num_original = Math.round(string_a_numero_cifrado/primo)
const verificador_descodificado = verificador_enmascarado.charCodeAt(0)-rango_verificador
const verificador_string_binario = verificador_descodificado.toString(2).padStart(numberOfComponents, '0')
const originales = obtener_componentes(num_original,verificador_string_binario)

//return `${verificadorDecimal}${showed_date}${showed_pass}`

//console.log(date_code_utc)
//console.log(got_date)



//Estructura: xxxxVerificadorDatexxPrimoxxx;
let final = `${generateRandom(4)}${verificador_enmascarado}${showed_date}${generateRandom(2)}${showed_pass}`
console.log(final)
console.log("R=", verificador_enmascarado)

