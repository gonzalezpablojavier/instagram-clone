import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Mood {
  id: string;
  colaboradorID: string;
  mood: string;
  date: string;
  colaboradorNombre:string;

}

const ManageMoods: React.FC = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [filteredMoods, setFilteredMoods] = useState<Mood[]>([]);
  const [colaboradorID, setColaboradorID] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('');
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await axios.get(`${API_URL}/howareyou`);
        setMoods(response.data);
        setFilteredMoods(response.data);
      } catch (error) {
        console.error('Error al obtener los estados de ánimo:', error);
      }
    };

    fetchMoods();
  }, []);

  const handleFilter = () => {
    let filtered = moods;

    if (colaboradorID) {
      filtered = filtered.filter(mood => mood.colaboradorID.includes(colaboradorID));
    }

    if (date) {
      filtered = filtered.filter(mood => mood.date.includes(date));
    }

    if (stateFilter) {
      filtered = filtered.filter(mood => mood.mood.includes(stateFilter));
    }

    setFilteredMoods(filtered);
  };

  const resetFilters = () => {
    setColaboradorID('');
    setDate('');
    setStateFilter('');
    setFilteredMoods(moods);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl mb-4">Administrar Estados de Ánimo</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Colaborador ID"
          value={colaboradorID}
          onChange={(e) => setColaboradorID(e.target.value)}
          className="p-2 border rounded mb-2"
        />
        <input
          type="date"
          placeholder="Fecha"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded mb-2"
        />
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="p-2 border rounded mb-2"
        >
          <option value="">Todos los estados</option>
          <option value="super">Super</option>
          <option value="contento">Contento</option>
          <option value="triste">Triste</option>
          <option value="enojado">Enojado</option>
          <option value="no quiero decirlo">No quiero decirlo</option>
        </select>
        <div className="flex space-x-4">
          <button onClick={handleFilter} className="bg-blue-500 text-white p-2 rounded">Filtrar</button>
          <button onClick={resetFilters} className="bg-gray-500 text-white p-2 rounded">Resetear Filtros</button>
        </div>
      </div>
      <div className="w-full">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
         
              <th className="py-2 px-4 border">Nombre del Colaborador</th> {/* Añadir esta columna */}
              <th className="py-2 px-4 border">Estado</th>
              <th className="py-2 px-4 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredMoods.map((mood) => (
              <tr key={mood.id}>
                
                <td className="py-2 px-4 border">{mood.colaboradorNombre} </td> {/* Añadir esta celda */}
                <td className="py-2 px-4 border">{mood.mood}</td>
                <td className="py-2 px-4 border">{mood.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMoods;
