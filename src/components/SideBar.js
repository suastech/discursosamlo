import React, { useState } from 'react';
import '../style-sheets/SideBar.css';
import seemore from '../imagenes/menu.png';
import info from '../imagenes/info2.png';
import close from '../imagenes/closebutton.png';
import support from '../imagenes/support.png';
import extra from '../imagenes/comment.png';
import paypal from '../imagenes/paypal.png';
import creativeCommons from '../imagenes/licencia.png';
import descargar from '../imagenes/descargar.jpg';
import Printdata from './Printdata.js';
import main_historial from '../main_historial.js'

function SideBar(props) {
  const {isInfo, setIsInfo, isSupport, setIsSupport, isExtra, setIsExtra, isDownloadData, setIsDownloadData} = props
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
    
  const handleItem = (setSelected) => {
    const setFunctions = [setIsInfo, setIsSupport, setIsExtra, setIsDownloadData];
    setFunctions.forEach(func => {
     
      if (func !== setSelected) {
        func(false);
      } else {
        func(prev => !prev);
      }
    });
  };

  const closeButton = (setter) => {
      setter(false);
  }

return (
  <>
    <div className={`sidebar${isExpanded ? '-expanded' : ''}`}>

        {!isExpanded?
          <img id='moreless' src={seemore} alt='seemore' onClick={toggleSidebar} />
          :
          <>
            <img id='moreless' src={close} alt='seemore' onClick={toggleSidebar} />
            <img className='item' src={info} alt='info' title='Información' onClick={()=> handleItem(setIsInfo)} 
                 style={isInfo ? { boxShadow: '0 0 4px 4px rgb(3, 102, 132)' } : {}} />
            <img className='item' src={support} title='Apoyar' alt='support' onClick={()=> handleItem(setIsSupport)}
                style={isSupport ? { boxShadow: '0 0 4px 4px rgb(3, 102, 132)' } : {}}/>
            <img className='item' src={extra} alt='extra' title='Créditos'  onClick={()=> handleItem(setIsExtra)}
                style={isExtra ? { boxShadow: '0 0 4px 4px rgb(3, 102, 132)' } : {}}/>
           <img className='item' src={descargar} alt='descargar' title='Descargar base de términos frecuentes' onClick={()=> handleItem(setIsDownloadData)}
                style={isDownloadData ? { boxShadow: '0 0 4px 4px rgb(3, 102, 132)' } : {}}/>
          </>
        }
    </div>

    {!isInfo?
    null
    :
    <div id='infoSpecial' style={{textAlign:'center', fontSize:'18px'}}>
        <img id='closeButton' style={{height:'30px', display:'block', margin:'0 auto', marginBottom:'10px'}} onClick={() => closeButton(setIsInfo)} 
                src={close} alt='close'/>
          Información
      <ul style={{textAlign:'left'}}>
        <li>El buscador contabiliza las coincidencias de una cadena de texto en una base compuesta por {main_historial.quantity.toLocaleString('es-MX')} discursos y muestra su frecuencia anual. Puedes realizar tus propias búsquedas o elegir de la lista de términos frecuentes.</li>
        <li>Además, permite mostrar las {main_historial.limit_phrases} coincidencias más recientes y descargar un informe con las frases encontradas. Puedes hacer click sobre cada cita para ir a la página de la transcripción del evento.</li>
        <li>Si estás realizando una investigación destinada a revolucionar nuestra comprensión del país, el mundo o la era, y la restricción del número de frases mostradas la afecta sensiblemente, puedes contactar al programador para remediar la situación cuanto antes.</li>
        <li>En la sección de "Comparativos" puedes explorar grácficas temáticas y comparar términos frecuentes.</li>
        <li>El método de búsqueda devuelve coincidencias exactas (por ejemplo: la búsqueda de la cadena "neoliberal" no reconocerá como coincidencia la cadena "neoliberales"). No distingue entre minúsculas y mayúsculas, pero sí detecta acentos.</li>
        <li>El buscador no distingue entre palabras pronunciadas por el presidente y otros participantes de los distintos eventos. Si necesitas obtener una cita textual, puedes hacer click sobre la frase para ir a la página de la transcripción oficial para verificar el origen.</li>
        <li>En la opción "Descargar" puedes obtener la base de términos frecuentes en formato XLSX o CSV</li>
        <li>Para ver en detalle el código del método de búsqueda y la lista completa de los discursos indexados puedes dirigirte a <span style={{color:'blue', textDecoration:'underline', cursor:'pointer'}}><a href="https://github.com/suastech/infoDiscursosAmlo" rel='noreferrer' target="_blank"> este repositorio Github</a></span>.</li>
        <li>Si te resulta útil esta página, considera realizar un donativo para mantener el sitio en funcionamiento.</li>
      </ul>
    </div>
    }

    {!isSupport? 
    null
    :
    <div className='info-container'>
      <img id='closeButton' onClick={() => closeButton(setIsSupport)} 
                src={close} alt='close'/>
          <p>Este buscador es una herramienta de apoyo para académicos, estudiantes, periodistas y ciudadanos interesados en el análisis del discurso.</p>
          <p>Si te resulta útil, puedes apoyarnos haciendo un donativo a través de PayPal.</p>
          <div className='donateImages'>
          <a href="https://www.paypal.com/donate/?hosted_button_id=FJZLMWAHT6QFC" rel='noreferrer' target="_blank">
          <img src={paypal} alt='paypal' className='paypal' style={{width: 'auto'}}/></a>  
          </div>
    </div>
    }

    {!isExtra?
    null
    :
    <div className='info-container'>
        <img id='closeButton' onClick={() => closeButton(setIsExtra)} 
                src={close} alt='close'/>
        <h4>Créditos</h4>
        <p>Programación y diseño de este sitio: Jesús Suaste Cherizola</p>
        <p>Página personal: <a href='https://jsuastech.netlify.app' target='blank' >https://jsuastech.netlify.app</a>  </p>
        <img src={creativeCommons} alt="creativeCommons"/>
    </div>
    }
    {!isDownloadData?
    null
    :
    <div className='info-container'>
        <img id='closeButton' onClick={() => closeButton(setIsDownloadData)} 
                src={close} alt='close'/>
        <div>Descarga la base de búsquedas frecuentes en CSV o XLSX (26Kb) </div>
        <div style={{height:'30px', display:'flex', marginTop:'10px', justifyContent:'center'}}>
            <Printdata/>
        </div>

    </div>
    }


{/*
{!isList?
    null
    :
    <div id="list-files" >
        <div style={{
            width: '100%',
            padding: '5px',
            backgroundColor: 'rgba(221, 221, 221)',
            position: 'sticky',
            top: 0,
            display: 'flex',
            justifyContent: 'center'
            }}>
          <img  id='closeButton' onClick={() => closeButton(setIsList)}
                src={close} alt='close'
                style={{
                
                }}>
            </img>
          </div>
         Índice de archivos enlistados      
    
      <ul>
        {Object.entries(list_files).map(([clave, valor], index) => (
      
        <li key={clave} style={{ backgroundColor: index % 2 === 0 ? 'rgb(202, 202, 202)' : 'rgba(221, 221, 221)' }}>
          <a href={valor}>{`${clave.slice(0, 10).replace(/_/g, "/")} ${clave.slice(11,-4)}`}</a>
        </li>
        ))}
     </ul>

    </div>
    }*/}



  </>

);
}

export default SideBar;