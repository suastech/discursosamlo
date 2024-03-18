//import axios from 'axios';

async function Finder(phrase) {
  try {
    //const response = await axios.get(`http://3.144.45.205:3000/search?phrase=${phrase}`);
    /*const response = await axios.get('https://discursosamlo.vercel.app/api/serverfinder', {
      params: {
        phrase: phrase
      }
    });*/
    const url = `https://discursosamlo.vercel.app/api/newsearch?phrase=${encodeURIComponent(phrase)}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
       'Content-Type': 'application/json',
      },
      });
      if (response.ok) {
        const [locationOccurrences, mainCounter] = await response.json();
        console.log('Datos de ubicaciones:', locationOccurrences);
        console.log('Contador principal:', mainCounter);
        return [locationOccurrences, mainCounter]

    }
    else {console.error('Error al llamar a la API:', response.status); }
    } catch (error) { console.error('Error en la solicitud:', error);}
}

export default Finder;
