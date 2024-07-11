import "../style-sheets/Printdata.css";
import descargar from '../imagenes/descargar.jpg';
import main_historial from "../main_historial.js";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useState } from "react";

function Printdata() {
  const [showIcons, setShowIcons] = useState(false);

  const handlePrintData = (format) => {
    const list_of_words = main_historial.list_of_words;

    let data = [ [`Amlo dice. Herramienta para el análisis del discurso`] ];
    data.push(["Término", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "Total"]);
    Object.keys(list_of_words).forEach((word) => {
      const counter = list_of_words[word].counter;
      const total= counter.reduce((acumulador, numero) => acumulador + numero, 0);
      data.push([word, ...counter, total]);
      });
    data.push([`Con base en la transcripción de los discursos presidenciales disponibles en presodencia.gob.mx. Discursos entre el 01/12/18 y el ${main_historial.last_update}. Para más información sobre los discursos consultados y las funciones de búsqueda puedes consultar: Programación y diseño: Jesús Suaste Cherizola`])
    data.push([`http://amlodice.vercel.app`])

    let fileContent;

    if (format) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      fileContent = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    } else {
      const escapeCSVValue = (value) => {
        if (typeof value === 'string') {
          // Escapar comillas dobles con comillas dobles adicionales
          value = value.replace(/"/g, '""');
          // Envolver el valor entre comillas dobles si contiene comas o comillas dobles
          if (value.includes(',') || value.includes('"')) {
            value = `"${value}"`;
          }
        }
        return value;
      };

      const csv = data.map((row) => row.map(escapeCSVValue).join(",")).join("\n");
      const bom = '\uFEFF';
      const csvWithBom = bom + csv;
      fileContent = new Blob([csvWithBom], { type: "text/csv;charset=utf-8;" });
    }

    const blob = new Blob([fileContent], {
      type: format
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv",
    });
    saveAs(
      blob,
      `El discurso presidencial. Frecuencia de términos.${format ? "xlsx" : "csv"}`
    );

    //alert(`Datos descargados en formato ${format ? "XLSX" : "CSV"}`);
  };

  return (
    <div id='printspace' title='Descargar base de búsquedas frecuentes' onClick={()=> setShowIcons(true)} onMouseEnter={() => setShowIcons(true)} onMouseLeave={() => setShowIcons(false)} >
      <img id='dataimage' src={descargar} alt='Descargar'/>
      {showIcons && (
        <>
          <div className='format-data' onClick={() => handlePrintData(true)}>XLSX</div>
          <div className='format-data' onClick={() => handlePrintData(false)}>CSV</div>
        </>
      )}
    </div>
  );
}

export default Printdata;