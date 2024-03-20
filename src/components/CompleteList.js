import '../style-sheets/CompleteList.css'
import { useState } from 'react';
import close from '../imagenes/closebutton.png';
import main_historial from '../main_historial.js';

function CompleteList (props) {
  const {changeOrigin, arrayOfWords, setArrayOfWords, handleSearch, origin, apagador} = props 
  const palabras = Object.keys(main_historial.list_of_words)
  const [filtro, setFiltro] = useState('');
  
  const handleClose = () => {
    apagador(false)
  }

  const handleSelection = (value) => {
  if (origin === true) {
    apagador(false)
    handleSearch(value)
    }
  else {  
      let updateValue = [...arrayOfWords]
      updateValue[changeOrigin] = value;
      setArrayOfWords(updateValue)
      apagador(false);
      }
  }

  const filtrarPalabras = () => {
    const filtroNormalizado = filtro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliza a minúsculas y quita acentos
    return palabras.filter(word =>
      word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filtroNormalizado)
    );
  };

  return (
  <div id='back-table'>  
    <div id='main-table'>
      <img src={close} alt='close' onClick={()=>handleClose()}
          style={{position: 'absolute', margin:'25px 0px 0 20px', width:'30px', cursor:'pointer'}} />
      <input
        type="text"
        id='search-frequent'
        placeholder="Busca un término frecuente..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <div className='words-container'>
        <div className='words-wrapper'>
          {filtro.length >= 2 ? (
            filtrarPalabras().map((word, index) => (
              <p className='item-word' key={index} onClick={()=> handleSelection(word)}>{word}</p>
            ))
          ) : (
            palabras.map((word, index) => (
              <p className='item-word' key={index} onClick={()=> handleSelection(word)}>{word}</p>
            ))
          )}
  
        </div>

      </div> 
   
    </div>
  </div>
)
}

export default CompleteList;