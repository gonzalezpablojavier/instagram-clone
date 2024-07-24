import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const Presentismo: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [estado, setEstado] = useState<'ausente' | 'presente'>('ausente');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleScan = (data: string) => {
    setScanResult(data);
    if (validateQrCode(data)) {
      setEstado('presente');
      alert('Presente marcado correctamente');
      setIsScanning(false); // Stop scanning after successful scan
    } else {
      alert('Código QR inválido. Inténtelo de nuevo.');
      handleRetry();
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    alert('Error al escanear el código QR. Inténtelo de nuevo.');
    handleRetry();
  };

  const handleRetry = () => {
    setRetryCount((prev) => {
      if (prev < 9) {
        return prev + 1;
      } else {
        alert('Se ha alcanzado el límite de intentos.');
        setIsScanning(false); // Stop scanning after reaching retry limit
        return prev;
      }
    });
  };

  const validateQrCode = (code: string) => {
    // Validar el código QR (esta función puede ser personalizada según tus necesidades)
    return code === 'expected_qr_code_value';
  };

  const handleStartScanning = async () => {
    setIsScanning(true);
    if (videoRef.current) {
      try {
        const codeReader = new BrowserMultiFormatReader();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          if (result) {
            handleScan(result.getText());
          }
          if (err) {
            handleError(err);
          }
        });
      } catch (err) {
        console.error('Error accessing the camera:', err);
        alert('No se pudo acceder a la cámara. Inténtelo de nuevo.');
      }
    }
  };

  const handleStopScanning = () => {
    setIsScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded">
      {estado === 'ausente' ? (
        <>
          {isScanning ? (
            <>
              <video ref={videoRef} style={previewStyle} />
              <button onClick={handleStopScanning} className="mt-4 bg-red-500 text-white p-2 rounded">
                Cancelar
              </button>
              <p className="mt-4">Intentos restantes: {10 - retryCount}</p>
            </>
          ) : (
            <button
              onClick={handleStartScanning}
              className="w-32 h-32 rounded-full"
              style={{ backgroundImage: "url('/images/qr-code.png')" }}
            >
              {/* Button content (e.g., an icon or text) */}
            </button>
          )}
        </>
      ) : (
        <p className="text-xl">Estado: Presente</p>
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
