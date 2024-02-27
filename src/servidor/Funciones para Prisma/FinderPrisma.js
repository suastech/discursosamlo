import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


async function Finder(phrase) {
  
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
    const files = await prisma.newfile.findMany();

    for (const file of files) {
      const year = file.title.substring(0, 4);
      const month = parseInt(file.title.substring(5, 7), 10);
      const content = file.content;

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
        location_occurrences.push([file.id, match.index]);
      }
    }
  } catch (error) {
    console.error('No se pudo acceder a la carpeta:', error);
    }
    finally {
      await prisma.$disconnect();
    }

  return [location_occurrences, main_counter];
}

/*
async function main() {
  const results = await Finder("Calderón");
  console.log('Resultados:', results);
}

main(); */

export default Finder;