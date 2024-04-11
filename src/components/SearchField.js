import React, { useState, useRef } from 'react';
import ChartMaker from './ChartMaker.js';
import '../style-sheets/SearchField.css';
import Finder from './Finder.js';
import Graphs from './Graphs.js';
import WaitingBoxes from './WaitingBoxes.js';
import CompleteList from './CompleteList.js';
import close from '../imagenes/closebutton.png';
import forbidden from '../forbidden.js';
import main_historial from '../main_historial.js';

const SearchField = (props) => {
  const {displayChart, setDisplayChart, numOfSearch, setNumOfSearch, setIsInfo, setIsSupport, setIsExtra} = props;
  const [phraseToFind, setPhraseToFind] = useState("");
  const [mainCounter, setMainCounter] = useState({});
  const [locationOccurrences, setLocationOccurrences] = useState([]);
  const inputRef = useRef(null);
  const [displayPhrases, setDisplayPhrases] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [historial, setHistorial] = useState({});
  const [optionHistorial, setOptionHistorial] = useState('Historial');
  const [isFrecuent, setIsFrecuent] = useState(false);
  const [isGraphs, setIsGraphs] = useState(false);
  const [welcome, setWelcome] = useState(true);
  const pause = 1000;
  const exepciones = ["fox", "ine", "pri", "pan"];
  const externalList = Object.keys(main_historial.list_of_words);

  const handleInput = (event) => {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/['"]/g, ''); // Eliminar comillas simples y dobles
    event.target.value = sanitizedValue;
  };
  
const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    handleSearch(inputRef.current.value);
    }
  };

function display_results(total) {
      if (total > 0) {
        setIsLoading(false);
      } else { 
          setDisplayChart(false)
          setIsLoading(false)
          alert("Ninguna coincidencia encontrada");
      }
    }

async function launchsearch(phrase) {
    setIsInfo(false);
    setIsSupport(false);
    setIsExtra(false);
    setIsFrecuent(false);
    setIsGraphs(false);

    //States
    setPhraseToFind(phrase);
    setDisplayPhrases(false);
    setIsLoading(true);
    setDisplayChart(true);
    document.getElementById("searchField").value = phrase;


   if (historial[phrase]) {
      await new Promise(resolve => setTimeout(resolve, pause));
      setLocationOccurrences(historial[phrase].locations);
      setMainCounter(historial[phrase].counter);
      display_results(historial[phrase].total)
    }
    else  {
      let newLocationOccurrences;
      let newMainCounter;  
      //Evaluar si la solicitud está en la lista externa
      if (externalList.includes(phrase)) {
        try {
          await new Promise(resolve => setTimeout(resolve, pause));
          newLocationOccurrences = main_historial.list_of_words[phrase].locations;
          newMainCounter= main_historial.list_of_words[phrase].counter;  
        } catch (error) {
          console.error("Error obteniendo información de externo", error);
        }
     } else {
         try {
          [newLocationOccurrences, newMainCounter] = await Finder(phrase);
          } catch (error) {
                console.error('Finder regresa sin información', error);
                alert("Falló la conexión con el servidor");
                setDisplayChart(false);
                setIsLoading(false);
          }
      }
      if (newLocationOccurrences === undefined || newLocationOccurrences === null) newLocationOccurrences= [];
      if (newMainCounter === undefined ||newLocationOccurrences === null) newMainCounter= {};
      setLocationOccurrences(newLocationOccurrences);
      setMainCounter(newMainCounter);
      const total = newMainCounter.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
     
      //Add information to the historial
      setHistorial(prevHistorial => ({
          ...prevHistorial,[phrase]: {
            locations: newLocationOccurrences,
            counter: newMainCounter,
            total: total,
          }
          }));
      display_results(total);
    }
}

