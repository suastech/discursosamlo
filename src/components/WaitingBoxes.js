import '../style-sheets/WaitingBoxes.css'
import React, { useState, useEffect } from 'react';

const WaitingBoxes = () => {
  const [showSecondP, setShowSecondP] = useState(false);
  const [showThirdP, setShowThirdP] = useState(false);
  const [randomNumber, setRandomNumber] = useState(Math.round(Math.random()))

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setShowSecondP(true);
    }, 3000);

    const timeout2 = setTimeout(() => {
      setShowThirdP(true);
    }, 5000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

return (
  <>
      <div className='loading-box'>
          {randomNumber?
            <p>Procesando...</p>
            :
            <p>Esto puede tardar un poco...</p>
          }
          <div id="progress-6"></div>
          {showSecondP && (
            randomNumber?
            <p>Esto puede tardar un poco porque el presidente habla despacito...</p>
            :
            <p>Porque en un mundo avasallado por la velocidad, la lentitud no es deficiencia del programador...</p>
          )}
          {showThirdP && (
            randomNumber?
            <p>...y porque utilizamos la versión gratuita del servidor.</p>
            :
            <p>...sino grandeza espiritual de un usuario que cultiva la paciencia.</p>
          )}
      </div>
  </>
  )
}

export default WaitingBoxes;