import '../style-sheets/Graphs.css';
import { useState } from 'react';
import close from '../imagenes/closebutton.png';
import plus from '../imagenes/plus.png';
import minus from '../imagenes/minus.png';
import refresh from '../imagenes/refresh.png';
import copy from '../imagenes/copy.png'
import barData from '../barData.js'; 
import lineData from '../lineData.js';
import Printdata from './Printdata.js';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Chart as ChartJS, PointElement, LineElement, Tooltip, Legend} from 'chart.js';
import CompleteList from './CompleteList.js';
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title);
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
//<p style={{marginLeft:'20px'}}>Total:{lineData.list_of_words[value].total}</p>


function Graphs( {setIsGraphs}) {
  const [topicOrword, setTopicOrWord] = useState(false)
  const [selectedBarValue, setSelectedBarValue] = useState('Temas generales');
  const [selectedLineValue, setSelectedLineValue] = useState(["abrazos"]);
  const [isListChart, setIsListChart] = useState(false)
  const labelsBar = Object.keys(barData[selectedBarValue]);
  const valuesBar= Object.values(barData[selectedBarValue]);
  const [changeOrigin, setChangeOrigin] = useState(0)
  const colors = ["rgba(75,192,192)", "rgb(123, 139, 164)", "black", "rgb(56, 84, 200)", "rgb(108, 108, 108)"]
  const maxMenus= 4;

  const copyToClipboard = () => {
    let textToCopy = topicOrword ? JSON.stringify(barData[selectedBarValue]) : '';
    if (!topicOrword) {
      selectedLineValue.forEach((value) => {
        const mappedValue = lineData.list_of_words[value];

        if (mappedValue) {
          textToCopy += `${value}\nTotal: ${mappedValue.total}\n${JSON.stringify(mappedValue.counter)}\n\n`;
        }
      });
    }
    navigator.clipboard.writeText(textToCopy.trim())
      .then(() => {
        alert('Informaión de la gráfica copiada al portapapeles');
      })
      .catch((error) => {
        console.error('Error al copiar al portapapeles:', error);
        alert('¡Hubo un error al intentar copiar la información al portapapeles!');
      });
  };

  const handleChange = (event, number) => {
    const value = event.target.value;
     setSelectedBarValue(value);  
  };

  const dataBar =
  {
    labels: labelsBar,
    datasets: [
      {
        backgroundColor: 'rgba(54, 162, 235, 0.9)',
        borderWidth: 1,
        data: valuesBar,
      },
    ],
  }
  
  const dataLine = {
    labels: ["2018","2019","2020","2021","2022","2023","2024"],
    datasets: selectedLineValue.map((element, index) => {
      const valuesLine = lineData.list_of_words[element]? Object.values(lineData.list_of_words[element].counter):[];
      return {
        label: element,
        data: valuesLine,
        fill: false,
        borderColor: colors[index],
        tension: 0.4,
      };
    })
  };
  
const options = topicOrword? {
    plugins: {
        legend: {
           display: false
        }
      },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }],
    },
  }
  :
  {
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
  {isListChart?
    <CompleteList apagador={setIsListChart} changeOrigin={changeOrigin}
    arrayOfWords={selectedLineValue} setArrayOfWords={setSelectedLineValue}/>
  :
    null
  }

<div id='graphs-full'>
  <div id='graphs-main'>
    <img style={{height:'40px', margin:'30px auto 0px auto', cursor:'pointer'}} onClick={() => setIsGraphs(false)} 
      src={close} alt='close'/>
    <div id='switch-box' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:'18px', marginTop:'30px', marginBottom:'30px'}}>
       <div style={{marginRight:'5px', color: topicOrword? 'black' : 'gray' }}>Temáticos</div> 
       <label className="switch">
        <input type="checkbox" 
                checked={!topicOrword}
                onChange={() => setTopicOrWord(prev => !prev)} />
          <span className="slider round"></span>
       </label>
       <div style={{marginLeft:'5px', color: topicOrword? 'gray' : 'black'}}>Términos</div> 
    </div>

    <div id='graph-container'>
    {topicOrword?
    <>
    <select id="bar-menu" value={selectedBarValue} onChange={handleChange}>
       {Object.keys(barData).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
     ))}
     </select>        
        <Bar id='bar' data={dataBar} options={options} className='graphitself'/>
      </>
      :
      <>
      
      {selectedLineValue.map((value, i) => (
      <div key={i} style={{display:'flex', alignItems:'center', fontSize:'18px', margin:'10px 0px'}}>
        <div id="line-menu" value={value}>
          {value}
        </div>
        <div style={{cursor:'pointer', display:'flex', alignItems:"center"}}
          onClick={() => {
            setChangeOrigin(i)
            setIsListChart(true)      
          }} >
          <img src={refresh} alt='change' style={{height:'22px', marginLeft:'20px', cursor: 'pointer'}}/> 
           &nbsp;Cambiar
        </div>
      
        {i > 0 &&
          <div style={{cursor:'pointer', display:'flex', alignItems:"center"}}
            onClick={() => { 
            const updatedLineValue = [...selectedLineValue];
            updatedLineValue.splice(i, 1);
            setSelectedLineValue(updatedLineValue);
            }} >
            <img src={minus} alt='minus' style={{height:'25px', marginLeft:'20px', cursor: 'pointer'}}/> 
            &nbsp;Quitar
          </div>
        }
      </div>  
      ))}
      
      {selectedLineValue.length <= maxMenus ? (
        <div
          style={{ display: 'flex', alignItems:'center', width:'fit-content', margin: '10px 0px 0px 15px', fontSize: '18px', cursor:'pointer'}}
          onClick={() => {
              setChangeOrigin(selectedLineValue.length)
              setIsListChart(true)
              const updatedLineValue = [...selectedLineValue];
              updatedLineValue.push('');
              setSelectedLineValue(updatedLineValue);
          }}>
          <img src={plus} alt='plus' style={{ height: '20px'}} />
          &nbsp;Añadir término
        </div>)
        :(
        <></>
      )}

      <div id='results' style={{display:'flex', margin:'10px 0', justifyContent:'center'}}>
          {selectedLineValue.map((value, i) => (
            <p key={i} style={{fontSize:'16px', marginRight:'10px', color: colors[i] }}> {value} {value !== ''? lineData.list_of_words[value].total :''} </p>
            ))
          }
      </div>
      <Line data={dataLine} options={options} className='graphitself'/>
      </>
    }
    </div>

    <div id='extra'>
      <div style={{display:'flex'}}>
        <img id='copy' src={copy} title='Copiar datos de esta gráfica' alt='Copiar' onClick={copyToClipboard}/>
        <Printdata/>
      </div>
      <div style={{marginLeft:'auto'}}>Actos públicos entre el 01/12/2018 y el 15/02/2024</div>
    </div>

  </div>

</div>

</>
);
};

export default Graphs;
