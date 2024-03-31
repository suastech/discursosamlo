import decode from '../decode.js'
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function searchnbuild(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://amlodice.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  const date_function = new Date();
  const limit = 500;
  const context_size = 150;
  console.log("ok")

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
  //Revertir el orden de files:
  files.reverse();
  let expression = new RegExp(`\\b${phrase}\\b`, "g");
  for (const file of files) {
    let match;
    while ((match = expression.exec(file.content)) !== null) {
      location_occurrences.push([file.id, match.index]);
      if (location_occurrences.length === limit) break; //
    }
    if (location_occurrences.length === limit) break; // Salir del bucle externo si se alcanza el límite
  }

  //Segunda parte: obtener frases a partir de file
  let firstTen = location_occurrences.slice(0,10)
  let listOfQuotes = [];
    let finalLocations = {}
      for (const [key, value] of firstTen) {
        finalLocations[key]?
          finalLocations[key].push(value)
          : finalLocations[key] = [value];
        }
    
   for (const speechId in finalLocations) {
        let idNumber= parseInt(speechId, 10)
        let file = files.find(file => file.id === idNumber);
        const date = file.title.substring(0, 10).replace(/_/g, '/');
        const name = file.title.substring(11);
        const content = file.content;
        const link = file.link;
        for (const index of finalLocations[speechId]) {
            let fullquote;
            if (index < context_size) {fullquote = content.substring(0, context_size*2).replace(/\n/g, '')}
            else if (index > content.length - context_size)  {fullquote = content.substring(content.length - (context_size*2) , content.length -1).replace(/\n/g, '')}
            else {fullquote = content.substring(index - context_size, index + context_size ).replace(/\n/g, '')};
            let phrase = 
                {
                'id': listOfQuotes.length +1,
                'date': date,
                'name': name,
                'text': fullquote,
                'website': link
                }
            listOfQuotes.push(phrase)
        }

        
    }
  console.log("D=", location_occurrences.length, listOfQuotes.length)
  return res.json([location_occurrences, listOfQuotes]);
}

export default searchnbuild;