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

function SideBar(props) {
  const {isInfo, setIsInfo, isSupport, setIsSupport, isExtra, setIsExtra, isDownloadData, setIsDownloadData} = props
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
    
  const handleItem = (setSelected) => {
    // Definimos un array con las 4 funciones Set
    const setFunctions = [setIsInfo, setIsSupport, setIsExtra, setIsDownloadData];
    setFunctions.forEach(func => {
      // Si la función no coincide con setSelected, establecemos su valor a false
      // De lo contrario, establecemos su valor a true
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
            <img className='item' src={info} alt='info' onClick={()=> handleItem(setIsInfo)} 
                 style={isInfo ? { boxShadow: '0 0 4px 4px rgb(3, 102, 132)' } : {}} />
            <img className='item' src={support} alt='support' onClick={()=> handleItem(setIsSupport)}
                style={isSupport ? { boxShadow: '0 0 4px 4px rgb(3, 102, 132)' } : {}}/>
            <img className='item' src={extra} alt='extra' onClick={()=> handleItem(setIsExtra)}
                style={isExtra ? { boxShadow: '0 0 4px 4px rgb(3, 102, 132)' } : {}}/>
           <img className='item' src={descargar} alt='descargar' onClick={()=> handleItem(setIsDownloadData)}
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
        <li>El buscador contabiliza las menciones de una cadena de texto, permite mostrar cada aparición y descargar un informe con todas las frases encontradas.</li>
        <li>Puedes hacer click sobre cada cita para ir a la página de la transcripción del evento.</li>
        <li>La búsqueda no distingue entre minúsculas y mayúsculas, pero sí detecta acentos.</li> 
        <li>El buscador no distingue entre palabras pronunciadas por el presidente y otros participantes en los eventos.</li>
        <li>La gran mayoría de los discursos son obtenidos del sitio de presidencia.gob.mx. Los demás se obtuvieron en la página lopezobrador.org.mx. </li>
        <li>Si te resulta útil esta página, considera realizar un donativo para mantener el sitio (y al programador) en funcionamiento.</li>
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
        <p>Página personal: https://suastech.github.io/</p>
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
        <div style={{width:'100px', height:'30px', marginTop:'10px', marginLeft: '230px'}}>
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