//import axios from 'axios';

async function Finder(phrase) {
  try {
   
    const url = `https://discursosamlo.vercel.app/api/newsearch?phrase=${encodeURIComponent(phrase)}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
       'Content-Type': 'application/json',
      },
      });
      if (response.ok) {
        const [locationOccurrences, mainCounter] = await response.json();
        return [locationOccurrences, mainCounter]
    }
    else {console.error('Error al llamar a la API:', response.status); }
    } catch (error) { console.error('Error en la solicitud:', error);}
}

export default Finder;
