import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './guias.css';

const ItemSelector = ({ 
  onSelectionChange,
  initialSelectedStarters = [], 
  initialSelectedBoots = [],
  initialSelectedItems = []
}) => {
  
  const [selectedStarterItems, setSelectedStarterItems] = useState(initialSelectedStarters);
  const [selectedBoots, setSelectedBoots] = useState(initialSelectedBoots);
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);

  const [items, setItems] = useState([]);
  const [bootOptions, setBootOptions] = useState([]);
  const [starterOptions, setStarterOptions] = useState([]);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');

  const botas = ["Grebas de berserker", "Botas de rapidez", "Suelas simbióticas", "Botas de hechicero", "Botas blindadas", "Botas de mercurio", "Botas jonias de la lucidez"]

  const starter = ["Escudo de Doran", "Espada de Doran", "Anillo de Doran", "Poción de vida", "Sello oscuro", "Poción reutilizable"]

  const jungle_start = ["Cachorro de Garra ígnea", "Cría de Caminabrisas", "Brote de Brincamontes", "Poción de vida", "Poción reutilizable"]

  const suport_start = ["Atlas mundial", "Poción de vida", "Poción reutilizable"]

  const suport_completos = ["Detracción celestial", "Tejesueños", "Perforaplanos de Zaz'Zak", "Trineo del solsticio", "Tonada sanguina"]

  const pociones = ["Poción de vida", "Poción reutilizable"]

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

  const objetos_suport_completos = objetos.concat(suport_completos)

  // // Función para mostrar las selecciones en consola
  // const logSelections = () => {
  //   console.log("Items iniciales seleccionados:", selectedStarterItems);
  //   console.log("Botas seleccionadas:", selectedBoots);
  //   console.log("Items completos seleccionados:", selectedItems);
  // };

  // // Llama a logSelections cada vez que cambian las selecciones
  // useEffect(() => {
  //   logSelections();
  // }, [selectedStarterItems, selectedBoots, selectedItems]);

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

        const boots = itemList.filter(item => botas.includes(item.name))
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
      if (role === 'Jungla')
        return jungle_start.includes(item.name)
      if (role === 'Support')
        return suport_start.includes(item.name)
      return starter.includes(item.name)
    });
    setStarterOptions(filteredStarters);
  }, [role, items]);

  const isBoot = item => botas.includes(item.name);

  const isStarter = item => {
    if (role === 'Jungla') return jungle_start.includes(item.name);
    if (role === 'Support') return suport_start.includes(item.name);
    return starter.includes(item.name);
  };

  const isPotion = item => item.name.toLowerCase().includes('poción') || item.name.toLowerCase().includes('pocion');

  const isCompleteItem = (item) => {
    if (isBoot(item) || isStarter(item) || isPotion(item)) return false;
    return true;
    //   const excludedItems = [
    //     '1026', '1027', '1028', '1029', '1031', '1033', '1036', '1037', 
    //     '1038', '1039', '1040', '1041', '1042', '1043', '1052', '1053',
    //     '1054', '1055', '1056', '1057', '1058', '1082', '1083', '1400',
    //     '1401', '1402', '1412', '1413', '1414', '1416', '1418', '1419',
    //     '3330', '3340', '3363', '3364', '3513', '3633', '3636', '3690',
    //     '3029', '2065',
    //     '3850', '3851', '3853', '3854', '3855', '3857', '3858', '3859'
    //   ];

    //   const excludedKeywords = [
    //     'poción', 'pocion', 'ward', 'totem', 'effigy', 'trinket', 
    //     'lens', 'elixir', 'corrupting', 'stealth', 'vision', 'component'
    //   ];

    //   if (
    //     item.depth > 1 ||
    //     excludedItems.includes(item.id) ||
    //     excludedKeywords.some(keyword => item.name.toLowerCase().includes(keyword)) ||
    //     item.tags?.includes('Trinket') ||
    //     item.tags?.includes('Jungle') ||
    //     (role === 'Support' && item.tags?.includes('GoldPer'))
    //   ) {
    //     return false;
    //   }

    //   return true;
  };

  const filteredCompleteItems = items
    .filter(item => {
      if (role === "Support") {
        return objetos_suport_completos.includes(item.name);
      } else {
        return objetos.includes(item.name);
      }
    })
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddItem = (item) => {
    if (isBoot(item)) {
      if (!selectedBoots.find(i => i.id === item.id) && selectedBoots.length < 3) {
        const newBoots = [...selectedBoots, item];
        setSelectedBoots(newBoots);
        notifyParent(selectedStarterItems, newBoots, selectedItems);

      }
    } else if (isStarter(item) || isPotion(item)) {
      if (isPotion(item)) {
        if (!selectedStarterItems.find(i => i.id === item.id)) {
          const newStarters = [...selectedStarterItems, item];
          setSelectedStarterItems(newStarters);
          notifyParent(newStarters, selectedBoots, selectedItems);

        }
      } else {
        if (!selectedStarterItems.find(i => isStarter(i) && !isPotion(i))) {
          const newStarters = [...selectedStarterItems, item];
          setSelectedStarterItems(newStarters);
          notifyParent(newStarters, selectedBoots, selectedItems);

        }
      }
    } else {
      if (!selectedItems.find(i => i.id === item.id) && selectedItems.length < 5) {
        const newItems = [...selectedItems, item];
        setSelectedItems(newItems);
        notifyParent(selectedStarterItems, selectedBoots, newItems);

      }
    }
  };

  const handleRemoveStarterItem = (id) => {
    const newList = selectedStarterItems.filter(item => item.id !== id);
    setSelectedStarterItems(newList);
    notifyParent(newList, selectedBoots, selectedItems);

  };

  const handleRemoveBoot = (id) => {
    const newList = selectedBoots.filter(item => item.id !== id);
    setSelectedBoots(newList);
    notifyParent(selectedStarterItems, newList, selectedItems);

  };

  const handleRemoveItem = (id) => {
    const newList = selectedItems.filter(item => item.id !== id);
    setSelectedItems(newList);
    notifyParent(selectedStarterItems, selectedBoots, newList);

  };



  return (
    
    <div className="item-selector">

      <select
        value={role}
        onChange={e => setRole(e.target.value)}
        className="role-select"
      >
        <option value="">Selecciona un rol</option>
        <option value="Top">Top</option>
        <option value="Mid">Mid</option>
        <option value="Bot">Bot</option>
        <option value="Jungla">Jungla</option>
        <option value="Support">Support</option>
      </select>

      <div className="boot-selector">
        <h4>Selecciona hasta 3 botas</h4>
        <div className="items-grid">
          {bootOptions.map(item => (
            <div
              key={item.id}
              className={`item-card ${selectedBoots.find(i => i.id === item.id) ? 'selected' : ''}`}
              onClick={() => handleAddItem(item)}
            >
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item.image.full}`}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </div>
      

      <div className="starter-selector">
        <h4>Selecciona objeto inicial y pociones</h4>
        <div className="items-grid">
          {starterOptions.map(item => (
            <div
              key={item.id}
              className={`item-card ${selectedStarterItems.find(i => i.id === item.id) ? 'selected' : ''}`}
              onClick={() => handleAddItem(item)}
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
        className="search-input"
      />

      <div className="selected-items">
        <h3>Objetos iniciales seleccionados</h3>
        <div className="items-grid">
          {selectedStarterItems.map(item => (
            <div key={item.id} className="item-card" onClick={() => handleRemoveStarterItem(item.id)}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item.image.full}`}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="selected-items">
        <h3>Botas seleccionadas</h3>
        <div className="items-grid">
          {selectedBoots.map(item => (
            <div key={item.id} className="item-card" onClick={() => handleRemoveBoot(item.id)}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item.image.full}`}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="complete-item-selector">
        <h4>Selecciona hasta 5 objetos completos</h4>
        <div className="items-grid">
          {filteredCompleteItems.map(item => (
            <div
              key={item.id}
              className={`item-card ${selectedItems.find(i => i.id === item.id) ? 'selected' : ''}`}
              onClick={() => handleAddItem(item)}
            >
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item.image.full}`}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="selected-items">
        <h3>Objetos completos seleccionados</h3>
        <div className="items-grid">
          {selectedItems.map(item => (
            <div key={item.id} className="item-card" onClick={() => handleRemoveItem(item.id)}>
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