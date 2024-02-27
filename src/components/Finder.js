import axios from 'axios';

async function Finder(phrase, exactExpression) {
  try {
    const response = await axios.get(`/search?phrase=${phrase}&exactExpression=${exactExpression}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default Finder;