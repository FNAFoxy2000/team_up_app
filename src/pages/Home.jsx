import styles from './Home.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import ReactPlayer from 'react-player';
import CRVideo from '../assets/CR_video.mp4';
import { useNavigate } from 'react-router-dom';
import SeccionJuego from '../components/SeccionJuego';


function Home() {
  const navigate = useNavigate();

  const juegos = [
    {
      nombre: 'League of Legends',
      slug: 'League_of_Legends',
      descripcion: 'Únete a invocadores y conquista la Grieta del Invocador.',
      imagen: 'https://th.bing.com/th/id/R.850ffe9945e3442cb3602e98884613ba?rik=UZuPcncigaN%2f3A&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2f9%2f9%2fb%2f643239.jpg&ehk=DvisVJeYn690bk%2bL%2bl82IEAMz0ktk4EOBWD4Iw8gk2g%3d&risl=&pid=ImgRaw&r=0',
    },
    {
      nombre: 'Valorant',
      slug: 'Valorant',
      descripcion: 'Estrategia, puntería y trabajo en equipo en el shooter más icónico.',
      imagen: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/1c1776bd1bdd921061a53953d81a393ef69ce633-1920x1080.jpg?w=1200&h=630&fm=webp&fit=crop&crop=center',
    },
    {
      nombre: 'Clash Royale',
      slug:'Clash_Royale',
      descripcion: 'Combates rápidos y estrategia en tiempo real en tu móvil.',
      imagen: 'https://games.lol/wp-content/uploads/2020/12/clashroyale-free-full-version-1.jpg',
    }
  ];

  return (
    <>
      <main className={styles.main}>
        <section className={styles.header}>
          <h1>TeamUp</h1>
          <p>Conecta con otros jugadores, chatea, forma equipos y domina tus juegos favoritos.</p>
        </section>

        {/* Carrusel de videos */}
        <section className={styles.carousel}>
          <Slider
            dots
            infinite
            autoplay
            speed={800}
            autoplaySpeed={6000}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={false}
          >
            {/* Video LOL */}
            <div className={styles.slide}>
              <video
                className={styles.videoBackground}
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/8ab3e227121c53aacab0c9b9f7a48adbc65db520.webm" type="video/webm" />
                Tu navegador no soporta este video.
              </video>
            </div>

            {/* Video CS2 */}
            <div className={styles.slide}>
              <video
                className={styles.videoBackground}
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="https://cdn.akamai.steamstatic.com/apps/csgo/videos/csgo_react/cs2/cs2_header.webm" type="video/webm" />
                Tu navegador no soporta este video.
              </video>
            </div>

            {/* Video Clash Royale */}
            <div className={styles.slide}>
              <video
                className={styles.videoBackground}
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={CRVideo} type="video/mp4" />
                Tu navegador no soporta este video.
              </video>
            </div>
          </Slider>
        </section>

        <section className={styles.services}>
          <div className={styles.serviceCard}>
            <h3>💬 Chatea con otros jugadores</h3>
            <p>Únete a conversaciones activas sobre tus juegos favoritos.</p>
          </div>
          <div className={styles.serviceCard}>
            <h3>🎮 Únete a equipos</h3>
            <p>Encuentra jugadores con los que compartir tus partidas.</p>
          </div>
          <div className={styles.serviceCard}>
            <h3>📚 Explora guías</h3>
            <p>Lee y crea contenido útil sobre tus juegos preferidos.</p>
          </div>
        </section>

        {juegos.map((juego, index) => (
          <SeccionJuego
            key={juego.slug}
            imagen={juego.imagen}
            titulo={juego.nombre}
            descripcion={juego.descripcion}
            onClick={() => navigate(`/juegos/${juego.slug}`)}
            invertido={index % 2 === 1} // alternar posición para variedad
          />
        ))}

      </main>
    </>
  );
}

export default Home;
