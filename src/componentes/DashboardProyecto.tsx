import type { ReactNode } from "react";
import "../Estilos/DashboardProyecto.css";

// Estructura de cada becario. "ini" son las iniciales del avatar
// y "pct" el porcentaje de avance hacia la meta.
interface Becario {
  ini: string;
  nombre: string;
  matricula: string;
  carrera: string;
  hechas: number;
  pend: number;
  pct: number;
}

// Horas de servicio becario que debe cumplir cada alumno.
const META_HORAS = 80;

// Datos de ejemplo de los becarios a cargo del líder.
const BECARIOS: Becario[] = [
  { ini: "MG", nombre: "María González", matricula: "A01234567", carrera: "ITC", hechas: 9, pend: 4, pct: 11 },
  { ini: "VR", nombre: "Valentina Ruiz", matricula: "A01555321", carrera: "LAE", hechas: 5, pend: 3, pct: 6 },
  { ini: "AM", nombre: "Andrés Martínez", matricula: "A01998877", carrera: "IIS", hechas: 5, pend: 0, pct: 6 },
  { ini: "DH", nombre: "Diego Hernández", matricula: "A01876543", carrera: "IMT", hechas: 3, pend: 4.5, pct: 4 },
];

/*
  Componente de iconos.

  Guarda los trazos de cada icono en el objeto "paths" y regresa
  el que corresponda al nombre recibido, dentro de un mismo svg.
*/
function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    chevron: <polyline points="9 18 15 12 9 6" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

// Círculo con las iniciales del becario.
function Avatar({ ini }: { ini: string }) {
  return <div className="dash-avatar">{ini}</div>;
}

// Métrica del encabezado. "className" define el color del número.
function Metric({ label, valor, className }: { label: string; valor: string; className: string }) {
  return (
    <div className="dash-metric">
      <p className="dash-metric-label">{label}</p>
      <p className={`dash-metric-val ${className}`}>{valor}</p>
    </div>
  );
}

// Componente principal del dashboard del proyecto.
export function DashboardProyecto() {
  return (
    <section className="dash-card">
      <div className="dash-head">
        {/* Encabezado: icono, título y cantidad de becarios */}
        <div className="dash-titlegroup">
          <div className="dash-icon-box">
            <Icon name="users" size={22} />
          </div>
          <div>
            <h2 className="dash-title">Dashboard General del Proyecto</h2>
            <p className="dash-sub">{BECARIOS.length} alumnos becarios bajo tu cargo</p>
          </div>
        </div>

        {/* Métricas generales del equipo */}
        <div className="dash-metrics">
          <Metric label="Avance del equipo" valor="7%" className="dash-c-blue" />
          <Metric label="Horas aprobadas" valor="22h" className="dash-c-green" />
          <Metric label="Por revisar" valor="11.5h" className="dash-c-orange" />
        </div>
      </div>

      {/* Una tarjeta por becario con su avance */}
      <div className="dash-grid">
        {BECARIOS.map((b) => (
          <div className="dash-item" key={b.matricula}>
            <div className="dash-becario-head">
              <div className="dash-alumno">
                <Avatar ini={b.ini} />
                <div>
                  <div className="dash-alumno-name">{b.nombre}</div>
                  <div className="dash-alumno-mat">{b.matricula} · {b.carrera}</div>
                </div>
              </div>
              <span className="dash-chevron">
                <Icon name="chevron" size={18} />
              </span>
            </div>

            {/* Barra de avance: el ancho del relleno es el porcentaje del becario. */}
            <div className="dash-progress">
              <div className="dash-progress-fill" style={{ width: `${b.pct}%` }} />
            </div>

            {/* Horas hechas contra la meta. Las pendientes solo se muestran si hay. */}
            <div className="dash-foot">
              <span className="dash-done">
                {b.hechas}h <span className="dash-meta-h">/ {META_HORAS}h</span>
              </span>
              {b.pend > 0 && <span className="dash-pend">+{b.pend}h pend.</span>}
              <span className="dash-pct">{b.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
