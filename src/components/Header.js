import '../style-sheets/Header.css'
import logo from '../imagenes/logonegro.png'
import { useState } from 'react';

const Header = () => {
  const [counter, setCounter] = useState(1)
  const text = counter % 4 === 1
  ? ""
  : counter % 4 === 2
  ? "Lorem ipsum dolor sit amet, consectetuer "
  : counter% 4 === 3
  ?"Lorem ipsum dolor sit amet, consectetuer commodo ligula eget dolor. Aenean massa. Cum sociis natoque"
  :
  "Lorem ipsum dolor sit amet, con se ctetuer commo do ligula eget dolor. Aen ean massa. Cum sociis nat oque pena tibus et m agnis dis par turient montes nasce tur ridic ulus mus. Done c quam felis, ultricies nec, pellente sque eu, pretium quis, sem. Nulla consequat massa quis enim."


return (
    <header>
      <img src={logo} alt='logo' onClick={()=> setCounter(prev => prev + 1)} ></img>
      &nbsp;El discurso presidencial
      <div id='text-image'>{text}</div>

    </header>

    )
}

export default Header;