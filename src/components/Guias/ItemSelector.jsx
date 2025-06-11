import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './items.module.css';

const ItemSelector = ({
  onSelectionChange,
  initialSelectedStarters = [],
  initialSelectedBoots = [],
  initialSelectedItems = [],
  selectedPosition = ''
}) => {

  const [selectedStarterItems, setSelectedStarterItems] = useState(initialSelectedStarters);
  const [selectedBoots, setSelectedBoots] = useState(initialSelectedBoots);
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);

  const [items, setItems] = useState([]);
  const [bootOptions, setBootOptions] = useState([]);
  const [starterOptions, setStarterOptions] = useState([]);
  const [search, setSearch] = useState('');

  const botas = ["Grebas de berserker", "Botas de rapidez", "Suelas simbióticas", "Botas de hechicero", "Botas blindadas", "Botas de mercurio", "Botas jonias de la lucidez"];

  const starter = ["Escudo de Doran", "Espada de Doran", "Anillo de Doran", "Poción de vida", "Sello oscuro", "Poción reutilizable"];

  const jungle_start = ["Cachorro de Garra ígnea", "Cría de Caminabrisas", "Brote de Brincamontes", "Poción de vida", "Poción reutilizable"];

  const suport_start = ["Atlas mundial", "Poción de vida", "Poción reutilizable"];

  const suport_completos = ["Detracción celestial", "Tejesueños", "Perforaplanos de Zaz'Zak", "Trineo del solsticio", "Tonada sanguina"];

  const pociones = ["Poción de vida", "Poción reutilizable"];

  const objetos = [
    "Canción de batalla de Shurelya", "Sangría del soberano",
    "Desesperanza eterna", "Antorcha de fuego negro", "Rookern kaénico", "Marcasendas",
    "Bastón del arcángel", "Manamune", "Ángel de la guarda", "Filo infinito",
    "Flechas de los Yun Tal", "Recordatorio letal", "Recuerdos de lord Dominik",
    "Bailarín espectral", "Convergencia de Zeke", "Calibrador de Sterak",
    "Rostro espiritual", "Égida de fuego solar", "Cuchilla negra", "Sanguinaria",
    "Experimento de hexarmadura", "Hidra voraz", "Malla de espinas",
    "Fuerza de trinidad", "Armadura de Warmog", "Corazón de acero",
    "Huracán de Runaan", "Puñal de Statikk", "Sombrero mortal de Rabadon",
    "Final del ingenio", "Cañón de fuego rápido", "Perdición del liche",
    "Velo del hada de la muerte", "Redención", "Promesa de caballero",
    "Corazón de hielo", "Diente de Nashor", "Cetro de cristal de Rylai",
    "Malignidad", "Llegada del invierno", "Hoja de furia de Guinsoo",
    "Bastón del Vacío", "Florescencia sepulcral", "Cimitarra mercurial",
    "Filo fantasmal de Youmuu", "Presagio de Randuin", "Cintomisil hextech",
    "Hoja del rey arruinado", "Fauces de Malmortius", "Reloj de arena de Zhonya",
    "Lanza de Shojin", "Morellonomicón", "Céfiro", "Guja sombría",
    "Rompecascos", "Medallón de los Solari de Hierro", "Bendición de Mikael",
    "El final", "Incensario ardiente", "Segador de esencia", "Coraza del muerto",
    "Hidra titánica", "Filo de la noche", "Mandato imperial", "Fuerza de la naturaleza",
    "Precisión infalible", "Impulso cósmico", "Creagrietas", "Piedra de visión vigilante",
    "Llamasombría", "Sobrecarga tormentosa", "Baile de la muerte", "Mecanoespada punki",
    "Firmamento desgarrado", "Bastón de aguas fluidas", "Renovación de piedra lunar",
    "Ecos de Helia", "Núcleo albar", "Cortasendas", "Tormento de Liandry",
    "Compañera de Luden", "Vara de las edades", "Guantelete de hielo",
    "Fulgor vano", "Jak'Sho, el Proteico", "Verdugo de krakens",
    "Arcoescudo inmortal", "Filofugaz de Navori", "Recaudadora", "Eclipse",
    "Rencor de Serylda", "Colmillo de serpiente", "Arco axiomático",
    "Soberbia", "Hidra profana", "Espada ciclovoltaica", "Oportunidades"
  ];

  const objetos_suport_completos = objetos.concat(suport_completos);

  if (selectedPosition.toLowerCase() == "jungle") {
    selectedPosition = "Jungla"
  } else if (selectedPosition.toLowerCase() == "utility") {
    selectedPosition = "Support"
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          'https://ddragon.leagueoflegends.com/cdn/14.10.1/data/es_ES/item.json'
        );
        const rawItems = res.data.data;

        const itemList = Object.entries(rawItems)
          .map(([id, item]) => ({ id, ...item }))
          .filter(
            item =>
              item.gold?.purchasable &&
              item.image &&
              item.maps?.['11'] === true
          );

        setItems(itemList);

        const boots = itemList.filter(item => botas.includes(item.name));
        setBootOptions(boots);
      } catch (err) {
        console.error('Error al cargar objetos:', err);
      }
    };

    fetchItems();
  }, []);

  const notifyParent = (newStarters, newBoots, newItems) => {
    if (onSelectionChange) {
      onSelectionChange({
        starterItems: newStarters,
        boots: newBoots,
        items: newItems
      });
    }
  };

  useEffect(() => {
    const filteredStarters = items.filter(item => {
      if (selectedPosition === 'Jungla') {
        return jungle_start.includes(item.name);
      }
      if (selectedPosition === 'Support') {
        return suport_start.includes(item.name);
      }
      return starter.includes(item.name);
    });
    setStarterOptions(filteredStarters);
  }, [selectedPosition, items]);

  const isBoot = item => botas.includes(item.name);

  const isStarter = item => {
    if (selectedPosition === 'Jungla') return jungle_start.includes(item.name);
    if (selectedPosition === 'Support') return suport_start.includes(item.name);
    return starter.includes(item.name);
  };

  const isPotion = item => item.name.toLowerCase().includes('poción') || item.name.toLowerCase().includes('pocion');

  const isCompleteItem = (item) => {
    if (isBoot(item) || isStarter(item) || isPotion(item)) return false;
    return true;
  };

  const filteredCompleteItems = items
    .filter(item => {
      if (selectedPosition === "Support") {
        return objetos_suport_completos.includes(item.name);
      } else {
        return objetos.includes(item.name);
      }
    })
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddItem = (item) => {
    // Si es bota
    if (isBoot(item)) {
      const alreadySelected = selectedBoots.find(i => i.id === item.id);
      if (alreadySelected) {
        const newBoots = selectedBoots.filter(i => i.id !== item.id);
        setSelectedBoots(newBoots);
        notifyParent(selectedStarterItems, newBoots, selectedItems);
      } else if (selectedBoots.length < 3) {
        const newBoots = [...selectedBoots, item];
        setSelectedBoots(newBoots);
        notifyParent(selectedStarterItems, newBoots, selectedItems);
      }
    }
    // Si es ítem inicial o poción
    else if (isStarter(item) || isPotion(item)) {
      const alreadySelected = selectedStarterItems.find(i => i.id === item.id);
      if (alreadySelected) {
        const newStarters = selectedStarterItems.filter(i => i.id !== item.id);
        setSelectedStarterItems(newStarters);
        notifyParent(newStarters, selectedBoots, selectedItems);
      } else {
        if (isPotion(item)) {
          const newStarters = [...selectedStarterItems, item];
          setSelectedStarterItems(newStarters);
          notifyParent(newStarters, selectedBoots, selectedItems);
        } else {
          if (!selectedStarterItems.find(i => isStarter(i) && !isPotion(i))) {
            const newStarters = [...selectedStarterItems, item];
            setSelectedStarterItems(newStarters);
            notifyParent(newStarters, selectedBoots, selectedItems);
          }
        }
      }
    }
    else {
      const alreadySelected = selectedItems.find(i => i.id === item.id);
      if (alreadySelected) {
        const newItems = selectedItems.filter(i => i.id !== item.id);
        setSelectedItems(newItems);
        notifyParent(selectedStarterItems, selectedBoots, newItems);
      } else if (selectedItems.length < 5) {
        const newItems = [...selectedItems, item];
        setSelectedItems(newItems);
        notifyParent(selectedStarterItems, selectedBoots, newItems);
      }
    }
  };
  const getTooltip = (desc) => desc ? desc.replace(/<[^>]+>/g, '') : '';

  return (
    <div className={styles.itemSelector}>

      <div className={styles.bootSelector}>
        <h4>Selecciona hasta 3 botas</h4>
        <div className={styles.itemsGrid}>
          {bootOptions.map(item => (
            <div
              key={item.id}
              className={`${styles.itemCard} ${selectedBoots.find(i => i.id === item.id) ? styles.selected : ''
                }`}
              onClick={() => handleAddItem(item)}
              title={getTooltip(item.description)}
            >
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item.image.full}`}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.starterSelector}>
        <h4>Selecciona objeto inicial y pociones</h4>
        <div className={styles.itemsGrid}>
          {starterOptions.map(item => (
            <div
              key={item.id}
              className={`${styles.itemCard} ${selectedStarterItems.find(i => i.id === item.id) ? styles.selected : ''
                }`}
              onClick={() => handleAddItem(item)}
              title={getTooltip(item.description)}

            >
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item.image.full}`}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.selectedItems}>
        <h3>Objetos iniciales seleccionados</h3>
        <div className={styles.itemsGrid}>
          {selectedStarterItems.map(item => (
            <div
              key={item.id}
              className={`${styles.itemCard} ${styles.selected}`}
              onClick={() => handleAddItem(item)}
              title={getTooltip(item.description)}

            >
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item.image.full}`}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.selectedItems}>
        <h3>Botas seleccionadas</h3>
        <div className={styles.itemsGrid}>
          {selectedBoots.map(item => (
            <div
              key={item.id}
              className={`${styles.itemCard} ${styles.selected}`}
              onClick={() => handleAddItem(item)}
              title={getTooltip(item.description)}

            >
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item.image.full}`}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar objeto..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.completeItemSelector}>
        <h4>Selecciona hasta 5 objetos completos</h4>
        <div className={styles.itemsGrid}>
          {filteredCompleteItems.map(item => (
            <div
              key={item.id}
              className={`${styles.itemCard} ${selectedItems.find(i => i.id === item.id) ? styles.selected : ''
                }`}
              onClick={() => handleAddItem(item)}
              title={getTooltip(item.description)}

            >
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item.image.full}`}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.selectedItems}>
        <h3>Objetos completos seleccionados</h3>
        <div className={styles.itemsGrid}>
          {selectedItems.map(item => (
            <div
              key={item.id}
              className={`${styles.itemCard} ${styles.selected}`}
              onClick={() => handleAddItem(item)}
              title={getTooltip(item.description)}

            >
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item.image.full}`}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemSelector;