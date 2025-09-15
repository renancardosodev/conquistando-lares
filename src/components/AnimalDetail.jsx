import React, { useState, useEffect } from "react";
import "../styles/AnimalDetail.css";
import voltar from "../assets/voltar.png";
import esquerda from "../assets/seta-esquerda.png";
import direita from "../assets/seta-direita.png";
import male from "../assets/male.png";
import female from "../assets/female.png";
import mapa from "../assets/map.png";


function AnimalDetail({ animal, onClose }) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!animal) return <p>Carregando...</p>;

  const allImages = [animal.imagem, ...(animal.fotosExtras || [])];

  const slideNext = () => {
    setCurrentSlide((prev) => (prev + 1) % allImages.length);
  };

  const slidePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      slideNext();
    }
    if (touchEndX - touchStartX > 50) {
      slidePrev();
    }
    setTouchStartX(0);
    setTouchEndX(0);
  };

  const renderGallery = () => (
    <div
      className="gallery"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="main-photo-container">
        {/* Botão anterior */}
        {allImages.length > 1 && (
          <button className="prev-slide" onClick={slidePrev}>
            <img src={esquerda} alt="Anterior" className="slide-arrow" />
          </button>
        )}

        <img
          src={allImages[currentSlide]}
          alt={`${animal.nome} - foto ${currentSlide + 1}`}
          className="main-photo"
        />
        {/* Botão próximo */}
        {allImages.length > 1 && (
          <button className="next-slide" onClick={slideNext}>
            <img src={direita} alt="Próximo" className="slide-arrow" />
          </button>
        )}
      </div>
      {allImages.length > 1 && (
        <div className="slide-dots">
          {allImages.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      )}
    </div>
  );

  const content = (
    <div className="content-container">
      {/* Nome, localização e sexo */}
      <div className="animal-header-info">
        <div className="name-location-container">
          <strong className="animal-name">{animal.nome}</strong>
          <span className="location-info">
            <img src = {mapa} alt="Localização" className="icon-small" />
            {animal.bairro} - {animal.estado}
          </span>
        </div>

        <div className="sex-icon-container">
          <img
            src={animal.sexo === "M" ? male : female}
            alt={animal.sexo === "M" ? "Masculino" : "Feminino"}
            className="icon-sex"
          />
        </div>
      </div>

      {/* Perfil da ONG */}
      <div className="ong-info">
        <img
          src={animal.foto_abrigo}
          alt={animal.abrigo}
          className="ong-photo"
        />
        <div className="ong-text">
          <strong>{animal.abrigo}</strong>
          <span className="post-date">{animal.data}</span>
        </div>
      </div>

      {/* Idade e Peso */}
      <div className="animal-stats">
        <div className="stat">
          <span className="stat-label">Idade</span>
          <span className="stat-value">{animal.idade}</span>
        </div>
        <div className="divider"></div>
        <div className="stat">
          <span className="stat-label">Peso</span>
          <span className="stat-value">{animal.peso}</span>
        </div>
      </div>

      {/* Descrição */}
      <div className="animal-details">
        <p>{animal.descricao}</p>
      </div>

      {/* WhatsApp */}
      <a
        className="btn-whatsapp"
        href={`https://wa.me/55${animal.contato.replace(/\D/g, "")}`}
        target="_blank"
      >
        Falar no WhatsApp
      </a>
    </div>
  );

  if (!isMobile) {
    return (
      <div className="animal-detail-overlay" onClick={onClose}>
        <div
          className="animal-detail-modal desktop-layout"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>

          <div className="desktop-content">
            <div className="desktop-left">{renderGallery()}</div>
            <div className="desktop-right">{content}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animal-detail-mobile">
      <div className="mobile-header">
        <button className="back-btn" onClick={onClose}>
          <img src={voltar} alt="Voltar" className="back-icon" />
        </button>
      </div>

      {renderGallery()}
      {content}
    </div>
  );
}

export default AnimalDetail;
