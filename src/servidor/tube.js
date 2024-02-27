import axios from 'axios';

const apiKey = 'AIzaSyDAxr105yD51msIM-HUUVcWnhvPGSOf2U0';
const playlistId = 'PLRnlRGar-_296KTsVL0R6MEbpwJzD8ppA';
//const videoId= 'UExSbmxSR2FyLV8yOTZLVHNWTDBSNk1FYnB3SnpEOHBwQS43MUYwREI2M0UxQkIzNkUw';

async function getVideoInfo(videoId) {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        id: videoId,
        key: apiKey,
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      const videoInfo = response.data.items[0].snippet;
      console.log('Información del Video:');
      console.log(`Título: ${videoInfo.title}`);
      console.log(`Descripción: ${videoInfo.description}`);
      console.log(`Fecha de Publicación: ${videoInfo.publishedAt}`);
      console.log(`Thumbnail: ${videoInfo.thumbnails.default.url}`);
    } else {
      console.log(`No se encontró información para el video con ID: ${videoId}`);
    }
  } catch (error) {
    console.error('Error al obtener información del video:', error.message);
  }
}


axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
  params: {
    part: 'snippet',
    playlistId: playlistId,
    key: apiKey,
    maxResults: 10,
  },
})
  .then(async (response) => {
    const videos = response.data.items.map(async (item) => {
      const title = item.snippet.title;
      const videoId = item.snippet.resourceId.videoId;
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const uploadDate = item.snippet.publishedAt;

      // Utilizar la función getVideoInfo para obtener información detallada del video
      await getVideoInfo(videoId);

      return [title, url, uploadDate];
    });

    // Esperar a que todas las promesas se resuelvan antes de imprimir la información
    const videoDetails = await Promise.all(videos);
    console.log("Archivo completo:", videoDetails);
  })
  .catch((error) => {
    // Manejar errores
    console.error(error);
  });


 
  