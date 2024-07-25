import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Presentismo: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleScanSuccess = (decodedText: string) => {
    setScanResult(decodedText);
    alert('Presente marcado correctamente');
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };

  const handleScanFailure = (error: any) => {
    console.warn(`Error scanning QR code: ${error}`);
  };

  const handleStartScanning = () => {
    setIsScanning(true);
  };

  const handleStopScanning = () => {
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };

  useEffect(() => {
    if (isScanning && divRef.current) {
      const config = { fps: 10, qrbox: { width: 250, height: 250 }, facingMode: "environment" };
      scannerRef.current = new Html5QrcodeScanner("reader", config, false);
      scannerRef.current.render(handleScanSuccess, handleScanFailure);
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [isScanning]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded">
      {isScanning ? (
        <>
          <div id="reader" ref={divRef} style={{ width: "300px" }} />
          <button onClick={handleStopScanning} className="mt-4 bg-red-500 text-white p-2 rounded">
            Cancelar
          </button>
        </>
      ) : (
        <button
          onClick={handleStartScanning}
          className="w-32 h-32 rounded-full"
    
        >
            <img src="/images/qr-code.png" alt="Perfil" className="w-24 h-24 object-cover rounded-full"/>
    
        </button>
      )}
      {scanResult && (
        <div className="mt-4 p-4 bg-white shadow rounded">
          <p className="text-lg">Resultado del escaneo:</p>
          <p className="text-md">{scanResult}</p>
        </div>
      )}
    </div>
  );
};

export default Presentismo;
