import React, { useState, useRef } from 'react';
import ChartMaker from './ChartMaker.js';
import '../style-sheets/SearchField.css';
import Finder from './Finder.js';
import Graphs from './Graphs.js';
import WaitingBoxes from './WaitingBoxes.js';
import CompleteList from './CompleteList.js';
import close from '../imagenes/closebutton.png';

const SearchField = (props) => {
  const {displayChart, setDisplayChart, numOfSearch, setNumOfSearch, setIsInfo, setIsSupport, setIsExtra, externalHistorial} = props;
  const [phraseToFind, setPhraseToFind] = useState("");
  const [mainCounter, setMainCounter] = useState({});
  const [locationOccurrences, setLocationOccurrences] = useState([]);
  const inputRef = useRef(null);
  const [displayPhrases, setDisplayPhrases] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [exactExpression, setExactExpression] = useState(false);
  const [historial, setHistorial] = useState({});
  const [optionHistorial, setOptionHistorial] = useState('Historial');
  const [isFrecuent, setIsFrecuent] = useState(false);
  const [isGraphs, setIsGraphs] = useState(false);
  const [welcome, setWelcome] = useState(true);

  const exepciones = ['Fox'];
  
  const externalList = Object.keys(externalHistorial);

  const handleInput = (event) => {
    const inputValue = event.target.value;
    const sanitizedValue = inputValue.replace(/['"]/g, ''); // Eliminar comillas simples y dobles
    event.target.value = sanitizedValue;
  };
  
const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    handleSearch(inputRef.current.value, exactExpression);
    }
  };

function display_results(number) {
      if (number > 0) {
           setIsLoading(false)
      } else { 
          setDisplayChart(false)
          setIsLoading(false)
          document.getElementById("searchField").value = "";
        alert("Ninguna coincidencia encontrada");
      }
    }

async function launchsearch(phrase, exact) {
    const key = exact? `'${phrase}'`: phrase;
    //Menu buttons
    setIsInfo(false);
    setIsSupport(false);
    setIsExtra(false);
    setIsFrecuent(false);
    setIsGraphs(false);

    //States
    setExactExpression(false);

    setPhraseToFind(key);
    setDisplayPhrases(false);
    setIsLoading(true);
    setDisplayChart(true);
    
    console.log("valor de locationOccurrences", locationOccurrences)
    
   if (historial[key]) {
      //La respuesta sale desde el historial:
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLocationOccurrences(historial[key].locations);
      setMainCounter(historial[key].counter);
      display_results(historial[key].number)
    }
    else  {
      let newLocationOccurrences;
      let newMainCounter;  
      let origin= false;
      let go_to_external = false;
      for (let i = 0; i < externalList.length; i++) {
        if (key === externalList[i]) {
          go_to_external = true;
          break;
          }
      }
     if (go_to_external === true) {
        try {
          //console.log("Búsqueda de servidor externo")
          //await new Promise(resolve => setTimeout(resolve, 2000));
          //console.log("funciona la pausa?")
          newLocationOccurrences = true;
          newMainCounter= externalHistorial[key].counter;
          /* Si cambié el formato de los datos de historial a un array, aquí es donde debo reformatear: 
          newMainCounter =
              {
              "2018":externalHistorial[phrase][0],
              "2019": externalHistorial[phrase][1],
              "2020":externalHistorial[phrase][2],
              "2021":externalHistorial[phrase][3],
              "2022":externalHistorial[phrase][4],
              "2023":externalHistorial[phrase][5],
              "2024":externalHistorial[phrase][6]
              } */
          origin = true;
        } catch (error) {
          console.error("Error obteniendo información de externo", error);
        }
     } else {
         try {
          [newLocationOccurrences, newMainCounter] = await Finder(phrase, exact);
          } catch (error) {
                console.error('Finder regresa sin información', error);
                alert("Falló la conexión con el servidor");
                setDisplayChart(false);
                setIsLoading(false);
          }
       }
      if (newLocationOccurrences === undefined) newLocationOccurrences= [];
      if (newMainCounter === undefined) newMainCounter= {};
      setLocationOccurrences(newLocationOccurrences);
      setMainCounter(newMainCounter);
      const number = Object.values(newMainCounter).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      //Add information to the historial
      setHistorial(prevHistorial => ({
          ...prevHistorial,[key]: {
            locations: newLocationOccurrences,
            counter: newMainCounter,
            number: number,
            exact: exact,
            origin: origin
          }
          }));
      display_results(number);
  }
  }

const handleSearch = (phrase, exact) => {
    let allow = false;
    for (let i = 0; i < exepciones.length; i++) {
      if (phrase === exepciones[i]) {
        allow = true;
        break;
      }
    }
    if (  (phrase.length > 3 || allow === true) &&
          !(phrase.length === 4 && phrase.includes(" ")) &&
          !((phrase.length === 5 && (phrase.split(" ").length - 1) === 2))
          ){
            setDisplayChart(false)
            setNumOfSearch(numOfSearch + 1); 
            launchsearch(phrase, exact)
          }
      else {
      alert("Introduce al menos tres caracteres.\nEl buscador también bloquea la solicitud de algunos artículos o preposiciones como 'las', 'los' o 'del' etc.");
      document.getElementById("searchField").value = "";
      }
  };

  const handleHistorial = (event) => {
    setDisplayChart(false)
    setOptionHistorial("Historial");
    const word = historial[event.target.value].exact?
      event.target.value.substring(1, event.target.value.length - 1)
        :
      event.target.value;
    setPhraseToFind(word); //Revisar si no explota 
    launchsearch(word, historial[event.target.value].exact);
  };

return (
  <>
   {isFrecuent? <CompleteList handleSearch={handleSearch} origin={true} apagador={setIsFrecuent}/>:null      }
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
              title="Introduce al menos tres caracteres"
            />
            <button className='searchButton'
                onClick={() => handleSearch(inputRef.current.value, exactExpression)} disabled={isLoading || isGraphs} style={isLoading? {marginLeft:"3px", cursor:"not-allowed"} : {marginLeft:"3px" }}>
                Buscar
            </button>
          </div>
            
          <div style={{marginTop: '15px'}}>
            <label>
              <input type="checkbox"
                     checked={exactExpression}
                     onChange={() => setExactExpression(!exactExpression)} />
            </label>
            <label id="exactWordLabel" htmlFor="exactWord"> Palabra completa</label>
          
            <select id="historialDropdown"
                    value={optionHistorial}
                    onChange={handleHistorial}
                    disabled={Object.keys(historial).length < 1 || isLoading || isGraphs}
                    >
              <option value="Historial" disabled>Historial</option>
                {Object.keys(historial).map((propertyName) => (
                  <option key={propertyName} value={propertyName}>{`${propertyName} (${historial[propertyName].number})`}</option>
                ))}
            </select>
          </div>

          <div>
           <div className='frecuent-graphs' style={{ display: 'inline-flex', paddingRight:'40px'}} onClick={() =>{if(!isLoading) {setIsFrecuent(true)}}}>Más buscado...</div>
           <div className='frecuent-graphs' style={{ display: 'inline-flex'}} onClick={() => {if(!isLoading) {setIsGraphs(true); setIsFrecuent(false); setDisplayChart(false)}}}>Comparativos</div>
          </div>
        
      </div>

      {welcome && numOfSearch < 1 ?
       <div id='welcome-message'>
        <img id='closeButton' onClick={() => setWelcome(false)} 
        src={close} alt='close'/>
          <p>¡Bienvenid@!</p>
          <p>Esta herramienta encuentra palabras y frases pronunciadas por el presidente de México en sus conferencias de prensa y actos públicos.</p>
          <p>Para saber más sobre el funcionamiento del buscador puedes hacer click en el ícono de <span style={{color:'blue', textDecoration:'underline', cursor:'pointer'}} onClick={()=> {setWelcome(false); setIsInfo(true)}} >Información</span>.</p>
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
                exactExpression={exactExpression}
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