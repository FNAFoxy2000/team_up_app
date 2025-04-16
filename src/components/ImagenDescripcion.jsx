import PropTypes from 'prop-types';

function ImagenDescripcion({ src, alt, texto1, texto2 }) {
  return (
    <div
      style={{
        width: '400px',
        height: '500px',
        border: '1px solid #ccc',
        padding: '1rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: '100%',
          maxHeight: '250px',
          objectFit: 'cover',
        }}
      />
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>{texto1}</p>
      <p style={{ textAlign: 'center' }}>{texto2}</p>
    </div>
  );
}

ImagenDescripcion.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  texto1: PropTypes.string,
  texto2: PropTypes.string,
};

export default ImagenDescripcion;
