import React, { useEffect, createRef, useState, useRef, useMemo } from 'react';
import { BarcodeScanner } from './components/barcode-scanner/barcode-scanner';
import { BarcodeResult } from './services/barcode-scanner/barcode-scanner';

export const App: React.FC = () => {
  const [parsedBarcodes, setParsedBarcodes] = useState<BarcodeResult[]>(() => {
    return JSON.parse(localStorage.getItem('barcodes') || '[]');
  });

  const addToLocalStorage = (data: BarcodeResult) => {
    const oldLocalStorage: BarcodeResult[] = JSON.parse(
      localStorage.getItem('barcodes') || '[]'
    );

    localStorage.setItem(
      'barcodes',
      JSON.stringify([...oldLocalStorage, data])
    );
  };

  return (
    <div className="App">
      <header>
        <h1>Barcode Scanner</h1>
      </header>
      <main>
        <BarcodeScanner
          handleProcessed={(data) => {
            if (window.confirm(`Il codice letto e': ${data.code}. Confermi?`)) {
              setParsedBarcodes([...parsedBarcodes, data]);
              addToLocalStorage(data);
              return true;
            }
          }}
        />
        {parsedBarcodes.length > 0 && (
          <div className="code-container">
            <table>
              <thead>
                <td>Codice</td>
                <td>Formato</td>
              </thead>
              {parsedBarcodes.map((barcode) => (
                <tr>
                  <td>{barcode.code}</td>
                  <td>{barcode.format}</td>
                </tr>
              ))}
            </table>
            <button
              onClick={() => {
                localStorage.clear();
                setParsedBarcodes([]);
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
