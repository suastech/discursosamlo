import axios from 'axios';

async function Finder(phrase) {
  try {
    const response = await axios.get(`https://3.144.45.205:3000/search?phrase=${phrase}`);
    /*const response = await axios.get('https://discursosamlo.vercel.app/api/serverfinder', {
      params: {
        phrase: phrase
      }
    });*/
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error al invocar la función:', error);
    // Puedes manejar errores específicos aquí
    throw error;
  }
}

export default Finder;
