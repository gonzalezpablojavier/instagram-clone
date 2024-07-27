import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Camera {
  id: string;
  label: string;
}

const Presentismo: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraId, setCameraId] = useState<string>('');
  const [cameras, setCameras] = useState<Camera[]>([]);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const [colaboradorID, setColaboradorID] = useState<string | null>(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const [tipo, setTipo] = useState<'entrada' | 'salida'>('entrada');

  useEffect(() => {
    const storedColaboradorID = localStorage.getItem('colaboradorID');
    if (storedColaboradorID) {
      setColaboradorID(storedColaboradorID);
    }

    Html5Qrcode.getCameras().then((devices) => {
      // Filtrar solo las cámaras traseras
      const backCameras = devices.filter(camera => /(back|rear)/i.test(camera.label));
      
      // Si no hay cámaras traseras, usar todas las cámaras
      const availableCameras = backCameras.length > 0 ? backCameras : devices;
      
      // Simplificar los nombres de las cámaras
      const simplifiedCameras = availableCameras.map((camera, index) => ({
        id: camera.id,
        label: `Cámara ${index + 1}`
      }));

      setCameras(simplifiedCameras);
      
      if (simplifiedCameras.length > 0) {
        setCameraId(simplifiedCameras[0].id);
      }
    }).catch(err => {
      console.error('Error getting cameras', err);
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const handleScanSuccess = (decodedText: string) => {
    setScanResult(decodedText);
    alert('Presente marcado correctamente');
    handleStopScanning();
    enviarDatosAlBackend(decodedText);
  };

  const enviarDatosAlBackend = async (decodedText: string) => {
    const colaboradorID = localStorage.getItem('colaboradorID');
    const horaRegistro = new Date().toISOString();

    const datos = {
      colaboradorID,
      tipo,
      horaRegistro
    };

    try {
      const response = await fetch(`${API_URL}/presentismo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const respuestaJSON = await response.json();
      console.log('Respuesta del servidor:', respuestaJSON);
    } catch (error) {
      console.error('Error al enviar los datos al backend:', error);
    }
  };

  const handleStartScanning = () => {
    if (!cameraId) {
      alert("Por favor, seleccione una cámara antes de escanear.");
      return;
    }

    setIsScanning(true);

    if (readerRef.current) {
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      scannerRef.current = new Html5Qrcode(readerRef.current.id);
      scannerRef.current.start(cameraId, config, handleScanSuccess, (error) => {
        console.warn(`Error scanning QR code: ${error}`);
      }).catch((err) => {
        console.error("Error starting scanner:", err);
        alert("Error al iniciar la cámara. Por favor, asegúrese de conceder los permisos necesarios.");
        setIsScanning(false);
      });
    } else {
      console.error("QR reader element not found");
      setIsScanning(false);
    }
  };

  const handleStopScanning = () => {
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current = null;
      }).catch(err => {
        console.error("Error stopping scanner:", err);
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded">
      <div className="mb-4">
        <label className={`cursor-pointer inline-block px-4 py-2 rounded-full border-2 border-blue-950 text-white-950 font-bold transition-all duration-300 mr-2 ${
          tipo === 'entrada' ? 'bg-blue-950 text-white' : 'bg-white'
        }`}>
          <input
            type="radio"
            value="entrada"
            checked={tipo === 'entrada'}
            onChange={() => setTipo('entrada')}
            className="hidden"
          />
          Entrada
        </label>
        <label className={`cursor-pointer inline-block px-4 py-2 rounded-full border-2 border-blue-950 text-white-950 font-bold transition-all duration-300 ${
          tipo === 'salida' ? 'bg-blue-950 text-white' : 'bg-white'
        }`}>
          <input
            type="radio"
            value="salida"
            checked={tipo === 'salida'}
            onChange={() => setTipo('salida')}
            className="hidden"
          />
          Salida
        </label>
      </div>

      <div className="flex flex-col items-center justify-center text-white rounded">
        {!isScanning && cameras.length > 1 && (
          <select
            value={cameraId}
            onChange={(e) => setCameraId(e.target.value)}
            className="mb-4 p-2 border rounded text-black"
          >
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label}
              </option>
            ))}
          </select>
        )}

        <div id="qr-reader" ref={readerRef} style={{ width: "300px", display: isScanning ? 'block' : 'none' }} />

        {isScanning ? (
          <button onClick={handleStopScanning} className="mt-4 bg-red-500 text-white p-2 rounded">
            Cancelar
          </button>
        ) : (
          <button
            onClick={handleStartScanning}
            className="w-32 h-32 rounded-full justify-center"
            disabled={!cameraId}
          >
            <img src="/images/qr-code.png" alt="Escanear QR" className="w-24 h-24 object-cover rounded-full" />
          </button>
        )}
      </div>

      {scanResult && (
        <div className="mt-4 p-4 bg-white shadow rounded">
          <p>Escaneo exitoso. Datos enviados al servidor.</p>
        </div>
      )}
    </div>
  );
};

export default Presentismo;