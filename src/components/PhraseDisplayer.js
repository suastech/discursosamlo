import "../style-sheets/PhraseDisplayer.css";
import { useState, useRef, useEffect } from "react";
import MarkText from "./MarkText.js";
import Download from "./Download.js";
import axios from 'axios';

const PhraseDisplayer = ({mainCounter, locationOccurrences, phraseToFind, exactExpression, historial, setHistorial, setLocationOccurrences}) => {
  const phrasesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef(null);
  const [phrasesToShow, setPhrasesToShow] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [finishedDownload, setFinishedDownload] = useState(false);
  let pagesNeeded = Math.ceil(historial[phraseToFind].number / phrasesPerPage);
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

  async function getThePhrases(temporary_locations) {
    const proxy_location = temporary_locations === null? locationOccurrences : temporary_locations;
    let locationsToGo;
    if (currentPage !== pagesNeeded) {
      locationsToGo = proxy_location.slice(
        (currentPage - 1) * phrasesPerPage,
        currentPage * phrasesPerPage
      );
    } else {
      locationsToGo = proxy_location.slice(
        (currentPage - 1) * phrasesPerPage
      );
    }
    const response = await axios.get('/build', {
        params: {
          locations: JSON.stringify(locationsToGo),
          download: false
        }
      });
      return response.data;
  }
 
  const handleDownload = async () => {
    if (locationOccurrences.length<4100) {
      try {
        setIsDownloading(true);
        await Download(locationOccurrences, mainCounter, historial[phraseToFind].origin, phraseToFind);
      } catch (error) {
          console.error( error);
      } finally {
          setIsDownloading(false);
          setFinishedDownload(true);
      }
    }
    else {
      alert("Para evitar el consumo excesivo de recursos, se bloquean las descargas de términos con demasiadas menciones. Si usted considera que la obtención de dicha compilación es indispensable para una investigación destinada a revolucionar nuestra comprensión del país, el mundo o la historia universal, puede contactar al programador para que se la envíe.")
    }
  }

  useEffect(() => {
    async function fetchData() {
      let temporary_locations = null;
      if (historial[phraseToFind].locations === true) {
       try
       {const response = await axios.get(`https://discursosamlo.s3.us-east-2.amazonaws.com/historial/locations/${phraseToFind}.json`) 
        const newLocations = response.data
       setHistorial(prevHistorial => ({
          ...prevHistorial,
          [phraseToFind]: {
            ...prevHistorial[phraseToFind], 
              locations: newLocations}
        }));
        setLocationOccurrences(newLocations);
        temporary_locations = newLocations;
      } catch (error) {
        console.error('Error al obtener los datos del servidor', error)
      }
      }
        try {
          const result = await getThePhrases(temporary_locations);
          setPhrasesToShow(result !== undefined ? result : []);
          setIsLoading(false);
        } catch (error) {
          console.error('Error al obtener frases. Por favor actualice la página', error);
          setIsLoading(false);
        }
    }
  fetchData();
  }, [currentPage]);

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
              <MarkText element={element.text} website={element.website} phraseToFind={phraseToFind} exactExpression={exactExpression}/>
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