import decode from '../decode.js'
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function newsearch(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://amlodice.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  const date_function = new Date();

  const { phrase, pass } = req.query;
  
  if (!phrase || !pass) {
    return res.status(400).json({ error: 'Solicitud inválida'});
  }

  const inf_deco =decode(pass, date_function)
  console.log(inf_deco,phrase)

  if (inf_deco.valido === false) {
    return res.status(400).json({
    error: 'La solicitud no fue válida. Por favor intenta nuevamente',
    });
    }

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
  let expression = new RegExp(`\\b${phrase}\\b`, "g");
  for (const file of files) {
    let match;
    while ((match = expression.exec(file.content)) !== null) {
      main_counter[file.title.substring(0, 4)] += 1;
      location_occurrences.unshift([file.id, match.index]);
    }
  }
  main_counter = Object.values(main_counter);

  return res.json([location_occurrences, main_counter, inf_deco]);
}

export default newsearch;