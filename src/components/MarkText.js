import React from 'react';

function MarkText(props) {
  const { element, website, phraseToFind } = props;
  

  // Dividir el texto en parts antes y después de la palabra deseada
  const parts = element.split(phraseToFind);

  // Crear un arreglo de elementos JSX que incluyen la palabra resaltada
  const content = parts.map((part, index) =>
    index === parts.length - 1 ? (
      <span key={index}>
        {part}
      </span>
    ) : (
      <span key={index}>
        {part}
        <span className="resaltado">{phraseToFind}</span>
      </span>
    )
  );

  return (
    <div className="right-column">
      <a href={website} target="_blank"  rel="noreferrer">
       <p>...{content}...</p>
      </a>
    </div>
  );
}

export default MarkText;
