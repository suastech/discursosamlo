import { saveAs } from 'file-saver';
import axios from 'axios';

async function Download(locationOccurrences, mainCounter, origin, phraseToFind) {
  const projectName = "El discurso presidencial";
  if (origin === true) {
    const response = await axios.get(`https://discursosamlo.s3.us-east-2.amazonaws.com/historial/frases/Informe+del+t%C3%A9rmino+${phraseToFind}%2C+Discursos+presidenciales.txt`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Informe del término ${phraseToFind}, ${projectName}.txt`);
  }
  else {
    try {
      const response = await axios.get(`/build`, {
        params: {
          locations: JSON.stringify(locationOccurrences),
          download: true
        }
      }
      );
      const arrayOfPhrases = response.data
      if (arrayOfPhrases.length>0) {     
      let yearSummary = JSON.stringify(mainCounter).replace(/,/g, '\n').replace(/{|}|\[|\]|"/g, '').replace(/:/g, ': ')

      // Generate file content
      const header = `El discurso presidencial\n\nRepeticiones del término: ${phraseToFind}\nTotal:${locationOccurrences.length}\n\nDesglose anual:\n${yearSummary}\n\n`;
      const quotes = arrayOfPhrases.map(element => `#${element.id}. ${element.date} ${element.name}.\n...${element.text}...`).join('\n\n');
      const ending = `\n\n\n**********\nDiscursos presidenciales. Con información pública de https://presidencia.gob.mx/\nProgramación de este sitio: Jesús Suaste Cherizola.`
      const fullContent = `${header}${quotes}${ending}`

      // Download
      const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `Informe del término ${phraseToFind}, ${projectName}.txt`);
      }
    } catch (error) {
      alert('Falló la conexión al servidor. Por favor intenta nuevamente:', error);
    } }

}

export default Download;
