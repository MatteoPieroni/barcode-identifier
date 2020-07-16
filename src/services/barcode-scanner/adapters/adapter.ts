import { ScannerSettings, BarcodeResult } from '../barcode-scanner';

export class Adapter {
  specificAdapter: Adapter;

  constructor(specificAdapter) {
    this.specificAdapter = specificAdapter;
  }

  start(element: HTMLDivElement, settings: ScannerSettings): void {
    return this.specificAdapter.start(element, settings);
  }

  destroy(): void {
    this.specificAdapter.destroy();
  }
}
