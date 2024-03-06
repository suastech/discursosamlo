import './App.css';
import Header from './components/Header.js';
import SearchField from './components/SearchField.js';
import SideBar from './components/SideBar.js';
import Footer from './components/Footer.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import close from './imagenes/closebutton.png';
import paypal from './imagenes/paypal.png';
import pseudo from './pseudohistorial.js';

function App() {
  const [displayChart, setDisplayChart] = useState(false);
  const [numOfSearch, setNumOfSearch] = useState(0);
  const [lastUpdate, setLastUpdate] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [isInfo, setIsInfo] = useState(false);
  const [isSupport, setIsSupport] = useState(false);
  const [isExtra, setIsExtra] = useState(false);
  const [isDownloadData, setIsDownloadData] = useState(false);
  const [externalHistorial, setExternalHistorial] = useState({});
  
  useEffect(() => {
    const fetchObject = async () => {
      try {
        //const response = await axios.get('https://discursosamlo.s3.us-east-2.amazonaws.com/historial/main_historial.json');
        //const response2 = await axios.get(process.env.HISTORIAL_JSON_URL);
        
        //console.log("De aws", response.data); 
        //console.log("De Vercel", response2.data);
        setQuantity(pseudo.quantity);//OJO: modificar a response.data 
        setLastUpdate(pseudo.last);
        setExternalHistorial(pseudo.list_of_words);
      } catch (error) {
        console.error(error);
      }
    };
    fetchObject();
  }, []);
  
  return (
  <div className='full-content'>
    <Header/>
    <div className='body-content'>

          <SideBar  isSupport={isSupport} setIsSupport={setIsSupport}
                    isInfo={isInfo} setIsInfo={setIsInfo}
                    isExtra={isExtra} setIsExtra={setIsExtra}
                    isDownloadData={isDownloadData} setIsDownloadData={setIsDownloadData}
                    numOfSearch={numOfSearch}
                    quantity={quantity} lastUpdate={lastUpdate}
          />
          <SearchField displayChart={displayChart} setDisplayChart={setDisplayChart}
                    numOfSearch={numOfSearch} setNumOfSearch={setNumOfSearch}
                    lastUpdate={lastUpdate} quantity={quantity}
                    setIsSupport={setIsSupport} setIsInfo={setIsInfo} setIsExtra={setIsExtra}
                    externalHistorial={externalHistorial}
                    />

          {numOfSearch !== 0 && numOfSearch%4 === 0? 
            <div id='ask-support'>
              <img id='closeButton' style={{height: '50px'}} onClick={() => setNumOfSearch(0)} 
                        src={close} alt='close'/>
                  <p>Este buscador es una herramienta de apoyo para académicos, estudiantes, periodistas y ciudadanos interesados en el análisis del discurso.</p>
                  <p>Si te resulta útil, puedes apoyar con un donativo a través de PayPal.</p>
                  <div className='donateImages'>
                  <a href="https://www.paypal.com/donate/?hosted_button_id=FJZLMWAHT6QFC" rel='noreferrer' target="_blank">
                  <img src={paypal} alt='paypal' className='paypal' style={{width: '400px'}}/></a>  
                  </div>
            </div>
            : null
          }
    </div>
    <Footer/>
  </div>
  );
}

export default App;