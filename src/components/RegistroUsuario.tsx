// src/components/RegistroUsuario.tsx
import React, { useState } from 'react';

const RegistroUsuario: React.FC = () => {
  const [formData, setFormData] = useState({
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
    usuario: '',
    pass: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Aquí puedes agregar la lógica para enviar los datos al servidor
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80 space-y-4">
        <h2 className="text-2xl mb-4">Registro de Usuario</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="p-2 w-full border rounded"
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
        <input
          type="date"
          name="fechaNacimiento"
          placeholder="Fecha de Nacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          className="p-2 w-full border rounded"
          required
        />
        <textarea
          name="miFamilia"
          placeholder="Mi Familia"
          value={formData.miFamilia}
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
        <input
          type="text"
          name="localidad"
          placeholder="Localidad"
          value={formData.localidad}
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
          name="cuil"
          placeholder="CUIL"
          value={formData.cuil}
          onChange={handleChange}
          className="p-2 w-full border rounded"
          required
        />
        <input
          type="text"
          name="foto"
          placeholder="Foto (URL)"
          value={formData.foto}
          onChange={handleChange}
          className="p-2 w-full border rounded"
          required
        />
        <input
          type="text"
          name="usuario"
          placeholder="Usuario"
          value={formData.usuario}
          onChange={handleChange}
          className="p-2 w-full border rounded"
          required
        />
        <input
          type="password"
          name="pass"
          placeholder="Contraseña"
          value={formData.pass}
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
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default RegistroUsuario;
