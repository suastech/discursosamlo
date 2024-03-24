// Date Code:
const longitud_date = 9;

const date_code = new Date();
let date_code_utc = Date.UTC(
    2024, 2, 1,
    date_code.getUTCHours(),
    date_code.getUTCMinutes(),
    date_code.getUTCSeconds(),
    date_code.getUTCMilliseconds()
);

date_code_utc = parseInt(date_code_utc.toString().slice(-longitud_date), 10)


// Date Function:
const date_function = new Date();
let date_function_utc = Date.UTC(
    2024, 2, 1,
    date_function.getUTCHours(),
    date_function.getUTCMinutes(),
    date_function.getUTCSeconds(),
    date_function.getUTCMilliseconds()
);

date_function_utc = parseInt(date_function_utc.toString().slice(-longitud_date), 10)


const diferencia = date_function_utc - date_code_utc; // Calcular la diferencia en milisegundos
const diferencia_decisegundos = Math.floor(diferencia / 100); // Convertir la diferencia a décimas de segundo


console.log(date_code_utc)
console.log(date_function_utc)

console.log("Diferencia neta", diferencia)
console.log("Dif decisegundos", diferencia_decisegundos);
/*
if (diferencia_decisegundos < 5) {
    console.log("Válido");
}

*/