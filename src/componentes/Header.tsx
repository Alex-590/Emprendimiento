import "../Estilos/Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header_logo">
        <div className="header_logo-badge">TEC</div>
        <div className="header_logo-text">
          <p className="header_logo-name">CEM</p>
          <p className="header_logo-subtitle">Gestión de Servicio Becario</p>
        </div>
      </div>
      <h1 className="header_title">Kleos</h1>
      <div className="header_spacer"></div>
    </header>
  );
}
