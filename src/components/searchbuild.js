import encode from './encode.js'

async function searchbuild(phrase) {
  try {
  const pass = encode();
  const url = `https://amlodice.vercel.app/api/searchnbuild?phrase=${encodeURIComponent(phrase)}&pass=${encodeURIComponent(pass)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    });
  
    if (response.ok) {
      const [locationOccurrences, phrasesToShow] = await response.json();
      return [locationOccurrences, phrasesToShow];
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

export default searchbuild;
