import encode from './encode.js'
let password = encode()
let final_noise= 2;
let middle_noise=2;

const got_length = (password[password.length - (final_noise+1)]).charCodeAt(0) -100
//const pass= password.substring(password.length - got_length - final_noise -1, password.length-(final_noise+1))

const date = password.substring(5, password.length - (final_noise + 1 + got_length + middle_noise) )

console.log(date)


/*const components= [63,74,82];
const longitud_date=9

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

//Desencriptar: 
const reorder = parseInt(
        date_to_map.slice(-components[1] % 10) + date_to_map.slice(0, -components[1] % 10),10)
const divided = reorder/product_components;

/*
console.log("Encriptar:")
console.log(date_code)
console.log(date_code_utc)
console.log(multiplied_date)
console.log("R=", components[1]%10)
console.log(date_to_map) //Esto es o que voy a mapear.

console.log(date_code_utc)
console.log(divided)
*/