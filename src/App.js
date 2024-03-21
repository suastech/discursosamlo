import './App.css';
import Header from './components/Header.js';
import SearchField from './components/SearchField.js';
import SideBar from './components/SideBar.js';
import Footer from './components/Footer.js';
import { useState } from 'react';
import close from './imagenes/closebutton.png';
import paypal from './imagenes/paypal.png';

function App() {
  const [displayChart, setDisplayChart] = useState(false);
  const [numOfSearch, setNumOfSearch] = useState(0);
  const [isInfo, setIsInfo] = useState(false);
  const [isSupport, setIsSupport] = useState(false);
  const [isExtra, setIsExtra] = useState(false);
  const [isDownloadData, setIsDownloadData] = useState(false);
  
  const prueba = process.env.DATA_URL? process.env.DATA_URL: "nada de nada" 
  console.log(prueba.substring(0, 4));
  

  return (
  <div className='full-content'>
    <Header/>
    <div className='body-content'>

          <SideBar  isSupport={isSupport} setIsSupport={setIsSupport}
                    isInfo={isInfo} setIsInfo={setIsInfo}
                    isExtra={isExtra} setIsExtra={setIsExtra}
                    isDownloadData={isDownloadData} setIsDownloadData={setIsDownloadData}
                    numOfSearch={numOfSearch}
          />
          <SearchField displayChart={displayChart} setDisplayChart={setDisplayChart}
                    numOfSearch={numOfSearch} setNumOfSearch={setNumOfSearch}
                    setIsSupport={setIsSupport} setIsInfo={setIsInfo} setIsExtra={setIsExtra}
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