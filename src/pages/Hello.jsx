import { Link } from 'react-router-dom';
import ImagenDescripcion from '../components/ImagenDescripcion';

function Hello() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
      <h1>Hello World</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: '2rem',
        }}
      >
        <ImagenDescripcion
          src="https://1.bp.blogspot.com/-k6YHsdBim8A/U3Tx5GFbXYI/AAAAAAACMqQ/BMgDHUHbkZs/s1600/imagenes-gratis-para-ver-y-compartir-en-facebook-y-google+-fotos-free-photos-to-share+(16).jpg"
          alt="Imagen 1"
          texto1="Este es el primer párrafo"
          texto2="Este es el segundo párrafo"
        />
        <ImagenDescripcion
          src="https://neliosoftware.com/es/wp-content/uploads/sites/3/2018/07/aziz-acharki-549137-unsplash.jpg"
          alt="Imagen 2"
          texto1="Segundo componente con texto"
          texto2="Otro párrafo para mostrar más contenido"
        />
        <ImagenDescripcion
          src="https://3.bp.blogspot.com/-ucHn69Q7zQs/UpFRkbpzRQI/AAAAAAAB-jg/k4jeIDp5N34/s1600/autumn-portada.jpg"
          alt="Imagen 3"
          texto1="Tercer ejemplo de componente"
          texto2="Este texto es parte del tercer bloque"
        />
      </div>
      <Link to="/">← Volver a Home</Link>
    </div>
  );
}

export default Hello;
