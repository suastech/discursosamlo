import encode from './encode.js'

async function Finder(phrase) {

  try {
  const pass = encode();
  const url = `https://amlodice.vercel.app/api/newsearch?phrase=${encodeURIComponent(phrase)}&pass=${encodeURIComponent(pass)}`;
  const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
});
      if (response.ok) {
        const [locationOccurrences, mainCounter, inf_deco] = await response.json();
        console.log(inf_deco)
        return [locationOccurrences, mainCounter]
    }
    else {console.error('Error al llamar a la API:', response.status); }
    } catch (error) { console.error('Error en la solicitud:', error);}
}

export default Finder;
