const fs = require('fs');
const path = require('path');

async function Finder(phrase) {
  const routeDirectory = "./discursos";
  let location_occurrences = [];
  let main_counter = {
    "2018": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "2019": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "2020": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "2021": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "2022": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "2023": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };

  try {
    const files = fs.readdirSync(routeDirectory);

    for (const file of files) {
      const routeFile = path.join(routeDirectory, file);
      const year = file.substring(0, 4);
      const month = parseInt(file.substring(5, 7), 10);

      const content = await new Promise((resolve, reject) => {
        fs.readFile(routeFile, "utf8", (error, content) => {
          if (error) {
            console.error(`Error al leer el archivo ${file}:`, error);
            reject(error);
          } else {
            resolve(content);
          }
        });
      });

      let exp_fixed;

      if (
        (phrase.startsWith(`"`) && phrase.endsWith(`"`)) ||
        (phrase.startsWith(`'`) && phrase.endsWith(`'`))
      ) {
        const result = phrase.slice(1, -1);
        const phrase_fixed = result.replace(/[.*+\-?^${}()|[\]\\,]/g, "\\$&");
        exp_fixed = new RegExp(`\\b${phrase_fixed}\\b`, "gi");
      } else {
        exp_fixed = new RegExp(phrase, "gi");
      }

      let match;
      while ((match = exp_fixed.exec(content)) !== null) {
        main_counter[year][month - 1] += 1;
        location_occurrences.push([file, match.index]);
      }
    }
  } catch (error) {
    console.error('No se pudo acceder a la carpeta:', error);
  }
  
  console.log(location_occurrences,main_counter)
  return [location_occurrences, main_counter];
}

