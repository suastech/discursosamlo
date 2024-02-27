import "../style-sheets/Printdata.css";
import descargar from '../imagenes/descargar.jpg';
import lineData from "../lineData.js";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useState } from "react";

function Printdata() {
  const [showIcons, setShowIcons] = useState(false);

  const handlePrintData = (format) => {
    const list_of_words = lineData.list_of_words;
    const years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"];

    let data = [];
    data.push(["Término", ...years, "Total"]);
    Object.keys(list_of_words).forEach((word) => {
      const counter = list_of_words[word].counter;
      const total = years.reduce((acc, year) => acc + (counter[year] || 0), 0);
      data.push([word, ...years.map((year) => counter[year] || 0), total]);
    });

    // Generar el archivo según el formato especificado
    let fileContent;
    if (format) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      fileContent = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    } else {
      const csv = data.map((row) => row.join(",")).join("\n");
      fileContent = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    }

    // Utilizar FileSaver.js para descargar el archivo
    const blob = new Blob([fileContent], {
      type: format
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv",
    });
    saveAs(
      blob,
      `Frecuencia de términos, Discurso Presidencial.${format ? "xlsx" : "csv"}`
    );

    alert(`Datos descargados en formato ${format ? "XLSX" : "CSV"}`);
  };

  return (
    <div id='printspace' title='Descargar base de búsuedas frecuentes' onClick={()=> setShowIcons(true)} onMouseEnter={() => setShowIcons(true)} onMouseLeave={() => setShowIcons(false)} >
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
