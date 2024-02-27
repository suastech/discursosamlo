import { PrismaClient } from '@prisma/client'

function Prueba() {

 const prisma = new PrismaClient()

  async function main() {

      const allUsers = await prisma.newfile.findMany()
      allUsers.forEach( (file: any) => {
          console.log("se pide información a Render")
          console.log(file)
        })
  }

  main()
    .then(async () => {
      console.log("se llama a main")
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })

}

export default Prueba;