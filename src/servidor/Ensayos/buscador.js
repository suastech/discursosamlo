const fs = require('fs');
const path = require('path');
const readline = require('readline');

const carpetaDiscursos = './discursos';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function buscarCadenaEnArchivos(cadena) {
  fs.readdir(carpetaDiscursos, (error, archivos) => {
    if (error) {
      console.error('Error al leer la carpeta:', error);
      return;
    }

    let totalCoincidencias = 0;

    archivos.forEach(archivo => {
      const rutaArchivo = path.join(carpetaDiscursos, archivo);

      fs.readFile(rutaArchivo, 'utf8', (error, contenido) => {
        if (error) {
          console.error(`Error al leer el archivo ${archivo}:`, error);
          return;
        }
        if ((cadena.startsWith(`"`) && cadena.endsWith(`"`)) || (cadena.startsWith(`'`) && cadena.endsWith(`'`))) {
        const resultado = cadena.slice(1, -1);
        const cadenaEscapada = resultado.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${cadenaEscapada}\\b`, 'gi');

        const coincidencias = (contenido.match(regex) || []).length;
        totalCoincidencias += coincidencias;
        }  
        
        else {
        const coincidencias = (contenido.match(new RegExp(cadena, 'gi')) || []).length;
        totalCoincidencias += coincidencias;
        }
      });
    });

    setTimeout(() => {
      if (totalCoincidencias > 0) {
        console.log(cadena, ":", totalCoincidencias)
      }

      else {console.log('Cadena no encontrada en ningún archivo.');
      }
      buscarCadena();
    },1000); // Esperar 1 segundo después de procesar archivos
  });
}

function buscarCadena() {
  rl.question('Ingrese la cadena a buscar (Presione ESC para salir): ', respuesta => {
    if (respuesta === "") {
        console.log("Por favor introduce una palabra")
        buscarCadena();
        return
    }

    if (respuesta.length < 3) {
      console.log("Escribe al menos 3 caracteres")
      buscarCadena();
      return
    }

    if (respuesta === '\u001b' || respuesta === "salir") {
      console.log('Saliendo del programa.');
      rl.close();
      return;
    }

    const palabras = respuesta.split(',')
    for (let palabra of palabras) { buscarCadenaEnArchivos(palabra)};
  });
}

buscarCadena();
