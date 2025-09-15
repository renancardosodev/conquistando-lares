import React, { useState } from "react";
import { estados } from "../data/estados";
import bellIcon from '../assets/bell.png'; 
import searchIcon from '../assets/search.png';
import filtroIcon from '../assets/filtro.png';
import "../styles/Navbar.css";

function Navbar({ location, onLocationChange, onSearchSubmit, onFilterClick }) {
  const [inputValue, setInputValue] = useState("");
  const [showLocationList, setShowLocationList] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); 

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  function handleSubmit() {
    onSearchSubmit && onSearchSubmit(inputValue);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  const nomeEstado = estados.find(e => e.sigla === location)?.nome || location;

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div
          className="location"
          onClick={() => setShowLocationList(!showLocationList)}
        >
          <span className="label">Localização ▾</span>
          <strong>{nomeEstado || "Carregando..."}</strong>

          {showLocationList && (
            <ul className="location-list">
              {estados.map((e) => (
                <li
                  key={e.sigla}
                  onClick={() => {
                    onLocationChange(e.sigla); 
                    setShowLocationList(false);
                  }}
                >
                  {e.nome} 
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="notif-wrapper">
          <button
            className="notif"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <img src={bellIcon} alt="Notificações" className="bell-icon" />
          </button>

          {showNotifications && (
            <div className="notif-dropdown">
              <ul>
                <li>🐶 1 animal é abandonado a cada 3 minutos no Brasil. Adotar é uma escolha de amor!</li>
                <li>Animais em abrigos esperam por você. Cada adoção salva uma vida.</li>
                <li>🐾 Mais de 20 milhões de animais vivem em lares temporários no país. Adotar é transformação!</li>
              </ul>
              <button
                className="clear-btn"
                onClick={() => setShowNotifications(false)}
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-bottom">
        <div className="search-wrapper">
          <img src={searchIcon} alt="Pesquisar" className="search-left-icon" />
          <input
            type="text"
            className="search-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button className="search-btn" onClick={handleSubmit}>
          Pesquisar
        </button>

        <button className="filter-btn" onClick={onFilterClick}>
          <img src={filtroIcon} alt="Filtrar" />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
