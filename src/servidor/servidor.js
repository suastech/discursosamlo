import { PrismaClient } from '@prisma/client'
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
const prisma = new PrismaClient()
const app = express();
const port = 4000;
const spaceId = process.env.SPACE_ID;
const accessToken = process.env.ACCESS_TOKEN;
const entryId = process.env.ENTRY_ID;
let external_history;
let internal_history= {};
let server_or_historial = '';

axios.get(`https://cdn.contentful.com/spaces/${spaceId}/entries/${entryId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        })
        .then(response => {
          external_history=response.data.fields.listOfWords;
        })
        .catch(error => {
          console.error('Error al obtener el external_history de Contentful:', error);
        })

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
          contains: phrase,
        },
      },
    });
    let expression = exact? new RegExp(`\\b${phrase}\\b`, "gi") : new RegExp(phrase,'gi')

    for (const file of files) {
      const year = file.title.substring(0, 4);
      const content = file.content;
      internal_history[file.id] = [file.title,file.content];          
      let match;
      while ((match = expression.exec(content)) !== null) {
        main_counter[year]+= 1;
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

async function buildPhrases(locationsToGo) {
  const context_size = 100;
  let listOfQuotes = [];
  if (server_or_historial === 'external_history' ) { 
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
            const date = file.title.substring(0, 10).replace(/_/g, '/');
            const name = file.title.substring(11);
            const content = file.content;

            for (const index of finalLocations[speechId]) {
                let fullquote;
                if (index < context_size) {fullquote = content.substring(0, context_size*2).replace(/\n/g, '')}
                else if (index > content.length - context_size)  {fullquote = content.substring(content.length - (context_size*2) , content.length -1).replace(/\n/g, '')}
                else {fullquote = content.substring(index - context_size, index + context_size ).replace(/\n/g, '')};
                let phrase = {
                    'id': listOfQuotes.length +1,
                    'date': date,
                    'name': name,
                    'text': fullquote
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
  else {
    for (let location of locationsToGo) {
      const date = internal_history[location[0]][0].substring(0, 10).replace(/_/g, '/');
      const name = internal_history[location[0]][0].substring(11);
      let fullquote;
      if (location[1]< context_size) {fullquote = internal_history[location[0]][1].substring(0, context_size*2).replace(/\n/g, '')}
      else if (location[1]> internal_history[location[0]][1].length - context_size)  {fullquote = internal_history[location[0]][1].substring(internal_history[location[0]][1].length - (context_size*2) , internal_history[location[0]][1].length -1).replace(/\n/g, '')}
      else {fullquote = internal_history[location[0]][1].substring(location[1]- context_size, location[1]+ context_size ).replace(/\n/g, '')};
      let phrase = {
          'id': listOfQuotes.length +1,
          'date': date,
          'name': name,
          'text': fullquote
          };
      listOfQuotes.push(phrase);
    }
    return listOfQuotes;
  }
}

async function initialData() {  
  const lastFile = await prisma.newfile.findFirst({
    orderBy: {
      id: 'desc'
      },
    select: {
      id: true,
      title: true
    }
  });
  return [lastFile.title.substring(0, 10).replace(/_/g, '/'), lastFile.id]    
}

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/initialData', async (req, res) => {
  console.log("Solicitud de información inicial")
  const results = await initialData();
  res.json(results);
});

app.get('/search', async (req, res) => {
    const phrase = req.query.phrase;
    const exact = req.query.exactExpression;
    const exact_boolean = exact === "true" ? true : false;

          for (const word in external_history) {
              if (word.toLowerCase() === phrase.toLowerCase())
                {
                const results = external_history[word];
                last_search_locations = external_history[word][0];
                server_or_historial = 'external_history';
                return res.json(results);
                }
          }
          const results = await search(phrase, exact_boolean);
          server_or_historial = 'server';
          res.json(results);
    });

app.get('/build', async (req, res) => {
    try {
      const locations = JSON.parse(req.query.locations);
      const results = await buildPhrases(locations);
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  });

app.get('/download', async (req, res) => {
  try {
    const locations = JSON.parse(req.query.locations);
    const results = await buildPhrases(locations);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

  app.listen(port, async () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });