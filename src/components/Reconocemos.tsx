import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfYear, endOfYear } from 'date-fns';
import { es } from 'date-fns/locale';

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
  foto: string;
}

interface RankingItem {
  colaboradorID: number;
  nombre: string;
  apellido: string;
  foto: string;
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
        foto: "https://distrisuperapis.com.ar/images_rrhh/user-4250.png",
        felicitaciones,
        revisiones,
        puntaje
      };
    });

    // Filtrar solo los colaboradores con puntos positivos y ordenar
    return ranking.filter(item => item.puntaje > 0)
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

  const RankingTable = ({ ranking, title }: { ranking: RankingItem[], title: string }) => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-left">Posición</th>
              <th className="px-4 py-2 text-left">Puntaje</th>
              <th className="px-4 py-2 text-left">Colaborador</th>
              <th className="px-4 py-2 text-left">Felicitaciones</th>
              <th className="px-4 py-2 text-left">Revisiones</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((item, index) => (
              <tr key={item.colaboradorID} className={index % 2 === 0 ? 'bg-green-50' : 'bg-yellow-50'}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-bold">{item.puntaje}</td>
                <td className="px-4 py-2 flex items-center">
                  <img src={item.foto || '/images/default-avatar.png'} alt={`${item.nombre} ${item.apellido}`} className="w-10 h-10 rounded-full mr-2" />
                  {`${item.nombre} ${item.apellido}`}
                </td>
                <td className="px-4 py-2">{item.felicitaciones}</td>
                <td className="px-4 py-2">{item.revisiones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="container max-w-4xl p-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Ranking Felicitar/Revisar</h1>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
          <select
            value={añoSeleccionado}
            onChange={(e) => setAñoSeleccionado(Number(e.target.value))}
            className="mb-2 md:mb-0 p-2 border rounded"
          >
            {[...Array(5)].map((_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(Number(e.target.value))}
            className="p-2 border rounded"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i}>
                {format(new Date(2000, i, 1), 'MMMM', { locale: es })}
              </option>
            ))}
          </select>
        </div>

        <RankingTable ranking={rankingAnual} title="Top Anual" />
        <RankingTable ranking={rankingMensual} title="Top Mensual" />
      </div>
    </div>
  );
};

export default Reconocemos;