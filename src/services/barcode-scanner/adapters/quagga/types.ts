export interface QuaggaJSResultObject {
  codeResult: QuaggaJSResultObject_CodeResult;
  line: {
    x: number;
    y: number;
  }[];
  angle: number;
  pattern: number[];
  box: number[][];
  boxes: number[][][];
}

export interface QuaggaJSResultObject_CodeResult {
  code: string;
  start: number;
  end: number;
  codeset: number;
  startInfo: {
    error: number;
    code: number;
    start: number;
    end: number;
  };
  decodedCodes: {
    error?: number;
    code: number;
    start: number;
    end: number;
  }[];

  endInfo: {
    error: number;
    code: number;
    start: number;
    end: number;
  };
  direction: number;
  format: string;
}
