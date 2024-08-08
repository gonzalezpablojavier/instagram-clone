import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  SelectChangeEvent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import { es } from 'date-fns/locale';
import { format, parseISO, addDays } from 'date-fns';

interface ApiResponse {
  ok: number;
  message: string;
  data: Permiso[];
}

const initialState = {
  fechaPermiso: null,
  colaboradorCubre: '',
  motivo: '',
  area: '',
  observacion: '',
  horario: '',
  autorizado: 'Evaluando',
  colaboradorID: ''
};

interface FormData {
  fechaPermiso: Date | null;
  colaboradorCubre: string;
  motivo: string;
  area: string;
  observacion: string;
  horario: string;
  autorizado: string;
  colaboradorID: string;
}

interface Permiso {
  id: number;
  fechaPermiso: string;
  colaboradorCubre: string;
  motivo: string;
  area: string;
  observacion: string;
  horario: string;
  autorizado: string;
}

const PermisoTemporal: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [historialPermisos, setHistorialPermisos] = useState<Permiso[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL;
  const areas = ['Sistemas', 'Administración', 'Depósito', 'Comercial', 'GerenciaOP', 'Contabilidad', 'Compras', 'TV', 'Gerencia'];
  const motivos = ['Personal', 'Estudio', 'Salud', 'Tramites'];

  const obtenerHistorialPermisos = useCallback(async (colaboradorID: string) => {
    try {
      const response = await axios.get<ApiResponse>(`${API_URL}/permiso-temporal/historial/${colaboradorID}?limit=10`);
      if (response.data.ok === 1 && Array.isArray(response.data.data)) {
        setHistorialPermisos(response.data.data);
      } else {
        console.error('Respuesta inesperada:', response.data);
        setHistorialPermisos([]);
      }
    } catch (error) {
      console.error('Error al obtener el historial de permisos:', error);
      setHistorialPermisos([]);
    }
  }, [API_URL]);

  useEffect(() => {
    const colaboradorID = localStorage.getItem('colaboradorID');
    if (colaboradorID) {
      setFormData((prevData) => ({ ...prevData, colaboradorID }));
      obtenerHistorialPermisos(colaboradorID);
    }
  }, [obtenerHistorialPermisos, refreshKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAreaChange = (event: SelectChangeEvent<string>) => {
    setFormData((prevData) => ({ ...prevData, area: event.target.value }));
  };

  const handleMotivoChange = (event: SelectChangeEvent<string>) => {
    setFormData((prevData) => ({ ...prevData, motivo: event.target.value }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prevData => ({
      ...prevData,
      fechaPermiso: date
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      fechaPermiso: formData.fechaPermiso?.toISOString().split('T')[0],
    };
    try {
      const response = await axios.post<Permiso>(`${API_URL}/permiso-temporal`, dataToSend);
      if (response.status === 201) {
        setRefreshKey(oldKey => oldKey + 1);
        setFormData(initialState);
        obtenerHistorialPermisos(formData.colaboradorID);
      } else {
        setError('Error al enviar la solicitud');
      }
    } catch (error) {
      setError('Error al enviar la solicitud');
      console.error(error);
    }
  };

  const adjustDate = (dateString: string) => {
    const date = parseISO(dateString);
    return addDays(date, 0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg space-y-4">
          <h1 className="text-2xl font-bold mb-4">Solicitar Permiso Temporal</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DatePicker
              label="Fecha del Permiso"
              value={formData.fechaPermiso}
              onChange={handleDateChange}
          
              slotProps={{ textField: { fullWidth: true } }}
            />
            <FormControl fullWidth>
              <InputLabel id="area-label">Área</InputLabel>
              <Select
                labelId="area-label"
                value={formData.area}
                onChange={handleAreaChange}
                label="Área"
              >
                {areas.map((area) => (
                  <MenuItem key={area} value={area}>{area}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="motivo-label">Motivo</InputLabel>
              <Select
                labelId="motivo-label"
                value={formData.motivo}
                onChange={handleMotivoChange}
                label="Motivo"
              >
                {motivos.map((motivo) => (
                  <MenuItem key={motivo} value={motivo}>{motivo}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Colaborador que cubre"
              name="colaboradorCubre"
              value={formData.colaboradorCubre}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Observación"
              name="observacion"
              value={formData.observacion}
              onChange={handleChange}
              multiline
              rows={2}
              required
            />
            <TextField
              fullWidth
              label="Horario"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Enviar Solicitud
            </Button>
          </form>
        </div>

        {/* Historial de Permisos */}
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">Historial de Permisos</h2>
          {historialPermisos.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historialPermisos.map((permiso) => (
                    <TableRow key={permiso.id}>
                      <TableCell>{format(adjustDate(permiso.fechaPermiso), 'dd/MM/yyyy')}</TableCell>
               
                      <TableCell>{permiso.motivo}</TableCell>
                      <TableCell>{permiso.autorizado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>No hay historial de permisos disponible.</p>
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default PermisoTemporal;