function RunesDetalle({ contenido }) {
  const getRuneTreeImage = (treeId) => {
    const treeImages = {
      8000: '7201_Precision.png',    // Precisión
      8100: '7200_Domination.png',  // Dominación
      8200: '7202_Sorcery.png',     // Brujería
      8300: '7203_Whimsy.png',      // Valor (antes Inspiración)
      8400: '7204_Resolve.png'      // Determinación
    };
    return `https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/${treeImages[treeId]}`;
  };

  const getRuneImage = (runeId) => {
    // Mapeo de runas principales (keystones)
    const keystones = {
      8005: 'PressTheAttack.png',      // Ataque intensificado
      8008: 'LethalTempo.png',         // Ritmo letal
      8021: 'FleetFootwork.png',       // Pasos de combate
      8010: 'Conqueror.png',           // Conquistador
      8112: 'Electrocute.png',         // Electrocutar
      8124: 'Predator.png',            // Depredador
      8128: 'DarkHarvest.png',         // Cosecha oscura
      9923: 'HailOfBlades.png',        // Lluvia de cuchillas
      8351: 'GlacialAugment.png',      // Aumento glacial
      8360: 'SummonAery.png',          // Afinidad
      8369: 'ArcaneComet.png',         // Cometa arcano
      8358: 'PhaseRush.png',           // Fase veloz
      8437: 'GraspOfTheUndying.png',   // Poder persistente
      8439: 'Aftershock.png',          // Sacudida
      8465: 'Guardian.png',            // Guardián
    };

    // Mapeo de runas secundarias
    const secondaryRunes = {
      9101: 'Overheal.png',            // Exceso de curación
      9111: 'Triumph.png',             // Triunfo
      8009: 'PresenceOfMind.png',      // Claridad mental
      9104: 'LegendAlacrity.png',      // Leyenda: Presteza
      9105: 'LegendTenacity.png',      // Leyenda: Tenacidad
      9103: 'LegendBloodline.png',     // Leyenda: Linaje
      8014: 'CoupDeGrace.png',         // Golpe de gracia
      8017: 'CutDown.png',             // Derribado
      8299: 'LastStand.png',           // Último esfuerzo
      8135: 'CheapShot.png',           // Golpe bajo
      8134: 'TasteOfBlood.png',        // Sabor a sangre
      8136: 'SuddenImpact.png',        // Impacto repentino
      8120: 'GhostPoro.png',           // Poró fantasma
      8126: 'ZombieWard.png',          // Guardián espectral
      8138: 'EyeballCollection.png',   // Acopio de ojos
      8139: 'TreasureHunter.png',      // Cazador de tesoros
      8143: 'IngeniousHunter.png',     // Cazador ingenioso
      8132: 'HextechFlashtraption.png',// Trampa hextech
      8105: 'MagicalFootwear.png',     // Calzado mágico
      8106: 'PerfectTiming.png',       // Cronometría perfecta
      8015: 'BiscuitDelivery.png',     // Entrega de galletas
      8021: 'CosmicInsight.png',       // Perspicacia cósmica
      8352: 'TimeWarpTonic.png',       // Tónico de distorsión temporal
      8304: 'MagicalFootwear.png',     // Calzado mágico (valor)
      8306: 'HextechFlashtraption.png',// Trampa hextech (valor)
      8313: 'PerfectTiming.png',       // Cronometría perfecta (valor)
      8321: 'FutureMarket.png',        // Mercado futuro
      8316: 'MinionDematerializer.png',// Desmaterializador de súbditos
      8345: 'BiscuitDelivery.png',     // Entrega de galletas (valor)
      8347: 'CosmicInsight.png',       // Perspicacia cósmica (valor)
      8410: 'ApproachVelocity.png',    // Velocidad de aproximación
      8359: 'TimeWarpTonic.png',       // Tónico de distorsión temporal (valor)
    };

    // Determinar si es una runa principal (keystone) o secundaria
    if (keystones[runeId]) {
      return `https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Precision/${keystones[runeId]}`;
    } else if (secondaryRunes[runeId]) {
      // Determinar a qué árbol pertenece para la ruta correcta
      const tree = Math.floor(runeId / 100) * 100;
      const treeName = {
        8000: 'Precision',
        8100: 'Domination',
        8200: 'Sorcery',
        8300: 'Inspiration',
        8400: 'Resolve'
      }[tree] || 'Precision';
      
      return `https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/${treeName}/${secondaryRunes[runeId]}`;
    }

    // Si no se encuentra, devolver una runa por defecto
    return 'https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7201_Precision.png';
  };

  return (
    <div className="runes-build">
      <h3>Runas</h3>
      <div className="runes-container">
        {/* Rama Principal */}
        <div className="rune-tree">
          <h4>Rama Principal</h4>
          <img 
            src={getRuneTreeImage(contenido.runaPrincipal)} 
            alt="Primary Rune Tree" 
            className="rune-tree-image"
          />
          <div className="keystone">
            <img 
              src={getRuneImage(contenido.runasRamaPrincipal[0][0])} 
              alt="Keystone" 
              className="rune-image"
            />
          </div>
          <div className="secondary-runes">
            {contenido.runasRamaPrincipal.slice(1).map((runa, index) => (
              <img
                key={index}
                src={getRuneImage(runa[0])}
                alt={`Rune ${runa[0]}`}
                className="rune-image"
              />
            ))}
          </div>
        </div>

        {/* Rama Secundaria */}
        <div className="rune-tree">
          <h4>Rama Secundaria</h4>
          <img 
            src={getRuneTreeImage(contenido.runaSecundaria)} 
            alt="Secondary Rune Tree" 
            className="rune-tree-image"
          />
          <div className="secondary-runes">
            {contenido.runasRamaSecundaria.map((runa, index) => (
              <img
                key={index}
                src={getRuneImage(runa[0])}
                alt={`Rune ${runa[0]}`}
                className="rune-image"
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .runes-build {
          background: rgba(30, 35, 40, 0.7);
          padding: 20px;
          border-radius: 8px;
          grid-column: 1 / -1;
        }

        .runes-container {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
        }

        .rune-tree {
          flex: 1;
          min-width: 200px;
        }

        .rune-tree-image {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          margin: 10px 0;
          border: 2px solid #785a28;
        }

        .keystone {
          margin: 15px 0;
        }

        .keystone .rune-image {
          width: 54px;
          height: 54px;
          border: 2px solid #c8aa6e;
        }

        .secondary-runes {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }

        .rune-image {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #5b5a56;
          transition: transform 0.3s;
        }

        .rune-image:hover {
          transform: scale(1.1);
          box-shadow: 0 0 8px #c8aa6e;
        }
      `}</style>
    </div>
  );
}

export default RunesDetalle;