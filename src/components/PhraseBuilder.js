import axios from 'axios';

async function PhraseBuilder(locations) {
    try {
      const response = await axios.get('/build', {
        params: {
          locations: JSON.stringify(locations),
          download: false
        }
      });
      console.log("Respuesta en phraseBuilder", response.data);
      return response.data;
    } catch (error) {
      alert("Falló la conexión con el servidor. Por favor intenta nuevamente",error);
      return [];
    }
  }

export default PhraseBuilder;