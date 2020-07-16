import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';

import {
  ScannerSettings,
  createBarcodeScanner,
  BarcodeResult,
} from '../../services/barcode-scanner/barcode-scanner';
import { QuaggaAdapter } from '../../services/barcode-scanner/adapters/quagga/quagga-adapter';

interface BarcodeScannerProps {
  handleProcessed: (data: BarcodeResult) => true | undefined;
}

const formatSettings = [
  'ean_reader',
  'code_128_reader',
  'ean_8_reader',
  'code_39_reader',
  'code_39_vin_reader',
  'codabar_reader',
  'upc_reader',
  'upc_e_reader',
  'i2of5_reader',
  '2of5_reader',
  'code_93_reader',
];

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  handleProcessed,
}) => {
  const scanRef = useRef<HTMLDivElement>();
  const scanner = useRef<createBarcodeScanner>();
  const [activeFormat, setActiveFormat] = useState(formatSettings[0]);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState('');
  const settings: ScannerSettings = useMemo(
    () => ({
      onDetected: (data) => {
        const hasSuccess = handleProcessed(data);
        if (hasSuccess) {
          close();
        }
      },
      onProcessed: (data) => null,
      decoder: {
        readers: [activeFormat],
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanline: true,
          showPattern: true,
        },
      },
    }),
    [activeFormat]
  );

  useLayoutEffect(() => {
    if (scanRef.current) {
      scanner.current = new createBarcodeScanner(
        QuaggaAdapter,
        scanRef.current,
        settings
      );

      if (isStarted) {
        listen();
      }

      // clean up for unmount
      return () => {
        scanRef.current.innerHTML = '';
        scanner.current.stop();
        scanner.current = null;
      };
    }
  }, [scanRef, settings]);

  const listen = () => {
    setIsStarted(true);
    try {
      scanner.current.listen();
    } catch (e) {
      setError(e.message);
    }
  };

  const close = () => {
    scanner.current.stop();
    scanRef.current.innerHTML = '';

    setIsStarted(false);
  };

  return (
    <>
      {!isStarted ? (
        <button className="big" onClick={() => listen()}>
          Scan
        </button>
      ) : (
        <>
          {formatSettings.map((format) => (
            <button
              key={format}
              className="fake"
              disabled={format === activeFormat}
              onClick={() => setActiveFormat(format)}
            >
              {format}
            </button>
          ))}
          {error}
          <div>
            <button className="big" onClick={close}>
              Stop
            </button>
          </div>
        </>
      )}
      <div ref={scanRef} className="camera-space"></div>
    </>
  );
};
