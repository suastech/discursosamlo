import '../style-sheets/WaitingBoxes.css'
import React, { useState, useEffect } from 'react';

const WaitingBoxes = () => {
  const [showSecondP, setShowSecondP] = useState(false);
  const [showThirdP, setShowThirdP] = useState(false);

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setShowSecondP(true);
    }, 1000);

    const timeout2 = setTimeout(() => {
      setShowThirdP(true);
    }, 3000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

return (
  <>
   <div className='loading-box'>
     <p>Procesando...</p>
      <div id="progress-6"></div>
       {showSecondP && (
        <p>Esto puede tardar un poco porque el presidente habla despacito...</p>
        )}
        {showThirdP && (
        <p>...y porque utilizamos la versión gratuita del servidor.</p>
        )}
      </div>
  </>
  )
}

export default WaitingBoxes;