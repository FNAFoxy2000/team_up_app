import styles from './Home.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import ReactPlayer from 'react-player';
import CRVideo from '../assets/CR_video.mp4';

function Home() {
  return (
    <>
      <Navbar />
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
      </main>
      <Footer />
    </>
  );
}

export default Home;
