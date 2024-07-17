// src/components/PermisoTemporal.tsx
import React, { useState } from 'react';

const initialState = {
  fechaPermiso: '',
  colaboradorCubre: '',
  motivo: '',
  observacion: '',
  horario: '',
  autorizado: 'Evaluando',
};

const PermisoTemporal: React.FC = () => {
  const [formData, setFormData] = useState(initialState);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Solicitud enviada:', formData);
    setSolicitudEnviada(true);
    // Aquí puedes agregar la lógica para enviar los datos al servidor y actualizar el estado de autorización
  };

  const handleDelete = () => {
    setFormData(initialState);
    setSolicitudEnviada(false);
    console.log('Solicitud eliminada');
    // Aquí puedes agregar la lógica para eliminar la solicitud del servidor
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl mb-4">Solicitud de Permiso Temporal</h2>
      {!solicitudEnviada ? (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80 space-y-4">
          <input
            type="date"
            name="fechaPermiso"
            placeholder="Fecha del Permiso"
            value={formData.fechaPermiso}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
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
            Enviar Solicitud
          </button>
        </form>
      ) : (
        <div className="bg-white p-8 rounded shadow-md w-80 space-y-4">
          <h3 className="text-xl mb-4">Estado de la Solicitud</h3>
          <p>Fecha del Permiso: {formData.fechaPermiso}</p>
          <p>Colaborador que Cubre: {formData.colaboradorCubre}</p>
          <p>Motivo: {formData.motivo}</p>
          <p>Observación: {formData.observacion}</p>
          <p>Horario: {formData.horario}</p>
          <p>Autorizado: {formData.autorizado}</p>
          <button
            onClick={handleDelete}
            className="w-full bg-red-500 text-white p-2 rounded mt-4"
          >
            Eliminar Solicitud
          </button>
        </div>
      )}
    </div>
  );
};

export default PermisoTemporal;
