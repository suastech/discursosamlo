import axios from 'axios';

async function Finder(phrase) {
  try {
    const response = await axios.get('/api/newsearch',{
      params: {
        phrase: phrase
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return [ [[1,1]], [3,4,5,6,7,8,9] ];
  }
}

export default Finder;
