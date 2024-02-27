const fs = require('fs');
const path = require('path');
const readline = require('readline');

const carpetaDiscursos = './discursos';
const longitud_contexto = 300;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
    });

function buscarCadenaEnArchivos(cadena) {

let citas = [];
let distribucion= {
    "2018": [0,0,0,0,0,0,0,0,0,0,0,0],
    "2019": [0,0,0,0,0,0,0,0,0,0,0,0],
    "2020": [0,0,0,0,0,0,0,0,0,0,0,0],
    "2021": [0,0,0,0,0,0,0,0,0,0,0,0],
    "2022": [0,0,0,0,0,0,0,0,0,0,0,0],
    "2023": [0,0,0,0,0,0,0,0,0,0,0,0]
    }

    fs.readdir(carpetaDiscursos, (error, archivos) => {
        if (error) {
        console.error('Error al leer la carpeta:', error);
        return;
        }

    archivos.forEach(archivo => {
    const rutaArchivo = path.join(carpetaDiscursos, archivo);
      const año = archivo.substring(0, 4);
      const mes = parseInt(archivo.substring(5, 7), 10);
  
    
    fs.readFile(rutaArchivo, 'utf8', (error, contenido) => {
            if (error) {
            console.error(`Error al leer el archivo ${archivo}:`, error);
            return;
            }
            
            let exp_arreglada;

            if ((cadena.startsWith(`"`) && cadena.endsWith(`"`)) || (cadena.startsWith(`'`) && cadena.endsWith(`'`))) {
                const resultado = cadena.slice(1, -1);
                const cadenaEscapada = resultado.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
                exp_arreglada = new RegExp(`\\b${cadenaEscapada}\\b`, 'gi');          
                }

            else {
                exp_arreglada = new RegExp(cadena, 'gi')
                }
            
            let match;
            while ((match = exp_arreglada.exec(contenido)) !== null) {
                let cita;
                if (match.index < longitud_contexto) {cita= contenido.substring(0, longitud_contexto*2).replace(/\n/g, '')}
                else if (match.index > contenido.length - longitud_contexto)  {cita = contenido.substring(contenido.length - (longitud_contexto*2) , contenido.length -1).replace(/\n/g, '')}
                else {cita = contenido.substring(match.index - longitud_contexto, match.index + longitud_contexto ).replace(/\n/g, '')};

              let objeto = {"fecha": archivo, "frase": cita};
              citas.push(objeto);
              distribucion[año][mes-1] += 1;
              }
        });
    })
  })

    setTimeout(() => {
      if (citas.length > 0) {
        
        for (let objeto of citas) {
            console.log('Fecha:', objeto.fecha, '"...',objeto.frase,'..."\n')
        }
        console.log("Repeticiones: ", citas.length)
        
        rl.question('Si deseas guardar los resultados presiona "s": ', respuesta => {
          if (respuesta === "s") {
            
            function convertidor(objeto) {
              return `Fecha: ${objeto.fecha}, "...${objeto.frase}..."\n\n`; 
              }

             let texto = citas.map(convertidor).join('');  
             let sintesis = `{\n"2018": [${distribucion['2018']}],\n"2019": [${distribucion['2019']}],\n"2020": [${distribucion['2020']}],\n"2021": [${distribucion['2021']}],\n"2022": [${distribucion['2022']}],\n"2023": [${distribucion['2023']}]\n}`;
             let sintesis_anual = `{\n"2018": [${distribucion['2018'].reduce((acumulador, valor) => acumulador + valor, 0)}],\n"2019": [${distribucion['2019'].reduce((acumulador, valor) => acumulador + valor, 0)}],\n"2020": [${distribucion['2020'].reduce((acumulador, valor) => acumulador + valor, 0)}],\n"2021": [${distribucion['2021'].reduce((acumulador, valor) => acumulador + valor, 0)}],\n"2022": [${distribucion['2022'].reduce((acumulador, valor) => acumulador + valor, 0)}],\n"2023": [${distribucion['2023'].reduce((acumulador, valor) => acumulador + valor, 0)}]\n}`;
             
             //JSON.stringify(distribucion, null, 2);

             let ruta_archivo = path.join(__dirname, `frases_contexto`, `${cadena[0] === '"' ? cadena.slice(1, -1) : cadena}_${citas.length}.txt`);
             fs.writeFileSync(ruta_archivo, `"${cadena}"\n${sintesis}\nFrecuencia anual:${sintesis_anual}\n\n${texto}`, 'utf-8');
             console.log("Archivo creado para la cadena: ", cadena);
             buscarCadena()
          }
          else {buscarCadena()}   
        })
      }
    else {console.log('Cadena no encontrada en ningún archivo.'); }
      buscarCadena();
    }, 2000); //
}

function buscarCadena() {
  rl.question('Ingrese la cadena a buscar (Presione ESC para salir): ', respuesta => {
    if (respuesta.length < 3) {
      console.log("Escribe al menos 3 caracteres")
      buscarCadena()
      return
    }

    if (respuesta === '\u001b' || respuesta === "salir") {
      console.log('Saliendo del programa.');
      rl.close();
      return;
    }

    buscarCadenaEnArchivos(respuesta);
  });
}

buscarCadena();