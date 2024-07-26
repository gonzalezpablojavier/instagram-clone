import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Presentismo: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [colaboradorID, setColaboradorID] = useState<string | null>(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const [tipo, setTipo] = useState<'entrada' | 'salida'>('entrada');

  useEffect(() => {
    const storedColaboradorID = localStorage.getItem('colaboradorID');
    if (storedColaboradorID) {
      setColaboradorID(storedColaboradorID);
    }
  }, []);

  const handleScanSuccess = (decodedText: string) => {
    setScanResult(decodedText);
    alert('Presente marcado correctamente');
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    } 
    enviarDatosAlBackend(decodedText);
  };

  const enviarDatosAlBackend = async (decodedText: string) => {
    // Aquí puedes extraer o manipular los datos de decodedText si es necesario
    const colaboradorID =localStorage.getItem('colaboradorID') ; // Puedes ajustar esto según tus necesidades
  
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
  <div className="mb-4" >
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
        <label  className={`cursor-pointer inline-block px-4 py-2 rounded-full border-2 border-blue-950 text-white-950 font-bold transition-all duration-300 ${
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
  
<div className=" flex flex-col items-center items-center justify-center text-white rounded">     
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
          className="w-32 h-32 rounded-full justify-center">
            <img src="/images/qr-code.png" alt="Perfil" className="w-24 h-24 object-cover rounded-full "/>    
        </button>
      )}
      </div>
 
          </div>
      {scanResult && (
        <div className="mt-4 p-4 bg-white shadow rounded">
 
        </div>
      )}
    </div>
  );
};

export default Presentismo;
