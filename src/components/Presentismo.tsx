import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const Presentismo: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const handleScanSuccess = (decodedText: string) => {
    setScanResult(decodedText);
    alert('Presente marcado correctamente');
    stopScanning();
  };

  const handleScanFailure = (error: any) => {
    console.warn(`Error scanning QR code: ${error}`);
  };

  const startScanning = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("reader");
      }

      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        const cameraId = devices[devices.length - 1].id; // Typically, the last camera is the back camera
        await scannerRef.current.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          handleScanSuccess,
          handleScanFailure
        );
        setIsScanning(true);
      } else {
        console.error('No cameras found');
        alert('No se encontraron cámaras en el dispositivo');
      }
    } catch (err) {
      console.error('Error starting scanner:', err);
      alert('Error al iniciar el escáner. Por favor, asegúrate de que la cámara esté disponible y hayas dado los permisos necesarios.');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded">
      {isScanning ? (
        <>
          <div id="reader" style={{ width: "300px", height: "300px" }} />
          <button onClick={stopScanning} className="mt-4 bg-red-500 text-white p-2 rounded">
            Cancelar
          </button>
        </>
      ) : (
        <button
          onClick={startScanning}
          className="w-24 h-24 object-cover rounded-full"
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
