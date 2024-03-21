import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const context_size = 150;

async function builder(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://amlodice.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    let { locations, download } = req.body;   

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

const response = await buildPhrases(locations,download)
res.json(response)
return

};


export default builder;