import '../style-sheets/Header.css'
import logo from '../imagenes/logonegro.png'

const Header = () => {

return (
    <header>
      <img src={logo} alt='logo'></img>
      &nbsp;El discurso presidencial
    </header>
    )
}

export default Header;