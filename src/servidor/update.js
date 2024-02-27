//Problema con el require

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const last_date = new Date('2023-09-03');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
  let exit = false;
  let index = 1;
  while (exit === false) {

      await page.goto(`https://www.gob.mx/presidencia/archivo/articulos?order=DESC&page=${index}`);
      const articles = await page.$$('#prensa article');
      const links = [];
      console.log("Entrando al link con index:", index)

      for (const article of articles) {
        const date_article = await article.$eval('time', element => element.getAttribute('date'));
        const fixed_date = new Date(date_article.slice(0, 10));
        if (fixed_date > last_date) {
          const file_date = fixed_date.toISOString().slice(0, 10).replace(/-/g, '_');
          const h2Element = await article.$('h2');
          let file_name = await page.evaluate(h2Element => h2Element.textContent, h2Element);
          let file_to_save = '';
          if (file_name.includes('Conferencia de prensa del presidente')) {
            file_to_save = 'Conferencia matutina';
          } else {
            file_to_save = file_name.slice(23);
          }
          const articleLinkElement = await article.$('a');
          const articleLink = await page.evaluate(articleLinkElement => articleLinkElement.href, articleLinkElement);
          const fileName = `${file_date}_${file_to_save}.txt`;

          links.push([articleLink, fileName])
        }
      }

      if (links.length === 0) {
        console.log(`Cero coincidencias en: https://www.gob.mx/presidencia/archivo/articulos?order=DESC&page=${index}`)
        exit = true; }
      else {
        console.log(`Artículos a recuperar en https://www.gob.mx/presidencia/archivo/articulos?order=DESC&page=${index}: ${links.length}`)
        index ++;
        for (const link of links) {
          await page.goto(link[0]);
          const articleBody = await page.$('.article-body');
        
          if (articleBody) {
            const articleText = await page.evaluate(articleBody => {
              const paragraphs = Array.from(articleBody.querySelectorAll('p'));
              return paragraphs.map(p => p.textContent).join('\n');
            }, articleBody);
            
            let contenido_final= articleText.replace(/\s+/g, ' ').replace(/\r/g, ' ').replace(/\n/g, ' ').replace('---','');
            
            console.log("Se guardaría el archivo:", link[1]);
            
            const filePath = path.join(__dirname, 'discursos', link[1]);
            console.log("Guardando:", link[1])
            fs.writeFileSync(filePath, contenido_final);

        } else {
          console.log("No se encontró un contenedor '.article-body'");
        }
      }
      }
   }
  } catch (error) {
    console.error('Ocurrió un error:', error);
  } finally {
    console.log("Revisión terminada")
    await browser.close();
  }
})();