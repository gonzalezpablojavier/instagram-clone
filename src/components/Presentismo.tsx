import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const Presentismo: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [estado, setEstado] = useState<'ausente' | 'presente'>('ausente');
  const [showQR, setShowQR] = useState(false);

  const handleScan = (data: string | null) => {
    if (data) {
      setScanResult(data);
      if (validateQrCode(data)) {
        setEstado('presente');
        alert('Presente marcado correctamente');
        setShowQR(false); // Ocultar el lector QR después de un escaneo exitoso
      } else {
        alert('Código QR inválido. Inténtelo de nuevo.');
        handleRetry();
      }
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
        return prev;
      }
    });
  };

  const validateQrCode = (code: string) => {
    // Validar el código QR (esta función puede ser personalizada según tus necesidades)
    return code === 'expected_qr_code_value';
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const videoConstraints = {
    facingMode: 'environment',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl mb-4">Marcar Presentismo</h2>
      {estado === 'ausente' ? (
        <>
          {showQR ? (
            <div className="w-full max-w-sm">
              <QrScanner
                delay={300}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
            
              />
              <button
                onClick={() => setShowQR(false)}
                className="bg-red-500 text-white p-2 rounded mt-4"
              >
                Cerrar Lector QR
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowQR(true)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Abrir Lector QR
            </button>
          )}
          <p className="mt-4">Intentos restantes: {10 - retryCount}</p>
        </>
      ) : (
        <p className="text-xl">Estado: Presente</p>
      )}
    </div>
  );
};

export default Presentismo;
