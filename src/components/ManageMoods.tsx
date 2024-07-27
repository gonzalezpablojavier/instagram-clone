import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface Mood {
  id: number;
  mood: string;
  date: string;
  colaboradorID: number;
}

interface Colaborador {
  id: string;
  area: string;
  apellido: string;
  nombre: string;
  colaboradorID: number;
}

const ManageMoods: React.FC = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [filteredMoods, setFilteredMoods] = useState<Mood[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const areas = ['Sistemas', 'Administración', 'Depósito', 'Comercial', 'GO'];
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchMoods();
    fetchColaboradores();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtroArea, filtroFecha, moods, colaboradores]);

  const fetchMoods = async () => {
    try {
      const response = await axios.get(`${API_URL}/howareyou`);
      setMoods(response.data);
    } catch (error) {
      setError('Error al obtener los estados de ánimo');
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
    let moodsFiltered = moods;

    if (filtroArea) {
      moodsFiltered = moodsFiltered.filter(mood => 
        colaboradores.find(c => c.colaboradorID === mood.colaboradorID)?.area === filtroArea
      );
    }

    if (filtroFecha) {
      moodsFiltered = moodsFiltered.filter(mood => 
        mood.date.split('T')[0] === filtroFecha
      );
    }

    setFilteredMoods(moodsFiltered);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel ¿Cómo estás Hoy?</h1>
      
      {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>}
      
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={filtroArea}
          onChange={(e) => setFiltroArea(e.target.value)}
          className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
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
              <th className="px-4 py-2 text-left text-gray-600">Fecha</th>
              <th className="px-4 py-2 text-left text-gray-600">Colaborador</th>        
              <th className="px-4 py-2 text-left text-gray-600">Área</th>  
              <th className="px-4 py-2 text-left text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredMoods.map((mood) => {
              const colaborador = colaboradores.find(c => c.colaboradorID === mood.colaboradorID);
              return (
                <tr key={mood.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{format(new Date(mood.date), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-2">{colaborador ? `${colaborador.nombre} ${colaborador.apellido}` : 'N/A'}</td> 
                  <td className="px-4 py-2">{colaborador ? colaborador.area : 'N/A'}</td>
                  <td className="px-4 py-2">{mood.mood}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMoods;