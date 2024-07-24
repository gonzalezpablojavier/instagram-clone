import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialState = {
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  miFamilia: '',
  direccion: '',
  localidad: '',
  sucursal: '',
  area: '',
  cuil: '',
  foto: '',
  colaboradorID: '',
  pass: '',
  email: '',
};

const RegistroUsuario: React.FC = () => {
  const [formData, setFormData] = useState(initialState);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [colaboradorIDExiste, setColaboradorIDExiste] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const colaboradorID = localStorage.getItem('colaboradorID');
    if (colaboradorID) {
      setFormData((prevData) => ({ ...prevData, colaboradorID }));
      verificarColaboradorID(colaboradorID);
    }
  }, []);

  const verificarColaboradorID = async (colaboradorID: string) => {
    try {
      const response = await axios.get(`${API_URL}/usuarios-registrados/${colaboradorID}`);
      if (response.data.ok === 1) {
        setFormData(response.data.data);
        setColaboradorIDExiste(true);
      } else {
        console.log('No se encontró el colaboradorID, se creará uno nuevo.');
        setColaboradorIDExiste(false);
      }
    } catch (error) {
      console.error('Error al verificar el colaboradorID:', error);
      setColaboradorIDExiste(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, foto: reader.result as string }));
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (colaboradorIDExiste) {
        await axios.put(`${API_URL}/usuarios-registrados/${formData.colaboradorID}`, formData);
      } else {
        await axios.post(`${API_URL}/usuarios-registrados/create-if-not-exists/`, formData);
      }
      setSolicitudEnviada(true);
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };

  const handleEdit = () => {
    setSolicitudEnviada(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    
      {!solicitudEnviada ? (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded-lg  w-full max-w-lg space-y-4">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              {fotoPreview ? (
                <img src={fotoPreview} alt="Foto Preview" className="w-24 h-24 object-cover rounded-full mb-2" />
              ) : (
                <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-full mb-2">
                  <span className="text-gray-500">subir foto</span>
                </div>
              )}
              <input type="file" name="foto" accept="image/*" onChange={handleFileChange} className="text-xs" />
            </div>
            <div className="ml-4 flex flex-col space-y-2 rounded-lg">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </div>
          </div>
          <input
            type="text"
            name="area"
            placeholder="Área"
            value={formData.area}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
          <input
            type="text"
            name="sucursal"
            placeholder="Sucursal"
            value={formData.sucursal}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
          <input
            type="date"
            name="fechaNacimiento"
            placeholder="Cumpleaños"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
          <input
            type="text"
            name="cuil"
            placeholder="DNI"
            value={formData.cuil}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
          <textarea
            name="miFamilia"
            placeholder="Más sobre mi"
            value={formData.miFamilia}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Enviar
          </button>
        </form>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg space-y-4">
          <h3 className="text-xl mb-4">Datos del Registro</h3>
          <p><strong>Nombre:</strong> {formData.nombre}</p>
          <p><strong>Apellido:</strong> {formData.apellido}</p>
          <p><strong>Fecha de Nacimiento:</strong> {formData.fechaNacimiento}</p>
          <p><strong>Mi Familia:</strong> {formData.miFamilia}</p>
          <p><strong>Dirección:</strong> {formData.direccion}</p>
          <p><strong>Localidad:</strong> {formData.localidad}</p>
          <p><strong>Sucursal:</strong> {formData.sucursal}</p>
          <p><strong>Área:</strong> {formData.area}</p>
          <p><strong>CUIL:</strong> {formData.cuil}</p>
          {formData.foto && (
            <div className="flex justify-center mb-4">
              <img src={formData.foto} alt="Foto" className="w-32 h-32 object-cover rounded-full" />
            </div>
          )}
          <p><strong>Email:</strong> {formData.email}</p>
          <button
            onClick={handleEdit}
            className="w-full bg-yellow-500 text-white p-2 rounded mt-4"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );
};

export default RegistroUsuario;
