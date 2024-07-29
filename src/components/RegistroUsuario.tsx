import React, { useState, useEffect,useRef ,ChangeEvent } from 'react';
import axios from 'axios';

interface FormData {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  miFamilia: string;
  direccion: string;
  localidad: string;
  sucursal: string;
  area: string;
  cuil: string;
  foto: string;
  colaboradorID: string;
  pass: string;
  email: string;
}

const initialState: FormData = {
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
  const [formData, setFormData] = useState<FormData>(initialState);
  const [solicitudEnviada, setSolicitudEnviada] = useState<boolean>(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [colaboradorIDExiste, setColaboradorIDExiste] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const areas = ['Sistemas', 'Administración', 'Depósito', 'Comercial', 'GO','Contabilidad','Compras','TV'];
  const sucursal = ['PICO', 'MDP', 'DIMES'];
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const colaboradorID = localStorage.getItem('colaboradorID');
    if (colaboradorID) {
      setFormData((prevData) => ({ ...prevData, colaboradorID }));
      verificarColaboradorID(colaboradorID);
    }
  }, []);

  const verificarColaboradorID = async (colaboradorID: string) => {
    try {
      const response = await axios.get<{ ok: number; data: FormData }>(`${API_URL}/usuarios-registrados/${colaboradorID}`);
      if (response.data.ok === 1) {
        setFormData(response.data.data);
        setColaboradorIDExiste(true);
        if (response.data.data.foto) {
          setFotoPreview(response.data.data.foto);
        }
      } else {
        console.log('No se encontró el colaboradorID, se creará uno nuevo.');
        setColaboradorIDExiste(false);
      }
    } catch (error) {
      console.error('Error al verificar el colaboradorID:', error);
      setColaboradorIDExiste(false);
      setError('No se pudo verificar el ID del colaborador. Por favor, intenta de nuevo.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement >) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const uploadImage = async (file: File, colaboradorID: string): Promise<string> => {
    const formData = new FormData();
    formData.append('foto', file);
    formData.append('colaboradorID', colaboradorID); // Añadimos el colaboradorID al FormData
  
    try {
      const response = await axios.post<{ ok: number; message: string; data: { fotoUrl: string } }>(
        `${API_URL}/usuarios-registrados/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      if (response.data.ok !== 1) {
        throw new Error(response.data.message);
      }
  
      console.log('Imagen subida con éxito:', response.data);
      return response.data.data.fotoUrl;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error de Axios:', error.message);
        console.error('Datos de respuesta:', error.response?.data);
        console.error('Estado de respuesta:', error.response?.status);
        console.error('Cabeceras de respuesta:', error.response?.headers);
      } else {
        console.error('Error no Axios:', error);
      }
      throw error;
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFotoFile(null);
      setFotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let imageUrl = formData.foto;

      if (fotoFile && formData.colaboradorID) {
        imageUrl = await uploadImage(fotoFile, formData.colaboradorID);
      }

      const userData: FormData = {
        ...formData,
        foto: imageUrl
      };

      if (colaboradorIDExiste) {
        await axios.put(`${API_URL}/usuarios-registrados/${formData.colaboradorID}`, userData);
      } else {
        const response = await axios.post<FormData>(`${API_URL}/usuarios-registrados/create-if-not-exists/`, userData);
        setFormData(response.data);
      }

      setSolicitudEnviada(true);
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      setError('Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setSolicitudEnviada(false);
  };

  const PhotoUploadComponent = () => (
    <div className="flex flex-col items-center mb-4">
      <div 
        onClick={handleImageClick}
        className="w-24 h-24 rounded-full mb-2 cursor-pointer overflow-hidden"
      >
        {fotoPreview ? (
          <img 
            src={fotoPreview} 
            alt="Foto Preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Click para subir foto</span>
          </div>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {isUploadingPhoto && <p className="text-sm text-blue-500">Subiendo foto...</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <PhotoUploadComponent />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!solicitudEnviada ? (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-8 rounded-lg  w-full max-w-lg space-y-4">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
          </div>
       
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
                className="p-2 w-full border rounded"
                required
              />
            
          </div>
          <select
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          >
            <option value="">Seleccione un área</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <select
            name="sucursal"
            value={formData.sucursal}
            onChange={handleChange}
            className="p-2 w-full border rounded"
            required
          >
            <option value="">Seleccione una Sucursal</option>
            {sucursal.map((sucursal) => (
              <option key={sucursal} value={sucursal}>
                {sucursal}
              </option>
            ))}
          </select>
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
          {error && <p className="text-red-500">{error}</p>}
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
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