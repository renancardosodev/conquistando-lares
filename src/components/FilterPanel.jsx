import "../styles/FilterPanel.css";
import React, { useState, useEffect } from "react";
import { Range } from "react-range";

function FilterPanel({
  filters,
  setFilters,
  onClose,
  bairrosDisponiveis,
  abrigosDisponiveis,
  onApply,
  onClear,
}) {
  const [idadeRange, setIdadeRange] = useState([
    filters.idadeMin,
    filters.idadeMax,
  ]);

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      idadeMin: idadeRange[0],
      idadeMax: idadeRange[1],
    }));
  }, [idadeRange, setFilters]);

  function formatMeses(meses) {
    if (meses <= 11) return `${meses} meses`;
    const anos = Math.floor(meses / 12);
    const mesesRest = meses % 12;
    return mesesRest > 0
      ? `${anos} ano(s) e ${mesesRest} meses`
      : `${anos} ano(s)`;
  }

  return (
    <div className="filter-panel">
      <button className="close-btn" onClick={onClose}>
        ✕
      </button>

      <h3>Filtros</h3>

      {/* Categoria */}
      <div className="filter-group">
        <label>Categoria:</label>
        <select
          value={filters.categoria}
          onChange={(e) =>
            setFilters((f) => ({ ...f, categoria: e.target.value }))
          }
        >
          <option value="cachorros">Cachorros</option>
          <option value="gatos">Gatos</option>
          <option value="passaros">Pássaros</option>
          <option value="roedores">Roedores</option>
        </select>
      </div>

      {/* Sexo */}
      <div className="filter-group">
        <label>Sexo:</label>
        <select
          value={filters.sexo}
          onChange={(e) => setFilters((f) => ({ ...f, sexo: e.target.value }))}
        >
          <option value="">Todos</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </div>

      {/* Idade com Range Slider duplo */}
      <div className="filter-group">
        <label>Idade:</label>

        <Range
          step={1}
          min={0}
          max={240}
          values={idadeRange}
          onChange={(values) => setIdadeRange(values)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                background: "#ddd",
                borderRadius: "4px",
                width: "100%",
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "15px",
                width: "15px",
                borderRadius: "50%",
                backgroundColor: "#0077ff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 0 2px rgba(0,0,0,0.3)",
              }}
            />
          )}
        />

        <div style={{ marginTop: "8px", fontSize: "0.9rem", color: "#555" }}>
          {formatMeses(idadeRange[0])} — {formatMeses(idadeRange[1])}
        </div>
      </div>

      {/* Bairro */}
      {!filters.abrigo && (
        <div className="filter-group">
          <label>Bairro:</label>
          <select
            value={filters.bairro}
            onChange={(e) =>
              setFilters((f) => ({ ...f, bairro: e.target.value }))
            }
          >
            <option value="">Todos</option>
            {bairrosDisponiveis.map((bairro) => (
              <option key={bairro} value={bairro}>
                {bairro}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Abrigo */}
      <div className="filter-group">
        <label>Abrigo:</label>
        <select
          value={filters.abrigo}
          onChange={(e) =>
            setFilters((f) => ({ ...f, abrigo: e.target.value }))
          }
        >
          <option value="">Todos</option>
          {abrigosDisponiveis.map((abrigo) => (
            <option key={abrigo} value={abrigo}>
              {abrigo}
            </option>
          ))}
        </select>
      </div>

      {/* Botões */}
      <div className="filter-actions">
        <button className="clear-btn" onClick={onClear}>
          Limpar tudo
        </button>
        <button className="filter-btn" onClick={onApply}>
          Filtrar
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;
