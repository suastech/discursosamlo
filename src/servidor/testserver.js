import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client'
import express from 'express';
const prisma = new PrismaClient()
const app = express();
const PORT = 3000;
const context_size = 150;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(bodyParser.json());

//Search
async function search(phrase, exact) {
let location_occurrences = [];
let main_counter = {
    "2018": 0,
    "2019": 0,
    "2020": 0,
    "2021": 0,
    "2022": 0,
    "2023": 0,
    "2024": 0,
  };
  try {
    const files = await prisma.newfile.findMany(
    {
      where: {
        content: {
          contains: {regexp: `(?i)${phrase}`},
        },
      },
    });
    let expression = exact? new RegExp(`\\b${phrase}\\b`, "gi") : new RegExp(phrase,'gi')
    for (const file of files) {
      let match;
      while ((match = expression.exec(file.content.toLowerCase())) !== null) {
        main_counter[file.title.substring(0, 4)]+= 1;
        location_occurrences.push([file.id, match.index])
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

app.get('/search', async (req, res) => {
  const phrase = req.query.phrase;
  const exact = req.query.exactExpression;
  const exact_boolean = exact === "true" ? true : false;
  const results = await search(phrase, exact_boolean);
  res.json(results);
});

//BuildPhrases
async function buildPhrases(locationsToGo, download) {
  let listOfQuotes = [];
  let finalLocations = {}
    for (const [key, value] of locationsToGo) {
      finalLocations[key]?
        finalLocations[key].push(value)
        : finalLocations[key] = [value];
      }
    try {
        await prisma.$connect();
        for (const speechId in finalLocations) {
            let idNumber= parseInt(speechId, 10)
            const file = await prisma.newfile.findUnique({
                where: { id: idNumber},
            });
            //Estas variables podría eliminarlas y utilizar directo el contenido de "file"
            const date = file.title.substring(0, 10).replace(/_/g, '/');
            const name = file.title.substring(11);
            const content = file.content;
            for (const index of finalLocations[speechId]) {
                let fullquote;
                if (index < context_size) {fullquote = content.substring(0, context_size*2).replace(/\n/g, '')}
                else if (index > content.length - context_size)  {fullquote = content.substring(content.length - (context_size*2) , content.length -1).replace(/\n/g, '')}
                else {fullquote = content.substring(index - context_size, index + context_size ).replace(/\n/g, '')};
                let phrase = download?
                    {
                    'id': listOfQuotes.length +1,
                    'date': date,
                    'name': name,
                    'text': fullquote,
                    }
                    :
                    {
                    'id': listOfQuotes.length +1,
                    'date': date,
                    'name': name,
                    'text': fullquote,
                    'website': "https://www.gob.mx/presidencia/"
                    }
                
                listOfQuotes.push(phrase)
            }
        }
    } catch (error) {
        console.error('El servidor no pudo acceder a los archivos:', error);
        }
        finally {
          await prisma.$disconnect();
        }
    return listOfQuotes
}
app.get('/build', async (req, res) => {
  try {
    const locations = JSON.parse(req.query.locations);
    const results = await buildPhrases(locations, req.query.download);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});