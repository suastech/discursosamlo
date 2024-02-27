import fs from 'fs';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function uploadFile() {
  try {
    const routeFiles = './discursos2';
    const files = fs.readdirSync(routeFiles);

    for (const file of files) {
      if (file.endsWith('.txt')) {
        const fileName = file.split('.txt')[0];
        const content = fs.readFileSync(`${routeFiles}/${file}`, 'utf8');

        await prisma.newfile.create({
          data: {
            title: fileName,
            content: content,
          },
        });

        console.log(`File uploaded: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error when uploading the file:', error);
  } finally {
    await prisma.$disconnect();
  }
}

uploadFile();
