import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, isValid, parseISO,differenceInDays } from 'date-fns';

interface Vacaciones {
  id: number;
  fechaPermisoDesde: string;
  fechaPermisoHasta: string;
  diasTotales: number;
  autorizado: string;
  colaboradorID: number;
  vacacionesPendientes:number;
  diasCorresponden:number;
  diasDisponibles:number;
  
  
}

interface Colaborador {
  id: string;
  nombre: string;
  apellido: string;
  area: string;
  colaboradorID: number;
}

const PanelAdminVacaciones: React.FC = () => {
  const [vacaciones, setVacaciones] = useState<Vacaciones[]>([]);
  const [filteredVacaciones, setFilteredVacaciones] = useState<Vacaciones[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const areas = ['Sistemas', 'Administración', 'Depósito', 'Comercial', 'GerenciaOP', 'Contabilidad', 'Compras', 'TV'];
  
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchVacaciones();
    fetchColaboradores();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtroArea, filtroFecha, vacaciones]);

  const fetchVacaciones = async () => {
    try {
      const response = await axios.get(`${API_URL}/vacaciones`);
      const sortedVacaciones = response.data.sort((a: Vacaciones, b: Vacaciones) => b.id - a.id);
      setVacaciones(sortedVacaciones);
    } catch (error) {
      setError('Error al obtener las vacaciones');
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
    let vacacionesFiltered = vacaciones;

    if (filtroArea) {
      vacacionesFiltered = vacacionesFiltered.filter(vacacion => 
        colaboradores.find(c => c.colaboradorID === vacacion.colaboradorID)?.area === filtroArea
      );
    }

    if (filtroFecha) {
      vacacionesFiltered = vacacionesFiltered.filter(vacacion => {
        const fechaInicio = parseISO(vacacion.fechaPermisoDesde);
        const fechaFin = parseISO(vacacion.fechaPermisoHasta);
        const fechaFiltro = parseISO(filtroFecha);
        return isValid(fechaInicio) && isValid(fechaFin) && isValid(fechaFiltro) &&
               fechaFiltro >= fechaInicio && fechaFiltro <= fechaFin;
      });
    }

    setFilteredVacaciones(vacacionesFiltered);
  };

  const handleApprove = async (id: number) => {
    try {
      await axios.put(`${API_URL}/vacaciones/${id}`, { autorizado: 'Aprobado' });



       // Obtener los detalles de la vacación aprobada
       const vacacionAprobada = vacaciones.find(v => v.id === id);
       if (!vacacionAprobada) {
         throw new Error('No se encontró la vacación aprobada');
       }
        // Obtener los detalles del colaborador
      const colaborador = colaboradores.find(c => c.colaboradorID === vacacionAprobada.colaboradorID);
      if (!colaborador) {
          throw new Error('No se encontró el colaborador');
      }

      // Enviar solicitud para crear evento en Google Calendar
      await axios.post(`${API_URL}/create-calendar-event`, {
       summary: `Vacaciones de ${colaborador.nombre} ${colaborador.apellido}`,
      description: `Vacaciones aprobadas para ${colaborador.nombre} ${colaborador.apellido} del área de ${colaborador.area}`,
      start: vacacionAprobada.fechaPermisoDesde,
      end: vacacionAprobada.fechaPermisoHasta,
      colaboradorId: colaborador.colaboradorID
});


      fetchVacaciones();
    } catch (error) {
      setError('Error al aprobar las vacaciones');
      console.error(error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.put(`${API_URL}/vacaciones/${id}`, { autorizado: 'Rechazado' });
      fetchVacaciones();
    } catch (error) {
      setError('Error al rechazar las vacaciones');
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha no disponible';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'dd/MM/yyyy') : 'Fecha inválida';
  };

  const calcularVacacionesPendientes = (vacacion: Vacaciones):number|'N/A' => {
    try {
     
      return vacacion.vacacionesPendientes; // +1 para incluir el día de inicio
      
    } catch (error) {
      console.error('Error al calcular los días totales:', error);
      return 'N/A';
    }
  };

  const calcularDiasCorresponen = (vacacion: Vacaciones):number|'N/A' => {
    try {
     
      return vacacion.diasCorresponden; // +1 para incluir el día de inicio
      
    } catch (error) {
      console.error('Error al calcular los días totales:', error);
      return 'N/A';
    }
  };
  const calcularDiasDisponibles = (vacacion: Vacaciones):number|'N/A' => {
    const diasTotales = calcularDiasTotales(vacacion.fechaPermisoDesde, vacacion.fechaPermisoHasta);
  
  if (diasTotales === 'N/A' || typeof vacacion.diasDisponibles !== 'number') {
    return 'N/A';
  }

  if (vacacion.autorizado === 'Aprobado') {
    return  diasTotales;
  } else {
    return 0;
  }
  };

  const calcularDiasTotales = (fechaInicio: string, fechaFin: string):number|'N/A' => {
    try {
      const inicio = parseISO(fechaInicio);
      const fin = parseISO(fechaFin);
      if (!isValid(inicio) || !isValid(fin)) {
        return 'N/A';
      }
      return differenceInDays(fin, inicio) + 1; // +1 para incluir el día de inicio
    } catch (error) {
      console.error('Error al calcular los días totales:', error);
      return 'N/A';
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel de Vacaciones</h1>
      
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
              <th className="px-4 py-2 text-left text-gray-600">Acciones</th>
              <th className="px-4 py-2 text-left text-gray-600">Colaborador</th>
              <th className="px-4 py-2 text-left text-gray-600">Área</th>
              <th className="px-4 py-2 text-left text-gray-600">Inicio</th>
              <th className="px-4 py-2 text-left text-gray-600">Fin</th>
              <th className="px-4 py-2 text-left text-gray-600">Pedido(Días)</th>
              <th className="px-4 py-2 text-left text-gray-600">Corresponden</th>

              <th className="px-4 py-2 text-left text-gray-600">Vac Pend</th>


              <th className="px-4 py-2 text-left text-gray-600">Tomados</th>
              
              <th className="px-4 py-2 text-left text-gray-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredVacaciones.map((vacacion) => {
              const colaborador = colaboradores.find(c => c.colaboradorID === vacacion.colaboradorID);
              return (
                <tr key={vacacion.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {vacacion.autorizado === 'Evaluando' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(vacacion.id)}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm transition duration-300"
                        >
                          SI
                        </button>
                        <button
                          onClick={() => handleReject(vacacion.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition duration-300"
                        >
                          NO
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">{colaborador ? `${colaborador.nombre} ${colaborador.apellido}` : 'N/A'}</td>
                  <td className="px-4 py-2">{colaborador ? colaborador.area : 'N/A'}</td>
                  <td className="px-4 py-2">{formatDate(vacacion.fechaPermisoDesde)}</td>
                  <td className="px-4 py-2">{formatDate(vacacion.fechaPermisoHasta)}</td>
                  <td className="px-4 py-2">{calcularDiasTotales(vacacion.fechaPermisoDesde, vacacion.fechaPermisoHasta)}</td>
                  <td className="px-4 py-2">{calcularDiasCorresponen(vacacion)}</td>
               
                  <td className="px-4 py-2">{calcularVacacionesPendientes(vacacion)}</td>
                   <td className="px-4 py-2">{calcularDiasDisponibles(vacacion)}</td>
                  
              
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      vacacion.autorizado === 'Aprobado' ? 'bg-green-200 text-green-800' :
                      vacacion.autorizado === 'Rechazado' ? 'bg-red-200 text-red-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {vacacion.autorizado}
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

export default PanelAdminVacaciones;