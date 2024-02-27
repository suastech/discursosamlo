
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const array = [
    [ 6, 40532 ],  [ 11, 60004 ],
    [ 15, 6760 ],  [ 15, 24780 ],
    [ 15, 29818 ], [ 15, 42813 ],
    [ 15, 43312 ], [ 15, 43339 ],
    [ 15, 45406 ], [ 15, 45765 ],
    [ 15, 46412 ], [ 16, 35230 ],
    [ 16, 48174 ], [ 17, 88530 ],
    [ 17, 88754 ], [ 17, 88987 ],
    [ 17, 89026 ], [ 17, 89769 ],
    [ 17, 89799 ], [ 17, 90501 ],
    [ 17, 90532 ], [ 17, 90672 ],
    [ 18, 37623 ], [ 18, 40512 ],
    [ 18, 40537 ], [ 18, 48899 ],
    [ 18, 49350 ]
  ]
  
async function PhraseBuilder(locationsToGo) {
    
    const context_size = 300;
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
        console.error('No se pudo acceder a la carpeta:', error);
        }
        finally {
          await prisma.$disconnect();
        }
    return listOfQuotes
}

async function main() {
    const results = await PhraseBuilder(array);
    console.log('Resultados:', results);
}

main()