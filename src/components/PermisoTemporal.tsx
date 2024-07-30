import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, SelectChangeEvent } from '@mui/material';
import { es } from 'date-fns/locale';

const PermisoTemporal: React.FC = () => {
  const [formData, setFormData] = useState({
    fechaPermiso: null as Date | null,
    colaboradorCubre: '',
    motivo: '',
    area: '',
    observacion: '',
    horario: '',
    autorizado: 'Evaluando',
    colaboradorID: ''
  });
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [ultimoPermiso, setUltimoPermiso] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  const areas = ['Sistemas', 'Administración', 'Depósito', 'Comercial', 'GerenciaOP','Contabilidad','Compras','TV'];
  const motivos = ['Personal', 'Estudio', 'Salud', 'Tramites'];

  useEffect(() => {
    const colaboradorID = localStorage.getItem('colaboradorID');
    if (colaboradorID) {
      setFormData((prevData) => ({ ...prevData, colaboradorID }));
      verificarUltimoPermiso(colaboradorID);
    }
  }, []);

  const verificarUltimoPermiso = async (colaboradorID: string) => {
    try {
      const response = await axios.get(`${API_URL}/permiso-temporal/latest/${colaboradorID}`);
      if (response.data && response.data.autorizado === 'Evaluando') {
        setUltimoPermiso(response.data);
        setSolicitudEnviada(true);
      }
    } catch (error) {
      console.error('Error al verificar el último permiso temporal:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAreaChange = (event: SelectChangeEvent<string>) => {
    setFormData((prevData) => ({ ...prevData, area: event.target.value }));
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
      const response = await axios.post(`${API_URL}/permiso-temporal`, dataToSend);
      if (response.status === 201) {
        setSolicitudEnviada(true);
        setUltimoPermiso(response.data);
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
      const response = await axios.delete(`${API_URL}/permiso-temporal/delete-last-evaluating/${formData.colaboradorID}`);
      if (response.status === 200) {
        setFormData({ ...formData, fechaPermiso: null, colaboradorCubre: '', motivo: '', observacion: '', horario: '', autorizado: 'Evaluando' });
        setSolicitudEnviada(false);
        setUltimoPermiso(null);
        setError(null);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Mi Permiso</h1>
        {error && <p className="text-red-500">{error}</p>}
        {!solicitudEnviada ? (
          <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-lg space-y-4">
            <DatePicker
              label="Fecha del Permiso"
              value={formData.fechaPermiso}
              onChange={handleDateChange}
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
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="motivo-label">Motivo</InputLabel>
              <Select
                labelId="motivo-label"
                value={formData.motivo}
                onChange={handleAreaChange}
                label="Motivo"
              >
                {motivos.map((motivo) => (
                  <MenuItem key={motivo} value={motivo}>
                    {motivo}
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
          
            <TextField
              fullWidth
              label="Observación"
              name="observacion"
              value={formData.observacion}
              onChange={handleChange}
              multiline
              rows={4}
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
        ) : (
          <div className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4">
            <h3 className="text-xl font-semibold mb-4">Estado de la Solicitud</h3>
            {ultimoPermiso && (
              <>
                <p><span className="font-medium">Fecha del Permiso:</span> {ultimoPermiso.fechaPermiso}</p>
                <p><span className="font-medium">Área:</span> {ultimoPermiso.area}</p>
                <p><span className="font-medium">Colaborador que cubre:</span> {ultimoPermiso.colaboradorCubre}</p>
                <p><span className="font-medium">Motivo:</span> {ultimoPermiso.motivo}</p>
                <p><span className="font-medium">Observación:</span> {ultimoPermiso.observacion}</p>
                <p><span className="font-medium">Horario:</span> {ultimoPermiso.horario}</p>
                <p><span className="font-medium">Estado:</span> {ultimoPermiso.autorizado}</p>
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar Solicitud'}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default PermisoTemporal;