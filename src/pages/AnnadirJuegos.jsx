import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './AnnadirJuegos.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { annadirJuego, editarJuego } from '../peticiones/juego_peticiones.mjs';

const AnnadirJuego = () => {
  const location = useLocation();
  const juegoExistente = location.state?.juego;

  const [formData, setFormData] = useState(juegoExistente || {
    nombre: '',
    descripcion: '',
    banner: '',
    foto_juego: '',
    dispositivos: '',
    categoria: '',
    rangos: [{ nombre: '', puntos: '' }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRangoChange = (index, field, value) => {
    const nuevosRangos = [...formData.rangos];
    nuevosRangos[index][field] = value;
    setFormData((prev) => ({ ...prev, rangos: nuevosRangos }));
  };

  const agregarRango = () => {
    setFormData((prev) => ({
      ...prev,
      rangos: [...prev.rangos, { nombre: '', puntos: '' }]
    }));
  };

  const eliminarRango = (index) => {
    const nuevosRangos = formData.rangos.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, rangos: nuevosRangos }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (juegoExistente) {
        console.table(formData);
        await editarJuego(formData);
        alert('Juego actualizado correctamente');
      } else {
        await annadirJuego(formData);
        alert('Juego añadido correctamente');
      }

      setFormData({
        nombre: '',
        descripcion: '',
        banner: '',
        foto_juego: '',
        dispositivos: '',
        categoria: '',
        rangos: [{ nombre: '', puntos: '' }]
      });
    } catch (error) {
      alert('Error al procesar el juego.');
      console.error(error);
    }
  };

  return (
    <>
      <div className="añadir-juego-container">
        <h2>{juegoExistente ? 'Editar Juego' : 'Añadir Nuevo Juego'}</h2>
        <form onSubmit={handleSubmit} className="juego-form">

          <label>Nombre</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required disabled={!!juegoExistente} />

          <label>Descripción</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />

          <label>URL del Banner</label>
          <input type="text" name="banner" value={formData.banner} onChange={handleChange} required />

          <label>URL de la Foto del Juego</label>
          <input type="text" name="foto_juego" value={formData.foto_juego} onChange={handleChange} required />

          <label>Dispositivos (separados por coma)</label>
          <input type="text" name="dispositivos" value={formData.dispositivos} onChange={handleChange} required />

          <label>Categoría</label>
          <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} required />

          <label>Rangos</label>
          {formData.rangos.map((rango, index) => (
            <div key={index} className="rango-group">
              <input
                type="text"
                placeholder="Nombre del rango"
                value={rango.nombre}
                onChange={(e) => handleRangoChange(index, 'nombre', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Puntos (ej: 1000 🏆)"
                value={rango.puntos}
                onChange={(e) => handleRangoChange(index, 'puntos', e.target.value)}
                required
              />
              <button type="button" onClick={() => eliminarRango(index)}>Eliminar</button>
            </div>
          ))}
          <button type="button" onClick={agregarRango} className="agregar-rango">+ Añadir Rango</button>

          <button type="submit" className="submit-button">
            {juegoExistente ? 'Actualizar Juego' : 'Guardar Juego'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AnnadirJuego;
