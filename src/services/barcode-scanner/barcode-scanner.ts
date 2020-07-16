import React from 'react';
import { Adapter } from './adapters/adapter';

export interface BarcodeResult {
  code: string;
  format: string;
}

export interface ScannerSettings {
  [key: string]: any;
  onDetected: (barcode: BarcodeResult) => void;
  onProcessed: (barcode: BarcodeResult) => void;
}

export class createBarcodeScanner {
  adapter: Adapter;
  element: HTMLDivElement;
  settings: ScannerSettings;

  constructor(adapter, element, settings) {
    this.adapter = adapter;
    this.element = element;
    this.settings = settings;
  }

  listen(): void {
    try {
      const barcodeResult = this.adapter.start(this.element, this.settings);

      return barcodeResult;
    } catch (e) {
      throw e;
    }
  }

  stop(): void {
    this.adapter.destroy();
  }
}
