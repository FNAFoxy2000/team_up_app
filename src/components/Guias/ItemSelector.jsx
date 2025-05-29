import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './guias.css';


const ItemSelector = ({ onSelectionChange }) => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedBoots, setSelectedBoots] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          'https://ddragon.leagueoflegends.com/cdn/14.10.1/data/es_ES/item.json'
        );
        const rawItems = res.data.data;

        const itemList = Object.entries(rawItems)
          .map(([id, item]) => ({ id, ...item }))
          .filter(item =>
            item.gold?.purchasable &&
            item.image &&
            item.maps?.["11"] === true
          );

        setItems(itemList);
      } catch (err) {
        console.error('Error al cargar objetos:', err);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = (item) => {
    if (item.tags?.includes('Boots')) {
      setSelectedBoots(item);
      onSelectionChange?.([...selectedItems, item]);
    } else if (selectedItems.length < 5 && !selectedItems.find(i => i.id === item.id)) {
      const newItems = [...selectedItems, item];
      setSelectedItems(newItems);
      onSelectionChange?.([...newItems, selectedBoots].filter(Boolean));
    }
  };

  const handleRemoveItem = (id) => {
    if (selectedBoots?.id === id) {
      setSelectedBoots(null);
    } else {
      const newItems = selectedItems.filter(item => item.id !== id);
      setSelectedItems(newItems);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="item-selector">
      <input
        type="text"
        placeholder="Buscar objeto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="selected-items">
        <h3>Objetos seleccionados</h3>
        <div className="items-grid">
          {selectedItems.map(item => (
            <div key={item.id} className="item-card" onClick={() => handleRemoveItem(item.id)}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item.image.full}`}
                alt={item.name}
              />
              <span>{item.name}</span>
            </div>
          ))}
          {selectedBoots && (
            <div className="item-card boots" onClick={() => handleRemoveItem(selectedBoots.id)}>
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${selectedBoots.image.full}`}
                alt={selectedBoots.name}
              />
              <span>{selectedBoots.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="items-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="item-card" onClick={() => handleAddItem(item)}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item.image.full}`}
              alt={item.name}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemSelector;