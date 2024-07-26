import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface Permiso {
  id: number;
  fechaPermiso: string;
  colaboradorCubre: string;
  motivo: string;
  observacion: string;
  horario: string;
  autorizado: string;
  colaboradorID: number;
  // Añade aquí más campos si son necesarios
}

interface Colaborador {
  id: string;
  nombre: string;
  apellido: string;
  area: string;
  colaboradorID: number;
  // Añade aquí más campos si son necesarios
}

const AdminPermisosTemporal: React.FC = () => {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [filteredPermisos, setFilteredPermisos] = useState<Permiso[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroColaborador, setFiltroColaborador] = useState('');
  const [error, setError] = useState<string | null>(null);
  const areas = ['Sistemas', 'Administración', 'Depósito', 'Comercial', 'GO'];
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchPermisos();
    fetchColaboradores();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtroArea, filtroFecha, filtroColaborador, permisos]);

  const fetchPermisos = async () => {
    try {
      const response = await axios.get(`${API_URL}/permiso-temporal`);
      setPermisos(response.data);
    } catch (error) {
      setError('Error al obtener los permisos');
      console.error(error);
    }
  };

  const fetchColaboradores = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios-registrados`);
      if (response.data.ok === 1 && Array.isArray(response.data.data)) {
        setColaboradores(response.data.data);
      } else {
        console.error('La respuesta de colaboradores no es válida:', response.data);
        setColaboradores([]);
      }
    } catch (error) {
      console.error('Error al obtener los colaboradores:', error);
      setError('Error al obtener los colaboradores');
      setColaboradores([]);
    }
  };

  const aplicarFiltros = () => {
    let permisosFiltered = permisos;

    if (filtroArea) {
      permisosFiltered = permisosFiltered.filter(permiso => 
        colaboradores.find(c => c.colaboradorID === permiso.colaboradorID)?.area === filtroArea
      );
    }

    if (filtroFecha) {
      permisosFiltered = permisosFiltered.filter(permiso => 
        permiso.fechaPermiso === filtroFecha
      );
    }

 

    setFilteredPermisos(permisosFiltered);
  };

  const handleApprove = async (id: number) => {
    try {
      await axios.put(`${API_URL}/permiso-temporal/${id}`, { autorizado: 'Aprobado' });
      fetchPermisos();
    } catch (error) {
      setError('Error al aprobar el permiso');
      console.error(error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.put(`${API_URL}/permiso-temporal/${id}`, { autorizado: 'Rechazado' });
      fetchPermisos();
    } catch (error) {
      setError('Error al rechazar el permiso');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Permisos Temporales</h1>
      
      {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>}
      
      <div className="mb-6 flex flex-wrap gap-4">

      <select
          value={filtroArea}
          onChange={(e) => setFiltroArea(e.target.value)}
          className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"        >
         <option value="">Todas las áreas</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>

    
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
     
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Acciones</th>
              <th className="px-4 py-2 text-left text-gray-600">Fecha</th>
              <th className="px-4 py-2 text-left text-gray-600">Colaborador</th>
              <th className="px-4 py-2 text-left text-gray-600">Motivo</th>
              <th className="px-4 py-2 text-left text-gray-600">Area</th>  
              <th className="px-4 py-2 text-left text-gray-600">Estado</th>
            
            </tr>
          </thead>
          <tbody>
            {filteredPermisos.map((permiso) => {
              const colaborador = colaboradores.find(c => c.colaboradorID === permiso.colaboradorID);
              return (
                <tr key={permiso.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">
                    {permiso.autorizado === 'Evaluando' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(permiso.id)}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm transition duration-300"
                        >
                          SI
                        </button>
                        <button
                          onClick={() => handleReject(permiso.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition duration-300"
                        >
                          NO
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">{format(new Date(permiso.fechaPermiso), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-2">{colaborador ? `${colaborador.nombre} ${colaborador.apellido}` : 'N/A'}</td>
                   
                  <td className="px-4 py-2">{permiso.motivo}</td>
                  <td className="px-4 py-2">{colaborador ? `${colaborador.area}` : 'N/A'}</td>
             
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      permiso.autorizado === 'Aprobado' ? 'bg-green-200 text-green-800' :
                      permiso.autorizado === 'Rechazado' ? 'bg-red-200 text-red-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {permiso.autorizado}
                    </span>
                  </td>
              
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPermisosTemporal;