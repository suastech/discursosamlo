import axios from 'axios';

const apiKey = 'AIzaSyDAxr105yD51msIM-HUUVcWnhvPGSOf2U0';
const videoId= 'UIwqE3eBEos'
const captionsId= 'AUieDaYcV_mXPMPMe-Uu1O8bw6EURvgQWKsqrzjbBfMCr76Z8RA'

async function getTranscriptionInfo() {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/captions/id', {
      params: {
        id: captionsId,
      },
    });   
    console.log(response)
    }
  catch (error) {
    console.error('Error al obtener información de transcripciones:', error.message);
  }
}

getTranscriptionInfo(videoId);