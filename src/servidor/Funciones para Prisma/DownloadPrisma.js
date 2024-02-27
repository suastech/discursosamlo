import { saveAs } from 'file-saver';
import PhraseBuilder from "./PhraseBuilder";
import { pseudoArray } from './PseudoArrayToPrint';

function Download(locationOccurrences, mainCounter, phraseToFind, lastDownload, setLastDownload) {
  
  const projectName = "El discurso presidencial";
  let arrayOfPhrases = [];

  if (lastDownload[0] === phraseToFind) {
    arrayOfPhrases = lastDownload[1];
  } else {
    let newResult = [phraseToFind, arrayOfPhrases];
    setLastDownload(newResult);
    arrayOfPhrases = PhraseBuilder(locationOccurrences);
  }

  let monthSummary = JSON.stringify(mainCounter).replace(/],/g, '\n').replace(/{|}|\[|\]|"/g, '').replace(/:/g, ': ')
  let yearSummary = {};
    for (const year in mainCounter) {
     const sum = mainCounter[year].reduce((total, value) => total + value, 0);
    yearSummary[year] = sum;
    }
  yearSummary= JSON.stringify(yearSummary).replace(/,/g,'\n').replace(/{|}|\[|\]|"/g, '').replace(/:/g, ': ')
  
  //Generate file content: 
  const header= `Menciones del término: ${phraseToFind}\nTotal:${locationOccurrences.length}\n\nDesglose anual:\n${yearSummary}\n\nDesglose mensual:\n${monthSummary}\n\n`;
  const quotes = arrayOfPhrases.map( element => 
    `#${element.id}. ${element.date} ${element.name}.\n...${element.text}...`).join('\n\n');
  const ending = `\n\n\n***Discursos presidenciales. Archivo del discurso populista. Con información pública de https://presidencia.gob.mx/\nDiscursos pronunciados entre el 4/12/2018 y el 7/07/2023.\nProgramación de este sitio: Jesús Suaste.`
  const fullContent= `${header}${quotes}${ending}`
  
  //Download
  const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
  try {
    saveAs(blob, `Informe del término ${phraseToFind}, ${projectName}.txt`);
  } catch (error) {
    alert('Error al descargar el informe: ' + error.message);
  }
}

export default Download;