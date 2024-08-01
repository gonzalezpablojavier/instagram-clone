import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface Feedback {
  id: number;
  createdAt: string;
  normaID: string;
  tipo: string;
  colaboradorIDDestino: number;
}

interface Colaborador {
  id: string;
  nombre: string;
  apellido: string;
  area: string;
  colaboradorID: number;
}

const PanelFeedBack: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const areas = ['Sistemas', 'Administración', 'Depósito', 'Comercial', 'GerenciaOP', 'Contabilidad', 'Compras', 'TV'];
  const tipos = ['Nos comunicamos', 'revision', 'felicitacion', 'Otro'];
  const habitos = [
    'Nos orientamos al cliente', 'Comunicamos(preguntamos)', '80/20', 'Somos protagonistas',
    'Al problema solución y plazo', 'Nos ponemos objetivos', 'Agendamos', 'Confianza',
    'Actitud', 'Capacidad de trabajo', 'Conocimiento'
  ];
  
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchFeedbacks();
    fetchColaboradores();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtroArea, filtroFecha, filtroTipo, feedbacks]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${API_URL}/feedback`);
      const sortedFeedbacks = response.data.sort((a: Feedback, b: Feedback) => b.id - a.id);
      setFeedbacks(sortedFeedbacks);
    } catch (error) {
      setError('Error al obtener los feedbacks');
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
    let feedbacksFiltered = feedbacks;

    if (filtroArea) {
      feedbacksFiltered = feedbacksFiltered.filter(feedback => 
        colaboradores.find(c => c.colaboradorID === feedback.colaboradorIDDestino)?.area === filtroArea
      );
    }

    if (filtroFecha) {
      feedbacksFiltered = feedbacksFiltered.filter(feedback => 
        format(new Date(feedback.createdAt), 'yyyy-MM-dd') === filtroFecha
      );
    }

    if (filtroTipo) {
      feedbacksFiltered = feedbacksFiltered.filter(feedback => 
        feedback.tipo === filtroTipo
      );
    }

    setFilteredFeedbacks(feedbacksFiltered);
  };

  const getHabitoName = (normaID: string) => {
    const index = parseInt(normaID) - 1; // Asumiendo que normaID es un string numérico empezando desde "1"
    return habitos[index] || 'Hábito no encontrado';
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel de Felicitación/Revisión</h1>
      
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

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Todos los tipos</option>
          {tipos.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Fecha</th>
              <th className="px-4 py-2 text-left text-gray-600">Colaborador</th>
              <th className="px-4 py-2 text-left text-gray-600">Área</th>
              <th className="px-4 py-2 text-left text-gray-600">Tipo</th>
              <th className="px-4 py-2 text-left text-gray-600">Hábito</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.map((feedback) => {
              const colaborador = colaboradores.find(c => c.colaboradorID === feedback.colaboradorIDDestino);
              return (
                <tr key={feedback.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{format(new Date(feedback.createdAt), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-2">{colaborador ? `${colaborador.nombre} ${colaborador.apellido}` : 'N/A'}</td>
                  <td className="px-4 py-2">{colaborador ? colaborador.area : 'N/A'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      feedback.tipo === 'Nos comunicamos' ? 'bg-blue-200 text-blue-800' :
                      feedback.tipo === 'revision' ? ' text-red-800' :
                      feedback.tipo === 'felicitacion' ? 'text-green-900' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {feedback.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-2">{getHabitoName(feedback.normaID)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelFeedBack;