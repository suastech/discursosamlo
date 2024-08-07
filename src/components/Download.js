import { saveAs } from 'file-saver';
import encode from './encode.js'


async function Download(locationOccurrences, mainCounter, phraseToFind) {
  const projectName = "Amlo dice.";

  try {
      const body = {
          locations: locationOccurrences,
          phrase: phraseToFind,
          download: true,
          pass: encode()
      };
      const response = await fetch('https://amlodice.vercel.app/api/builder', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(body)
      });

      if (response.ok) {
      const arrayOfPhrases = await response.json();
      if (arrayOfPhrases.length>0) {     
      let yearSummary = `${mainCounter.map((year, index) => `${2018 + index}: ${year}`
      ).join('\n')}\n\n`;

      // Generate file content
      const header = `Repeticiones del término: ${phraseToFind}\nTotal:${locationOccurrences.length}\n\nDesglose anual:\n${yearSummary}\n\n`;
      const quotes = arrayOfPhrases.map(element => `#${element.id}. ${element.date} ${element.name}.\n...${element.text}...`).join('\n\n');
      const ending = `\n\n\n**********\nAmlo dice. Herramienta para el análisis del discurso\namlodice.vercel.app\nCon información pública de presidencia.gob.mx y lopezobrador.org.mx\nProgramación y diseño : Jesús Suaste Cherizola.`
      const fullContent = `${header}${quotes}${ending}`

      // Download
      const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `Informe del término ${phraseToFind}, ${projectName}.txt`);
      }
      }
      else {
        if (response.status === 400) {
            const errorData = await response.json();
            console.error(errorData.error, response.status);
            alert("Invalid request")

        } else {
            console.error('Error al llamar a la API:', response.status);
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      }
     
  }



export default Download;
