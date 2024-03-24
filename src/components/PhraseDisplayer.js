import "../style-sheets/PhraseDisplayer.css";
import { useState, useRef, useEffect } from "react";
import MarkText from "./MarkText.js";
import Download from "./Download.js";
import main_historial from '../main_historial.js';
import encode from './encode.js'

const PhraseDisplayer = ({mainCounter, locationOccurrences, phraseToFind}) => {
  const phrasesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef(null);
  const [phrasesToShow, setPhrasesToShow] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [finishedDownload, setFinishedDownload] = useState(false);
  let pagesNeeded = Math.ceil(mainCounter.reduce((acumulador, numero) => acumulador + numero, 0)/ phrasesPerPage);
  const [isLoading, setIsLoading] = useState(true);

  const handlePrevNext = (num) => {
    setIsLoading(true);
    document.getElementById("change-page").value = "";
    setCurrentPage(currentPage + num);
  };
 
  const handleKeyPress = (e) => {
     if (e.key === "Enter" && parseInt(inputRef.current.value, 10) !== currentPage) {
      const pageNumber = parseInt(inputRef.current.value, 10);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= pagesNeeded) {
        setCurrentPage(pageNumber);
        setIsLoading(true);
        document.getElementById("change-page").value = "";
      } else {
        alert(`Introduce un número entero entre 1 y ${pagesNeeded}`);
        document.getElementById("change-page").value = "";
      }
    }
  };

async function getThePhrases(locations) {
    try {
        const body = {
            locations: locations,
            download: false,
            pass: encode()
        };
        const response = await fetch('https://amlodice.vercel.app/api/builder', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
        if (response.ok) {
            return await response.json();
        } else {
          if (response.status === 400) {
              const errorData = await response.json();
              console.error(errorData.error, response.status);
              alert("Invalid request")
          } else {
              console.error('Error al llamar a la API:', response.status);
          }
        }
      }
      catch (error) { console.error('Error en la solicitud:', error);}
}

  useEffect(() => {
  async function fetchData() {
    let locationsToGo;
    if (currentPage !== pagesNeeded) {
      locationsToGo = locationOccurrences.slice(
        (currentPage - 1) * phrasesPerPage,
        currentPage * phrasesPerPage
      );
    } else {
      locationsToGo = locationOccurrences.slice(
        (currentPage - 1) * phrasesPerPage
      );
    }
    try {
      const result = await getThePhrases(locationsToGo);
      setPhrasesToShow(result);
      setIsLoading(false);
      } catch (error) {
        alert('Error al obtener frases. Por favor actualice la página', error);
        setIsLoading(false);
      }
  }
  fetchData();
  }, [currentPage]);

  const handleDownload = async () => {
    if (locationOccurrences.length<main_historial.limit_phrases) {
      try {
        setIsDownloading(true);
        await Download(locationOccurrences, mainCounter, phraseToFind);
      } catch (error) {
          console.error( error);
      } finally {
          setIsDownloading(false);
          setFinishedDownload(true);
      }
    }
    else {
      alert("Para evitar el consumo excesivo de recursos, se bloquean las descargas de términos con demasiadas menciones.")
    }
  }

  return (
  <div className="main-container" >
      <div className="top-bar">
        <p style={{marginLeft: '4px'}}> {"Mostrando página " + currentPage + "/" + pagesNeeded}
        </p>
        <div className="select-page" style={isDownloading && !finishedDownload? {pointerEvents: 'none', opacity:'0.7'} : {} }>
          <button className="prev-next" 
            style={currentPage === 1? {pointerEvents: 'none', opacity:'0.7'} :{} } 
            onClick={() => handlePrevNext(-1)}>
            &larr;
          </button>
          <button className="prev-next"
            style={currentPage === pagesNeeded? {pointerEvents: 'none', opacity:'0.7'} :{} }
            onClick={() => handlePrevNext(1)}>
            &rarr;
          </button>
          Ir a página:
            <input
              id="change-page"
              type="number"
              ref={inputRef}
              onKeyDown={handleKeyPress}
              min="1"
              max={pagesNeeded}
              />
        </div>
        {finishedDownload?
          (
          <button className="download-button" style={{pointerEvents:'none', opacity:'0.7'}}>
              Descargado
          </button>
          )
      :
        isDownloading?  
        (<button className="download-button" style={{pointerEvents:'none', opacity:'0.9'}}>
          <div className="downloading-effect"></div>
        </button>
        )
        :           
        (
          <button className="download-button"
          onClick={handleDownload}>
          Descargar todas
          </button>
          )        
      }
      </div>
      {isLoading? (
        <div id='phraseLoading'>
          <div className="circle"></div>
          <p>Cargando...</p>
        </div>
        )
        :
        (<>
          {
          phrasesToShow.map((element, index) => (
          <div  className="phrase-space"
                key={index}
                style={{ backgroundColor: element.id % 2 === 0 ? '#e0e0e0' : '' }}  >
            <div className="left-column">
              <p> #{ (currentPage-1)*phrasesPerPage + element.id} <br/>
                {element.date}  <br/>
                {element.name}
              </p>
            </div>
              <MarkText element={element.text} website={element.website} phraseToFind={phraseToFind}/>
          </div>
          ))
          }
          <div className="top-bar" style={{borderTop:'1px solid black'}}>
              <p style={{marginLeft: '4px'}}> {"Mostrando página " + currentPage + "/" + pagesNeeded}
              </p>
              <p>Menciones: {locationOccurrences.length}</p>
              <div className="select-page" style={isDownloading && !finishedDownload? {pointerEvents: 'none', opacity:'0.7'} : {} }>
                
               <button className="prev-next" 
                  style={currentPage === 1? {pointerEvents: 'none', opacity:'0.7'} :{} } 
                  onClick={() => handlePrevNext(-1)}>
                  &larr;
                </button>
                <button className="prev-next"
                  style={currentPage === pagesNeeded? {pointerEvents: 'none', opacity:'0.7'} :{} }
                  onClick={() => handlePrevNext(+1)}>
                  &rarr;
                </button>
                
              </div>
          </div>
        
        </>          
        )
      }
    </div>
  
  )
};

export default PhraseDisplayer;