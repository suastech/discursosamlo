
function AskSupport(props) {

return (
        <div className='info-container'>
          <img id='closeButton' onClick={() => props.setAskSupport(false)} 
                    src={close} alt='close'/>
              <p>Este buscador es una herramienta de apoyo para académicos, estudiantes, periodistas y ciudadanos interesados en el análisis del discurso.</p>
              <p>Si te resulta útil, puedes apoyarnos haciendo un donativo a través de PayPal.</p>
              <div className='donateImages'>
              <a href="https://www.paypal.com/donate/?hosted_button_id=FJZLMWAHT6QFC" rel='noreferrer' target="_blank">
              <img src={paypal} alt='paypal' className='paypal' style={{width: 'auto'}}/></a>  
              </div>
        </div>

)
}