// src/types/react-qr-scanner.d.ts
declare module 'react-qr-scanner' {
    import { Component } from 'react';
  
    interface QrScannerProps {
      delay?: number;
      onError?: (error: any) => void;
      onScan?: (data: string | null) => void;
      style?: React.CSSProperties;
      className?: string;
    }
  
    class QrScanner extends Component<QrScannerProps> {}
  
    export default QrScanner;
  }
  