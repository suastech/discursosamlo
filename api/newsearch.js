import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function newsearch(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { phrase } = req.query;
  console.log("llega al servidor con:", phrase);
  
  let files;
  let location_occurrences = [];
  let main_counter = {2018: 0, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0, 2024: 0};

  try {
    files = await prisma.newfile.findMany({
      where: {
        content: {
          contains: phrase,
        },
      },
    });
  } catch (error) {
    console.error("No se pudo acceder a la base de datos", error);
    res.status(500).json({ error: 'Hubo un problema al acceder a la base de datos.' });
    return;
  } finally {
    await prisma.$disconnect();
  }
  // Buscar SIEMPRE coincidencia exacta
  let expression = new RegExp(`\\b${phrase}\\b`, "gi");
  for (const file of files) {
    let match;
    while ((match = expression.exec(file.content.toLowerCase())) !== null) {
      main_counter[file.title.substring(0, 4)] += 1;
      location_occurrences.push([file.id, match.index]);
    }
  }
  main_counter = Object.values(main_counter);
  

//  let location_occurrences = [[1,2],[3,4]]
// let main_counter = [1,2,3,4,5,6,7]
  res.json([location_occurrences, main_counter]);
}

export default newsearch;