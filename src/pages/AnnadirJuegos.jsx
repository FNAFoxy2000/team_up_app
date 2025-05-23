import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './AnnadirJuegos.css';
import { annadirJuego, editarJuego } from '../peticiones/juego_peticiones.mjs';
import { getCategorias, annadirCategoria } from '../peticiones/categoria_peticiones.mjs';

const AnnadirJuego = () => {
  const location = useLocation();
  const juegoExistente = location.state?.juego;

  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [usarNuevaCategoria, setUsarNuevaCategoria] = useState(false);

  const [formData, setFormData] = useState({
    nombre: juegoExistente?.nombre || '',
    descripcion: juegoExistente?.descripcion || '',
    banner: juegoExistente?.banner || '',
    foto_juego: juegoExistente?.foto_juego || '',
    dispositivos: juegoExistente?.dispositivos || '',
    categoria: '',
    rangos: juegoExistente?.rangos || [{ nombre: '', puntos: '' }]
  });

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const categoriasObtenidas = await getCategorias();
        setCategorias(categoriasObtenidas);

        if (juegoExistente) {
          const categoriaEncontrada = categoriasObtenidas.find(
            cat => cat.id_categoria === juegoExistente.categoria
          );
          if (categoriaEncontrada) {
            setFormData(prev => ({ ...prev, categoria: categoriaEncontrada.nombre }));
          }
        }

      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    cargarCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoriaSelect = (e) => {
    const value = e.target.value;
    if (value === 'nueva') {
      setUsarNuevaCategoria(true);
      setFormData(prev => ({ ...prev, categoria: '' }));
    } else {
      setUsarNuevaCategoria(false);
      setFormData(prev => ({ ...prev, categoria: value }));
    }
  };

  const handleNuevaCategoriaChange = (e) => {
    const value = e.target.value;
    setNuevaCategoria(value);
    setFormData(prev => ({ ...prev, categoria: value }));
  };

  const handleRangoChange = (index, field, value) => {
    const nuevosRangos = [...formData.rangos];
    nuevosRangos[index][field] = value;
    setFormData(prev => ({ ...prev, rangos: nuevosRangos }));
  };

  const agregarRango = () => {
    setFormData(prev => ({
      ...prev,
      rangos: [...prev.rangos, { nombre: '', puntos: '' }]
    }));
  };

  const eliminarRango = (index) => {
    const nuevosRangos = formData.rangos.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, rangos: nuevosRangos }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let categoriaID;

      if (usarNuevaCategoria && nuevaCategoria) {
        const respuesta = await annadirCategoria(nuevaCategoria);
        categoriaID = respuesta?.categoria?.id_categoria;
      } else {
        const categoriaSeleccionada = categorias.find(cat => cat.nombre === formData.categoria);
        categoriaID = categoriaSeleccionada?.id_categoria;
      }

      if (!categoriaID) {
        alert("No se pudo obtener el ID de la categoría.");
        return;
      }

      const datosJuego = {
        ...formData,
        categoria: categoriaID
      };
      console.log(datosJuego);
      if (juegoExistente) {
        await editarJuego(datosJuego);
        alert('Juego actualizado correctamente');
      } else {
        await annadirJuego(datosJuego);
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
      setNuevaCategoria('');
      setUsarNuevaCategoria(false);

    } catch (error) {
      alert('Error al procesar el juego.');
      console.error(error);
    }
  };

  return (
    <div className="añadir-juego-container">
      <h2>{juegoExistente ? 'Editar Juego' : 'Añadir Nuevo Juego'}</h2>
      <form onSubmit={handleSubmit} className="juego-form">
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          disabled={!!juegoExistente}
        />

        <label>Descripción</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />

        <label>URL del Banner</label>
        <input type="text" name="banner" value={formData.banner} onChange={handleChange} required />

        <label>URL de la Foto del Juego</label>
        <input type="text" name="foto_juego" value={formData.foto_juego} onChange={handleChange} required />

        <label>Dispositivos (separados por coma)</label>
        <input type="text" name="dispositivos" value={formData.dispositivos} onChange={handleChange} required />

        <label>Categoría</label>
        <select
          value={usarNuevaCategoria ? 'nueva' : formData.categoria}
          onChange={handleCategoriaSelect}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.nombre}>
              {cat.nombre}
            </option>
          ))}
          <option value="nueva">+ Crear nueva categoría</option>
        </select>

        {usarNuevaCategoria && (
          <input
            type="text"
            placeholder="Nueva categoría"
            value={nuevaCategoria}
            onChange={handleNuevaCategoriaChange}
            required
          />
        )}

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
              placeholder="Puntos"
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
  );
};

export default AnnadirJuego;
