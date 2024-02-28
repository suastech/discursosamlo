import '../style-sheets/Footer.css'

function Footer () {
  const [update,quantity] = ["17/02/2024", "2,134"]
  return (
    <footer>
      <div id="footerinfo">
        Última atualización: {update}
        <br/>
        Archivos indexados: {quantity}
        <br/>
        Fuentes: <a href="http:/presidencia.gob.mx/" target="_blank" rel="noreferrer">presidencia.gob.mx</a> y <a href="http:/lopezobrador.org.mx/" target="_blank" rel="noreferrer">lopezobrador.org.mx</a>         
      </div>

      <div id='footercredits'>
          <p style={{marginBottom:'8px'}}>Programación y diseño:<br/>Jesús Suaste Cherizola</p>
          <a href="https://suastech.github.io/" target="_blank" rel="noreferrer">https://suastech.github.io/</a>
          <br/>
          <a href="https://twitter.com/suaste86" target="_blank" rel="noreferrer">@suaste86</a>
      </div>

 
    </footer>
  );
};

export default Footer;