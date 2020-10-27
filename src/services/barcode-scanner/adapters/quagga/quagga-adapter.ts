import Quagga from '@ericblade/quagga2';

import { Adapter } from '../adapter';
import { getMedianOfCodeErrors } from './utils';
import { ScannerSettings, BarcodeResult } from '../../barcode-scanner';
import { QuaggaJSResultObject } from './types';

const processResult = (result: QuaggaJSResultObject): BarcodeResult => {
  return {
    code: result.codeResult.code,
    format: result.codeResult.format,
  };
};

export const QuaggaAdapter = new Adapter({
  start: (element: HTMLDivElement, settings: ScannerSettings): void => {
    const { onDetected, onProcessed, ...rest } = settings;

    Quagga.init(
      {
        // debug: true,
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: element,
          constraints: {
            width: 960,
          },
        },
        decoder: {
          readers: ['ean_reader'],
          // debug: {
          //   drawBoundingBox: true,
          //   showFrequency: true,
          //   drawScanline: true,
          //   showPattern: true,
          // },
        },
        // locator: {
        //   debug: {
        //     showCanvas: true,
        //     showPatches: true,
        //     showFoundPatches: true,
        //     showSkeleton: true,
        //     showLabels: true,
        //     showPatchLabels: true,
        //     showRemainingPatchLabels: true,
        //     boxFromPatches: {
        //       showTransformed: true,
        //       showTransformedBox: true,
        //       showBB: true,
        //     },
        //   },
        // },
        ...rest,
      },
      function (err) {
        if (err) {
          throw new Error(`Mamma santa: ${err}`);
        }

        console.log('Initialization finished. Ready to start');

        Quagga.onDetected((data: QuaggaJSResultObject) => {
          if (
            data &&
            // show only if error is less than 25%
            getMedianOfCodeErrors(data.codeResult.decodedCodes) < 0.25
          ) {
            const normalisedResult = processResult(data);

            onDetected(normalisedResult);
          }
        });
        Quagga.onProcessed((data: QuaggaJSResultObject) => {
          if (data) {
            if (data.codeResult && data.codeResult.code) {
              const normalisedResult = processResult(data);
              settings.onProcessed(normalisedResult);
            }
          }
        });

        Quagga.start();
      }
    );
	},

  destroy() {
    Quagga.stop();
	},

	decodeImage(src: string, settings: ScannerSettings) {
		const { onDetected, onProcessed, ...rest } = settings;

		Quagga.decodeSingle({
			src,
			decoder: {
        readers: ["code_128_reader"]
    	},
			...rest
		}, data => {
			if (data) {
				if (data.codeResult && data.codeResult.code) {
					const normalisedResult = processResult(data);
					settings.onProcessed(normalisedResult);
				}
			}
	})
	}
});
