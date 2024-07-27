import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
const initialState = {
  fechaPermiso: '',
  colaboradorCubre: '',
  motivo: '',
  area:'',
  observacion: '',
  horario: '',
  autorizado: 'Evaluando',
  colaboradorID: ''
};

const PermisoTemporal: React.FC = () => {
  const [formData, setFormData] = useState(initialState);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [ultimoPermiso, setUltimoPermiso] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const areas = ['Sistemas', 'Administración', 'Depósito', 'Comercial', 'GO'];
  useEffect(() => {
    const colaboradorID = localStorage.getItem('colaboradorID');
    if (colaboradorID) {
      setFormData((prevData) => ({ ...prevData, colaboradorID }));
      verificarUltimoPermiso(colaboradorID);
    }
  }, []);

  const verificarUltimoPermiso = async (colaboradorID: string) => {
    try {
      const response = await axios.get(`${API_URL}/permiso-temporal/latest/${colaboradorID}`);
      if (response.data && response.data.autorizado === 'Evaluando') {
        setUltimoPermiso(response.data);
        setSolicitudEnviada(true);
      }
    } catch (error) {
      console.error('Error al verificar el último permiso:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos
    setSolicitudEnviada(false); // Reiniciar el estado de envío
  
    try {
      const response = await axios.post(`${API_URL}/permiso-temporal`, formData, {
        timeout: 10000, // Establecer un tiempo límite de 10 segundos
        headers: {
          'Content-Type': 'application/json',
          // Agregar aquí cualquier encabezado de autenticación necesario
        },
      });
  
      if (response.status === 201) {
        setSolicitudEnviada(true);
        setUltimoPermiso(response.data); // Asumiendo que el backend devuelve el permiso creado
        console.log('Solicitud enviada exitosamente:', response.data);
      } else {
        throw new Error(`Estado de respuesta inesperado: ${response.status}`);
      }
    } catch (error) {
      console.error('Detalles del error:', error);
  
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          // La solicitud se realizó y el servidor respondió con un código de estado
          // que cae fuera del rango de 2xx
          setError(`Error del servidor: ${axiosError.response.status} - ${axiosError.response.data}`);
        } else if (axiosError.request) {
          // La solicitud se realizó pero no se recibió respuesta
          setError('No se recibió respuesta del servidor. Por favor, intente nuevamente.');
        } else {
          // Algo ocurrió al configurar la solicitud que desencadenó un Error
          setError(`Error al configurar la solicitud: ${axiosError.message}`);
        }
      } else {
        setError('Error desconocido al enviar la solicitud');
      }
    }
     // Verificar la presentación independientemente del resultado
  await verificarUltimoPermiso(formData.colaboradorID);
};

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`${API_URL}/permiso-temporal/delete-last-evaluating/${formData.colaboradorID}`);
      if (response.status === 200) {
        setFormData(initialState);
        setSolicitudEnviada(false);
        setUltimoPermiso(null);
        setError(null);
        console.log('Solicitud eliminada');
      } else {
        setError('Error al eliminar la solicitud');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          setError('No se encontró una solicitud en evaluación para eliminar');
        } else {
          setError('Error al eliminar la solicitud');
        }
      } else {
        setError('Error de red al intentar eliminar la solicitud');
      }
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
     
      {error && <p className="text-red-500">{error}</p>}
      {!solicitudEnviada ? (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded-lg  w-full max-w-lg space-y-4">
          Fecha del Permiso:
          <input
            type="date"
            name="fechaPermiso"
            placeholder="Fecha del Permiso"
            value={formData.fechaPermiso}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
             <select
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          >
            <option value="">Seleccione un área</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="colaboradorCubre"
            placeholder="Colaborador que Cubre"
            value={formData.colaboradorCubre}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
          <input
            type="text"
            name="motivo"
            placeholder="Motivo"
            value={formData.motivo}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
          <textarea
            name="observacion"
            placeholder="Observación"
            value={formData.observacion}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
          <input
            type="text"
            name="horario"
            placeholder="Horario"
            value={formData.horario}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Enviar 
          </button>
        </form>
      ) : (
          <div className="bg-white p-8 rounded shadow-md w-80 space-y-4">
            <h3 className="text-xl mb-4">Estado de la Solicitud</h3>
            {ultimoPermiso ? (
              <>
                <p>Fecha del Permiso: {ultimoPermiso.fechaPermiso}</p>
                <p>Colaborador que Cubre: {ultimoPermiso.colaboradorCubre}</p>
                <p>Motivo: {ultimoPermiso.motivo}</p>
                <p>Observación: {ultimoPermiso.observacion}</p>
                <p>Horario: {ultimoPermiso.horario}</p>
                <p>Autorizado: {ultimoPermiso.autorizado}</p>
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-500 text-white p-2 rounded mt-4"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar Solicitud'}
                </button>
              </>
            ) : (
              <p>No hay solicitudes pendientes.</p>
            )}
          </div>
      )}
    </div>
  );
};

export default PermisoTemporal;
