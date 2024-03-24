import fs from 'fs';

const mapa = {};
const values_used = [];

// Generar un array con todas las keys del "0" al "9" y del "00" al "99"
const twoKeys = [];
for (let i = 0; i < 100; i++) {
    const key = (i < 10 ? '0' : '') + i.toString();
    twoKeys.push(key);
}

const oneKeys= []
for (let i = 0; i <= 9; i++) {
    const key = i.toString();
    oneKeys.push(key)
}

const allKeys = oneKeys.concat(twoKeys);

// Reordenar el array de keys de manera aleatoria
const shuffledKeys = allKeys.sort(() => Math.random() - 0.5);

// Función para generar un valor único
function generateUniqueValue() {
    let value;
    do {
        // Generar un valor aleatorio
        if (Math.random() < 0.5) {
            // Generar letra mayúscula o minúscula
            value = String.fromCharCode(Math.random() < 0.5 ? Math.floor(Math.random() * 26) + 65 : Math.floor(Math.random() * 26) + 97);
        } else {
            // Generar un string de dos números
            value = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        }
    } while (values_used.includes(value)); // Verificar si el valor ya ha sido utilizado
    values_used.push(value); // Añadir el valor al array de valores utilizados
    return value;
}

// Iterar sobre el array de keys reordenado y asignar valores únicos al objeto mapa
shuffledKeys.forEach(key => {
    mapa[key] = generateUniqueValue();
});

// Guardar el objeto generado como un archivo JSON
const jsContent = `const mapa = ${JSON.stringify(mapa, null, 2)};\n\nexport default mapa;`;

// Escribir el contenido en un archivo JS
fs.writeFileSync('mapa.js', jsContent);

console.log('El archivo mapa.js ha sido generado con éxito.');