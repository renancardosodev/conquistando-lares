import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../data/firebase";
import AnimalCard from "./AnimalCard";
import AnimalDetail from "./AnimalDetail"; 
import Navbar from "./Navbar";
import FilterPanel from "./FilterPanel";
import { estados } from "../data/estados";
import "../styles/Home.css";
import dogIcon from "../assets/dog.png";
import catIcon from "../assets/cat.png";
import birdIcon from "../assets/bird.png";
import rodentIcon from "../assets/rodent.png";

const filtroPadrao = {
  categoria: "cachorros",
  idadeMin: 0,
  idadeMax: 240,
  abrigo: "",
  bairro: "",
  estado: "",
  sexo: "",
  nomeBusca: "",
};

// Função para converter nome do estado para sigla
function nomeParaSigla(nomeEstado) {
  const estadoObj = estados.find(
    (e) => e.nome.toLowerCase() === nomeEstado.toLowerCase()
  );
  return estadoObj ? estadoObj.sigla : "";
}

// Função para converter sigla para nome completo
function siglaParaNome(sigla) {
  const estadoObj = estados.find((e) => e.sigla === sigla);
  return estadoObj ? estadoObj.nome : sigla;
}

function Home() {
  const [animals, setAnimals] = useState([]);
  const [filters, setFilters] = useState(filtroPadrao);
  const [tempFilters, setTempFilters] = useState(filtroPadrao);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [location, setLocation] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState(null); 

  // Pegar animais e localização
  useEffect(() => {
    async function fetchAnimals() {
      try {
        const snapshot = await getDocs(collection(db, "animais"));
        const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAnimals(lista);
      } catch (err) {
        console.error("Erro ao buscar animais:", err);
      }
    }

    fetchAnimals();

    function fetchLocationFallback(lat, lon) {
      let url = "https://ipwho.is/";
      if (lat && lon) url += `${lat},${lon}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.region) {
            const regionClean = data.region.replace(/^State of /i, "").trim();
            const sigla = nomeParaSigla(regionClean);
            if (sigla) {
              setLocation(sigla);
              setFilters((f) => ({ ...f, estado: sigla }));
              setTempFilters((f) => ({ ...f, estado: sigla }));
            }
          }
        })
        .catch(() => setLocation("Localização não disponível"));
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchLocationFallback(pos.coords.latitude, pos.coords.longitude),
        () => fetchLocationFallback(),
        { timeout: 10000 }
      );
    } else {
      fetchLocationFallback();
    }
  }, []);

  // Converte idade de string para meses
  function idadeEmMeses(idadeStr) {
    if (!idadeStr) return 0;
    const anos = idadeStr.match(/(\d+)\s*ano/)?.[1] || 0;
    const meses = idadeStr.match(/(\d+)\s*mes/)?.[1] || 0;
    return Number(anos) * 12 + Number(meses);
  }

  // Filtrar animais com base nos filtros
  const filtered = animals.filter((a) => {
    const idade = idadeEmMeses(a.idade);
    const estadoSigla = nomeParaSigla(a.estado) || a.estado;
    const buscaLower = filters.nomeBusca.toLowerCase();
    const nomeLower = a.nome?.toLowerCase() || "";

    return (
      (filters.categoria ? a.categoria === filters.categoria : true) &&
      (filters.abrigo ? a.abrigo === filters.abrigo : true) &&
      (filters.bairro ? a.bairro === filters.bairro : true) &&
      (filters.estado ? estadoSigla === filters.estado : true) &&
      (filters.sexo ? a.sexo === filters.sexo : true) &&
      idade >= filters.idadeMin &&
      idade <= filters.idadeMax &&
      (buscaLower ? nomeLower.includes(buscaLower) : true)
    );
  });

  // Bairros e abrigos disponíveis para o filtro
  const bairrosDisponiveis = Array.from(
    new Set(
      animals
        .filter(
          (a) =>
            (nomeParaSigla(a.estado) || a.estado) === tempFilters.estado &&
            a.categoria === tempFilters.categoria
        )
        .map((a) => a.bairro)
        .filter(Boolean)
    )
  );

  const abrigosDisponiveis = Array.from(
    new Set(
      animals
        .filter(
          (a) =>
            (nomeParaSigla(a.estado) || a.estado) === tempFilters.estado &&
            a.categoria === tempFilters.categoria
        )
        .map((a) => a.abrigo)
        .filter(Boolean)
    )
  );

  // Aplicar e limpar filtros
  function aplicarFiltro() {
    setFilters(tempFilters);
    setShowFilterPanel(false);
  }

  function limparFiltro() {
    setTempFilters(filtroPadrao);
  }

  function handleSearchSubmit(valorBusca) {
    setFilters((f) => ({ ...f, nomeBusca: valorBusca }));
  }

  return (
    <section className="home">
      {/* Navbar */}
      <Navbar
        location={siglaParaNome(location)}
        onLocationChange={(sigla) => {
          setLocation(sigla);
          setFilters((f) => ({ ...f, estado: sigla, bairro: "", abrigo: "" }));
          setTempFilters((f) => ({ ...f, estado: sigla, bairro: "", abrigo: "" }));
        }}
        onSearchSubmit={handleSearchSubmit}
        onFilterClick={() => setShowFilterPanel(true)}
      />

      {/* Painel de categorias */}
      <section className="categories-section">
        <h2 className="section-title">Categorias</h2>
        <div className="categories">
          {["cachorros", "gatos", "passaros", "roedores"].map((cat) => (
            <button
              key={cat}
              className={`${cat} ${filters.categoria === cat ? "active" : ""}`}
              onClick={() => {
                const novoFiltro = { ...filtroPadrao, categoria: cat };
                setFilters(novoFiltro);
                setTempFilters(novoFiltro);
              }}
            >
              {cat === "cachorros" ? (
                <img src={dogIcon} alt="Cachorros" className="category-icon" />
              ) : cat === "gatos" ? (
                <img src={catIcon} alt="Gatos" className="category-icon" />
              ) : cat === "passaros" ? (
                <img src={birdIcon} alt="Pássaros" className="category-icon" />
              ) : (
                <img src={rodentIcon} alt="Roedores" className="category-icon" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Lista de animais */}
      <section>
        <div className="animal-slider">
          {filtered.length > 0 ? (
            filtered.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onClick={() => setSelectedAnimal(animal)} 
              />
            ))
          ) : (
            <p>Nenhum animal encontrado.</p>
          )}
        </div>
      </section>

      {/* Modal de detalhe */}
      {selectedAnimal && (
        <AnimalDetail
          animal={selectedAnimal}
          onClose={() => setSelectedAnimal(null)}
        />
      )}

      {/* Painel de filtro */}
      {showFilterPanel && (
        <FilterPanel
          filters={tempFilters}
          setFilters={setTempFilters}
          onClose={() => setShowFilterPanel(false)}
          bairrosDisponiveis={bairrosDisponiveis}
          abrigosDisponiveis={abrigosDisponiveis}
          onApply={aplicarFiltro}
          onClear={limparFiltro}
        />
      )}
    </section>
  );
}

export default Home;
