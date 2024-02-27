// Ojo, falta resolver la asincronía. Ver FinderAsync
const fs = require("fs");
const path = require("path");

function Finder(phrase) {
  
  const routeDirectory = "./discursos";
  let location_occurrences = [];
  let main_counter = {
    2018: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2019: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2020: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2021: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2022: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2023: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };
  
  fs.readdir(routeDirectory, (error, files) => {
    if (error) {
      console.error("Error al leer la carpeta:", error);
      return;
    }

    files.forEach((file) => {
      const routeFile = path.join(routeDirectory, file);
      const year = file.substring(0, 4);
      const month = parseInt(file.substring(5, 7), 10);

      fs.readFile(routeFile, "utf8", (error, content) => {
        if (error) {
          console.error(`Error al leer el file ${file}:`, error);
          return;
        }

        let exp_fixed;

        if (
          (phrase.startsWith(`"`) && phrase.endsWith(`"`)) ||
          (phrase.startsWith(`'`) && phrase.endsWith(`'`))
        ) {
          const result = phrase.slice(1, -1);
          const phrase_fixed = result.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
          exp_fixed = new RegExp(`\\b${phrase_fixed}\\b`, "gi");
        } else {
          exp_fixed = new RegExp(phrase, "gi");
        }

        let match;
        while ((match = exp_fixed.exec(content)) !== null) {
          main_counter[year][month - 1] += 1;
          location_occurrences.push([file, match.index]);
        }
      });
    });
  });
  return console.log(main_counter, location_occurrences);
}

export default Finder;