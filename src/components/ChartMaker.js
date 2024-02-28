import '../style-sheets/ChartMaker.css'
import PhraseDisplayer from './PhraseDisplayer.js';
import { Line } from 'react-chartjs-2';
import plus from '../imagenes/plus.png';
import minus from '../imagenes/minus.png';
import refresh from '../imagenes/refresh.png';
import CompleteList from './CompleteList.js';
import lineData from '../lineData.js';
import copy from '../imagenes/copy.png'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState } from 'react';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartMaker = (props) => {

const {mainCounter, locationOccurrences, phraseToFind, displayPhrases, setDisplayPhrases, exactExpression,
      historial, setHistorial, setLocationOccurrences} = props;

  const [isWordChart, setIsWordChart] = useState(false);
  const [indexOrigin, setIndexOrigin] = useState(0);
  const colors = ["rgba(75,192,192)", "rgb(123, 139, 164)", "black", "rgb(56, 84, 200)", "rgb(108, 108, 108)"];
  const [resultsArray, setResultsArray] = useState([]);
  
  const copyToClipboard = () => {
    let textToCopy = `${phraseToFind}\nTotal:${total}\n${JSON.stringify(mainCounter)}\n`
    resultsArray.forEach((value) => {
        const mappedValue = lineData.list_of_words[value];
        if (mappedValue) {
          textToCopy += `${value}\nTotal: ${mappedValue.total}\n${JSON.stringify(mappedValue.counter)}\n\n`;
        }
    })
    navigator.clipboard.writeText(textToCopy.trim())
      .then(() => {
        alert('Informaión de la gráfica copiada al portapapeles');
      })
      .catch((error) => {
        console.error('Error al copiar al portapapeles:', error);
        alert('¡Hubo un error al intentar copiar la información al portapapeles!');
      }); 
   };


  const activatePhrases = () => {
    setDisplayPhrases(true)
    setTimeout(() => {
      document.querySelector('.phrase-displayer').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
    }

  const listOfValues = [];
  for (const year in mainCounter) {
    listOfValues.push(mainCounter[year]);
  }
  const total = listOfValues.reduce((total, valor) => total + valor, 0)

  const data = {
    labels: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: phraseToFind,
        data: listOfValues,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4,
      },
      ...resultsArray.map((element, index) => {
        const values = lineData.list_of_words[element] ? Object.values(lineData.list_of_words[element].counter) : [];
        return {
          label: element,
          data: values,
          fill: false,
          borderColor: colors[index + 1],
          tension: 0.4,
        };
      }),
    ]
  };
  
  const options = {
    plugins: {
      legend: {
         display: false
      }
    },
    scales: {
      x: {
        title: {
        display: true,         
        },
      },
      y: {
        
      },
    },
  };

  return (
    <>
    {isWordChart?
      <CompleteList apagador={setIsWordChart} changeOrigin={indexOrigin}
      arrayOfWords={resultsArray} setArrayOfWords={setResultsArray}/>
    :
      null
    }
    <div className='mainchart'>
      <div className='chart-container'>

        <div style={{textAlign:'center', fontSize:'18px'}}>Búsqueda: {phraseToFind}<br/>{total} repeticiones encontradas</div>

        {resultsArray.length>0?
        <div style={{display:'flex', marginTop:'15px', justifyContent:'center'}}>
          <p style={{fontSize:'16px', marginRight:'10px', color: colors[0] }}>{phraseToFind} {total}</p>  
          {resultsArray.map((value, i) => (
            <p key={i} style={{fontSize:'16px', marginRight:'10px', color: colors[i+1] }}> {value} {value !== ''? lineData.list_of_words[value].total :''} </p>
            ))
          }
        </div>
        : null
        }

        <Line data={data} options={options} style={{ width: '600px', height: '300px'}} />

        <div id='new-menu'>
          
        <div style={{display:'flex', alignItems:'center', fontSize:'18px', paddingBottom:'10px'}}> 
          <div
          style={{  display: 'flex', alignItems:'center', width:'fit-content', paddingLeft:'18px',
                    
                    cursor:resultsArray.length<5? 'pointer': 'not-allowed',
                    opacity: resultsArray.length<5? '1':'0.6'
                }}
          onClick={() => {
              if (resultsArray.length<5) {
              setIndexOrigin(resultsArray.length)
              const updatedarray = [...resultsArray];
              updatedarray.push('');
              setResultsArray(updatedarray);
              setIsWordChart(true)
              } }}>
             <img src={plus} alt='plus' style={{ height: '20px'}} />
              &nbsp;Añadir término...
          </div>
          <img src={copy} title='Copiar datos de esta gráfica' alt='Copiar' onClick={copyToClipboard}
            style={{height:'25px', marginLeft:'auto', cursor:'pointer'}}/>&nbsp;Copiar Datos
        </div>

          {resultsArray.map((value, i) => (
          <div key={i} style={{display:'flex', alignItems:'center', fontSize:'18px', margin:'8px 0px'}}>
            <div id="line-menu" value={value}>
              {value}
            </div>
            <div style={{cursor:'pointer', display:'flex', alignItems:"center"}}
              onClick={() => {
                setIsWordChart(true)
                setIndexOrigin(i)
              }} >
              <img src={refresh} alt='change' style={{height:'22px', marginLeft:'20px', cursor: 'pointer'}}/> 
              &nbsp;Cambiar
            </div>
            <div style={{cursor:'pointer', display:'flex', alignItems:"center"}}
                onClick={() => { 
                const updatedarray = [...resultsArray];
                updatedarray.splice(i, 1);
                setResultsArray(updatedarray);
                }} >
                <img src={minus} alt='minus' style={{height:'25px', marginLeft:'20px', cursor: 'pointer'}}/> 
                &nbsp;Quitar
              </div>
            
          </div>  
          ))}
        

        </div>

        <button id="see-phrases-button" onClick={activatePhrases}
                disabled={displayPhrases === true || total === 0 || total>5000} //aprox 1.7MB
                style={{
                  cursor: displayPhrases || total === 0 || total > 5000 ? 'not-allowed' : 'pointer'}}
                >
        Ver frases
        </button>
      </div>
      {displayPhrases? (
      <div className='phrase-displayer'>
       <PhraseDisplayer mainCounter={mainCounter} locationOccurrences={locationOccurrences} phraseToFind={phraseToFind}
       exactExpression={exactExpression} setLocationOccurrences={setLocationOccurrences}
       historial={historial} setHistorial={setHistorial}/>
      </div>
      ) : null}

    </div>
    </>
  )
};

export default ChartMaker;
