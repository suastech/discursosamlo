// Date Code:
const date_code = new Date();

const minutos = date_code.getMinutes();
const segundos = date_code.getSeconds();
const decisegundos = Math.floor(date_code.getMilliseconds()/100);

const date_code_string = minutos.toString() + segundos.toString() + decisegundos.toString();
const date_code_num = parseInt(date_code_string,10);

//Date Function
const date_function= new Date();
const minutosFun = date_function.getMinutes();
const segundosFun = date_function.getSeconds();
const decisegundosFun = Math.floor(date_function.getMilliseconds()/100);

const date_fun_string = minutosFun.toString() + segundosFun.toString() + decisegundosFun.toString();
const date_fun_num = parseInt(date_fun_string,10);

const diferencia = date_fun_num - date_code_num;
if (diferencia<5) { console.log("válido")}

console.log(date_code_string, date_fun_string);
console.log(diferencia);
