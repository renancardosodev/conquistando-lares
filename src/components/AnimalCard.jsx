import React from "react";
import "../styles/AnimalCard.css";

function AnimalCard({ animal, onClick }) {
  return (
    <div
      className="animal-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
      role="button"
      aria-label={`Ver detalhes de ${animal.nome}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
    >
      <img src={animal.imagem} alt={animal.nome} className="animal-image" />

      <div className="info-tag">
        <div className="info-left">
          <strong>{animal.nome}</strong>
          <span className="location-info">
            <img src="/map.png" alt="Localização" className="icon-small" />
            {animal.bairro} - {animal.estado}
          </span>
        </div>

        <div
          className="info-right"
          aria-label={animal.sexo === "M" ? "Masculino" : "Feminino"}
          role="img"
        >
          <img
            src={animal.sexo === "M" ? "/male.png" : "/female.png"}
            alt={animal.sexo === "M" ? "Masculino" : "Feminino"}
            className="icon-sex"
          />
        </div>
      </div>
    </div>
  );
}

export default AnimalCard;
