import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const context_size = 150;

async function builder(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    let { locations, phrase, download } = req.body;   
//Build
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
              const link = file.link;
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
                      'website': link
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

//Search and Build
async function searchAndBuild(phrase) {
let files;
let location_occurrences = [];
let listOfQuotes = [];
  try {
    files = await prisma.newfile.findMany({ where: { content: { contains: phrase,},},
    });
    let expression = new RegExp(`\\b${phrase}\\b`, "gi");
    for (const file of files) {
    let match;
    while ((match = expression.exec(file.content.toLowerCase())) !== null) {
      location_occurrences.unshift([file.id, match.index]);
    }}
//Construcción de frases
  let locationsToGo= location_occurrences.length<=10? location_occurrences: location_occurrences.slice(0, 10)
  let finalLocations = {}
    for (const [key, value] of locationsToGo) {
    finalLocations[key]?
    finalLocations[key].push(value)
    : finalLocations[key] = [value];
    }
    for (const speechId in finalLocations) {
        const idNumber = parseInt(speechId, 10);
        const file = files.find(f => f.id === idNumber);
        const date = file.title.substring(0, 10).replace(/_/g, '/');
        const name = file.title.substring(11);
        const content = file.content;
        const link = file.link;
        for (const index of finalLocations[speechId]) {
            let fullquote;
            if (index < context_size) {fullquote = content.substring(0, context_size*2).replace(/\n/g, '')}
            else if (index > content.length - context_size)  {fullquote = content.substring(content.length - (context_size*2) , content.length -1).replace(/\n/g, '')}
            else {fullquote = content.substring(index - context_size, index + context_size ).replace(/\n/g, '')};
            phrase = 
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

} catch (error) {
    console.error("No se pudo acceder a la base de datos", error);
    return;
  } finally {
    await prisma.$disconnect();
  }
  console.log("F:",files.length)
  return [listOfQuotes, location_occurrences];
}

if (locations === true) {
    const response = await searchAndBuild(phrase)
    console.log("RespS&B", response[0].length, response[1].length)
    res.json(response)
    return
} else {
    const response = await buildPhrases(locations,download)
    res.json(response)
    return
    }
};


export default builder;