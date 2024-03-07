//import axios from 'axios';
import server_function from '../database obsoleto/server_function.js';

async function Finder(phrase) {
  try {
    const response = await server_function(phrase)
    /*const response = await axios.get('http://localhost:3000/api/newsearch', {
      params: {
        phrase: phrase
      }
    });*/
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return [ [[1,1]], [3,4,5,6,7,8,9] ];
  }
}

export default Finder;