const handleSearch = (phrase) => {
    phrase = phrase.trim().toLowerCase()
    if (forbidden.includes(phrase)) {
      alert("La búsqueda de esta palabra está restringida dado su gran número de repeticiones o porque no aporta información relevante");
    }
    else{
 
    if (  exepciones.includes(phrase) ||
          ( 
            phrase.length>3 && 
            !(phrase.length === 4 && phrase.includes(" "))   )
       )
        {
            setWelcome(false)
            setDisplayChart(false)
            setNumOfSearch(prev => prev + 1); 
            launchsearch(phrase)
          }
      else {
      alert("Introduce al menos cuatro caracteres sin contar espacios.");
      document.getElementById("searchField").value = "";
      }
    }
};

  const handleHistorial = (event) => {
    setDisplayChart(false)
    setOptionHistorial("Historial");
    const word = event.target.value;
    setPhraseToFind(word); //Revisar si no explota 
    launchsearch(word);
  };

return (
  <>  

   {isFrecuent? <CompleteList handleSearch={handleSearch} origin={true} apagador={setIsFrecuent}/>:null}
   
   {isGraphs?
      <Graphs setIsGraphs={setIsGraphs}/>
      :
      <> 
      <div className='search'>
         <div>
            <input
              className='input-styles'
              type="text"
              id="searchField"
              placeholder="Búsqueda"
              maxLength="30"
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onInput={handleInput}
              disabled={isLoading || isGraphs}
              title='Búsquedas temporalmente deshabilitadas. Puedes elegir un término de la lista de Frecuentes'
            />
            <button className='searchButton'
                onClick={() => handleSearch(inputRef.current.value)} disabled={isLoading} style={isLoading? {cursor:"not-allowed"} : {}}>
                Buscar
            </button>
          </div>
                    
          <select id="historialDropdown"
            value={optionHistorial}
            onChange={handleHistorial}
            disabled={Object.keys(historial).length < 1 || isLoading || isGraphs}
          >
            <option value="Historial" disabled>Historial</option>
              {Object.keys(historial).map((propertyName) => (
              <option key={propertyName} value={propertyName}>{`${propertyName} (${historial[propertyName].total})`}</option>
              ))}
          </select>
          

          <div>
           <div className='frecuent-graphs' style={{ display: 'inline-flex', paddingRight:'40px'}} onClick={() =>{if(!isLoading) {setIsFrecuent(true)}}}>Frecuentes</div>
           <div className='frecuent-graphs' style={{ display: 'inline-flex'}} onClick={() => {if(!isLoading) {setIsGraphs(true); setIsFrecuent(false); setDisplayChart(false)}}}>Comparativos</div>
          </div>
        
      </div>

      {welcome?
       <div id='welcome-message'>
        <img id='closeButton' onClick={() => setWelcome(false)} 
        src={close} alt='close'/>
          <p>¡Bienvenid@!</p>
          <p>Este buscador encuentra palabras o frases pronunciadas en las conferencias de prensa y actos públicos de la presidencia de México.</p>
          <p>Para saber más sobre el funcionamiento del buscador puedes hacer click en el ícono de <span style={{color:'blue', textDecoration:'underline', cursor:'pointer'}} onClick={()=> {setWelcome(false); setIsInfo(true)}} >Información</span> o visitar 
            <span style={{color:'blue', textDecoration:'underline', cursor:'pointer'}}><a href="https://github.com/suastech/infoDiscursosAmlo" rel='noreferrer' target="_blank"> este repositorio Github</a></span>.</p>
       </div>
       :
       null
      }

      {displayChart ? (
          isLoading ? (
            <WaitingBoxes/>
          )
          :
          (
          <>
              <ChartMaker
                mainCounter={mainCounter}
                locationOccurrences={locationOccurrences}
                setLocationOccurrences={setLocationOccurrences}
                phraseToFind={phraseToFind}
                setDisplayPhrases={setDisplayPhrases}
                setDisplayChart={setDisplayChart}
                displayPhrases={displayPhrases}
                historial={historial}
                setHistorial={setHistorial}
              />
          </>
          )
        ) : null}
      </>
    }
  </>
  );
};

export default SearchField;