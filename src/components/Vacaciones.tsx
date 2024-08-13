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
  Box, 
  SelectChangeEvent, 
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

interface FormData {
  fechaPermisoDesde: Date | null;
  fechaPermisoHasta: Date | null;
  colaboradorCubre: string;
  motivo: string;
  observacion: string;
  autorizado: string;
  colaboradorID: string;
  area: string;
}

interface Vacacion {
  id: number;
  fechaPermisoDesde: string;
  fechaPermisoHasta: string;
  colaboradorCubre: string;
  area: string;
  autorizado: string;
}

const Vacaciones: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fechaPermisoDesde: null,
    fechaPermisoHasta: null,
    colaboradorCubre: '',
    motivo: '',
    observacion: '',
    autorizado: 'Evaluando',
    colaboradorID: '',
    area: '',
  });
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [ultimaVacacion, setUltimaVacacion] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [validationMessage, setValidationMessage] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [historialVacaciones, setHistorialVacaciones] = useState<Vacacion[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL;
  const areas = ['Sistemas', 'Administración', 'Depósito', 'Comercial', 'GerenciaOP', 'Contabilidad', 'Compras', 'TV', 'Gerencia'];

  const obtenerHistorialVacaciones = useCallback(async (colaboradorID: string) => {
    try {
      const response = await axios.get<{ ok: number; data: Vacacion[] }>(`${API_URL}/vacaciones/historial/${colaboradorID}?limit=10`);
      if (response.data.ok === 1 && Array.isArray(response.data.data)) {
        setHistorialVacaciones(response.data.data);
      } else {
        console.error('Respuesta inesperada:', response.data);
        setHistorialVacaciones([]);
      }
    } catch (error) {
      console.error('Error al obtener el historial de vacaciones:', error);
      setHistorialVacaciones([]);
    }
  }, [API_URL]);

  useEffect(() => {
    const colaboradorID = localStorage.getItem('colaboradorID');
    if (colaboradorID) {
      setFormData((prevData) => ({ ...prevData, colaboradorID }));
      verificarUltimaVacacion(colaboradorID);
      obtenerHistorialVacaciones(colaboradorID);
    }
  }, [obtenerHistorialVacaciones, refreshKey]);

  const verificarUltimaVacacion = async (colaboradorID: string) => {
    try {
      const response = await axios.get(`${API_URL}/vacaciones/latest/${colaboradorID}`);
      if (response.data && response.data.autorizado === 'Evaluando') {
        setUltimaVacacion(response.data);
        setSolicitudEnviada(true);
      }
    } catch (error) {
      console.error('Error al verificar la última solicitud de vacaciones:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAreaChange = (event: SelectChangeEvent<string>) => {
    setFormData((prevData) => ({ ...prevData, area: event.target.value }));
  };

  const handleDateChange = (field: 'fechaPermisoDesde' | 'fechaPermisoHasta') => (date: Date | null) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: date
    }));
  };

  const verificarFechasDisponibles = async () => {
    if (!formData.fechaPermisoDesde || !formData.fechaPermisoHasta || !formData.area) {
      setValidationMessage({ type: 'error', message: 'Por favor, complete todos los campos antes de verificar.' });
      return false;
    }

    try {
      const response = await axios.get(`${API_URL}/vacaciones/verificar`, {
        params: {
          fechaDesde: formData.fechaPermisoDesde.toISOString(),
          fechaHasta: formData.fechaPermisoHasta.toISOString(),
          area: formData.area,
          colaboradorID: formData.colaboradorID
        }
      });

      if (response.data.disponible) {
        setValidationMessage({ type: 'success', message: 'Las fechas están disponibles.' });
        return true;
      } else {
        setValidationMessage({ type: 'error', message: 'Las fechas seleccionadas se solapan con las vacaciones de otro colaborador del mismo área.' });
        return false;
      }
    } catch (error) {
      console.error('Error al verificar las fechas:', error);
      setValidationMessage({ type: 'error', message: 'Error al verificar las fechas. Por favor, inténtelo de nuevo.' });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fechasDisponibles = await verificarFechasDisponibles();
    if (!fechasDisponibles) {
      return;
    }

    const dataToSend = {
      ...formData,
      fechaPermisoDesde: formData.fechaPermisoDesde ? new Date(formData.fechaPermisoDesde).toISOString() : null,
      fechaPermisoHasta: formData.fechaPermisoHasta ? new Date(formData.fechaPermisoHasta).toISOString() : null,
    };
    try {
      const response = await axios.post(`${API_URL}/vacaciones`, dataToSend);
      if (response.status === 201) {
        setSolicitudEnviada(true);
        setUltimaVacacion(response.data);
        setValidationMessage(null);
        setRefreshKey(oldKey => oldKey + 1); // Refresh historial
      } else {
        setError('Error al enviar la solicitud');
      }
    } catch (error) {
      setError('Error al enviar la solicitud');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`${API_URL}/vacaciones/delete-last-evaluating/${formData.colaboradorID}`);
      if (response.status === 200) {
        setFormData({ ...formData, fechaPermisoDesde: null, fechaPermisoHasta: null, colaboradorCubre: '', motivo: '', observacion: '', autorizado: 'Evaluando' });
        setSolicitudEnviada(false);
        setUltimaVacacion(null);
        setError(null);
        setValidationMessage(null);
        setRefreshKey(oldKey => oldKey + 1); // Refresh historial
        console.log('Solicitud eliminada');
      } else {
        setError('Error al eliminar la solicitud');
      }
    } catch (error) {
      setError('Error al eliminar la solicitud');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        {validationMessage && (
          <Alert severity={validationMessage.type} className="mb-4">
            {validationMessage.message}
          </Alert>
        )}
        
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg space-y-4">
            <h1 className="text-2xl font-bold mb-4">Mis Vacaciones</h1>
            <Box className="flex flex-col space-y-4">
              <DatePicker
                label="Fecha de inicio"
                value={formData.fechaPermisoDesde}
                onChange={handleDateChange('fechaPermisoDesde')}
              />
              <DatePicker
                label="Fecha de fin"
                value={formData.fechaPermisoHasta}
                onChange={handleDateChange('fechaPermisoHasta')}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel id="area-label">Área</InputLabel>
              <Select
                labelId="area-label"
                value={formData.area}
                onChange={handleAreaChange}
                label="Área"
              >
                {areas.map((area) => (
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
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
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Enviar Solicitud
            </Button>
          </form>
     

        {/* Historial de Vacaciones */}
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">Historial de Vacaciones</h2>
          {historialVacaciones.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Desde</TableCell>
                    <TableCell>Hasta</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historialVacaciones.map((vacacion) => (
                    <TableRow key={vacacion.id}>
                      <TableCell>{format(new Date(vacacion.fechaPermisoDesde), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{format(new Date(vacacion.fechaPermisoHasta), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{vacacion.autorizado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p>No hay historial de vacaciones disponible.</p>
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Vacaciones;