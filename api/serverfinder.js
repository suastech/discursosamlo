import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function serverfinder(req,res) {
  console.log("llegó la llamada a serverfunction con...")
  
  try {
  const allUsers = await prisma.newfile.findMany()
  for (let archivo of allUsers) {
    console.log(archivo.id, archivo.title)
  }

  res.json(allUsers)

  /*
  const phrase = req.query.phrase;
  let location_occurrences = [];
  let main_counter = {
    "2018": 0, "2019": 0, "2020": 0, "2021": 0, "2022": 0, "2023": 0, "2024": 0,
  };

  try {
    const files = await prisma.newfile.findMany({
      where: {
        content: {
          contains: phrase,
        },
      },
    });

    // Buscar SIEMPRE coincidencia exacta
    let expression = new RegExp(`\\b${phrase}\\b`, 'gi');
    for (const file of files) {
      let match;
      while ((match = expression.exec(file.content.toLowerCase())) !== null) {
        main_counter[file.title.substring(0, 4)] += 1;
        location_occurrences.push([file.id, match.index]);
      }
    }

    main_counter = Object.values(main_counter); // Así convierto el objeto en un array
    res.json([location_occurrences, main_counter]); 
    */

  } catch (error) {
    console.error('No se pudo acceder a la carpeta:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  } finally {
    await prisma.$disconnect();
  }
}

export default serverfinder;