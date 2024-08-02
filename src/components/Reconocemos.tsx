import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

interface RankingItem {
  colaboradorID: number;
  nombre: string;
  apellido: string;
  felicitaciones: number;
  revisiones: number;
  puntaje: number;
}

const Reconocemos: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [rankingAnual, setRankingAnual] = useState<RankingItem[]>([]);
  const [rankingMensual, setRankingMensual] = useState<RankingItem[]>([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState<number>(new Date().getFullYear());
  const [mesSeleccionado, setMesSeleccionado] = useState<number>(new Date().getMonth());
  const [error, setError] = useState<string | null>(null);
  
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchFeedbacks();
    fetchColaboradores();
  }, []);

  useEffect(() => {
    if (feedbacks.length > 0 && colaboradores.length > 0) {
      calcularRankingAnual();
      calcularRankingMensual();
    }
  }, [feedbacks, colaboradores, añoSeleccionado, mesSeleccionado]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${API_URL}/feedback`);
      setFeedbacks(response.data);
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

  const calcularRanking = (inicio: Date, fin: Date) => {
    const ranking = colaboradores.map(colaborador => {
      const feedbacksColaborador = feedbacks.filter(feedback => 
        feedback.colaboradorIDDestino === colaborador.colaboradorID &&
        new Date(feedback.createdAt) >= inicio &&
        new Date(feedback.createdAt) <= fin
      );

      const felicitaciones = feedbacksColaborador.filter(f => f.tipo === 'felicitacion').length;
      const revisiones = feedbacksColaborador.filter(f => f.tipo === 'revision').length;
      const puntaje = felicitaciones - revisiones;

      return {
        colaboradorID: colaborador.colaboradorID,
        nombre: colaborador.nombre,
        apellido: colaborador.apellido,
        felicitaciones,
        revisiones,
        puntaje
      };
    });

    // Filtrar solo los colaboradores con puntos y ordenar
    return ranking.filter(item => item.felicitaciones > 0 || item.revisiones > 0)
                  .sort((a, b) => b.puntaje - a.puntaje);
  };
  const calcularRankingAnual = () => {
    const inicio = startOfYear(new Date(añoSeleccionado, 0, 1));
    const fin = endOfYear(new Date(añoSeleccionado, 0, 1));
    setRankingAnual(calcularRanking(inicio, fin));
  };

  const calcularRankingMensual = () => {
    const inicio = new Date(añoSeleccionado, mesSeleccionado, 1);
    const fin = new Date(añoSeleccionado, mesSeleccionado + 1, 0);
    setRankingMensual(calcularRanking(inicio, fin));
  };
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold">{`${data.nombre} ${data.apellido}`}</p>
          <p>{`Puntaje: ${data.puntaje}`}</p>
          <p>{`Felicitaciones: ${data.felicitaciones}`}</p>
          <p>{`Revisiones: ${data.revisiones}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Ranking de Feedback</h1>
      
    

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Top 10 Anual</h2>
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Posición</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Felicitaciones</th>
              <th className="px-4 py-2 text-left">Revisiones</th>
              <th className="px-4 py-2 text-left">Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {rankingAnual.slice(0, 10).map((item, index) => (
              <tr key={item.colaboradorID} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{`${item.nombre} ${item.apellido}`}</td>
                <td className="px-4 py-2">{item.felicitaciones}</td>
                <td className="px-4 py-2">{item.revisiones}</td>
                <td className="px-4 py-2">{item.puntaje}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reconocemos;