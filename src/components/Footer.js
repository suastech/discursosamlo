import '../style-sheets/Footer.css'
import main_historial from '../main_historial.js'

function Footer () {

  return (
    <footer>
      <div id="footerinfo">
        Última atualización: {main_historial.last_update}
        <br/>
        Archivos indexados: {main_historial.quantity.toLocaleString('es-MX')}
        <br/>
        Fuentes: <a href="http:/presidencia.gob.mx/" target="_blank" rel="noreferrer">presidencia.gob.mx</a> y <a href="http:/lopezobrador.org.mx/" target="_blank" rel="noreferrer">lopezobrador.org.mx</a>         
      </div>

      <div id='footercredits'>
          <p style={{marginBottom:'8px'}}>Programación y diseño:<br/>Jesús Suaste Cherizola</p>
          <a href="https://jsuastech.netlify.app/" target="_blank" rel="noreferrer">https://jsuastech.netlify.app</a>
          <br/>
          <a href="https://twitter.com/suaste86" target="_blank" rel="noreferrer">@suaste86</a>
      </div>

 
    </footer>
  );
};

export default Footer;