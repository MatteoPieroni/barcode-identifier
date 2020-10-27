import React, { useEffect, createRef, useState, useRef, useMemo } from 'react';
import { BarcodeScanner } from './components/barcode-scanner/barcode-scanner';
import { BarcodeResult } from './services/barcode-scanner/barcode-scanner';

export const App: React.FC = () => {
  const [parsedBarcode, setParsedBarcode] = useState<BarcodeResult>();

  return (
    <div className="App">
      <header>
        <h1>Barcode Scanner</h1>
      </header>
      <main>
        <BarcodeScanner
          handleProcessed={(data) => {
            if (window.confirm(`Il codice letto e': ${data.code}. Confermi?`)) {
              setParsedBarcode(parsedBarcode);
              return true;
            }
          }}
        />
        {parsedBarcode && (
          <div className="code-container">
            <table>
              <thead>
                <td>Codice</td>
                <td>Formato</td>
              </thead>
							<tr>
								<td>{parsedBarcode.code}</td>
								<td>{parsedBarcode.format}</td>
							</tr>
            </table>
            <button
              onClick={() => {
                setParsedBarcode(null);
              }}
            >
              Resetta tutti i dati
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
