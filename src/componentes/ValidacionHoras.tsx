import { useState } from "react";
import type { ReactNode } from "react";
import "../Estilos/ValidacionHoras.css";

// Estados posibles de una solicitud de horas.
type Estado = "pendiente" | "aprobada" | "rechazada";

// Estructura de cada solicitud. "ini" son las iniciales que se muestran en el avatar.
interface Solicitud {
  id: number;
  ini: string;
  nombre: string;
  matricula: string;
  fecha: string;
  horas: number;
  descripcion: string;
  estado: Estado;
}

// Solicitudes de ejemplo con las que arranca el componente.
const SOLICITUDES_INIT: Solicitud[] = [
  { id: 1, ini: "VR", nombre: "Valentina Ruiz", matricula: "A01555321", fecha: "16 ago 2026", horas: 3, descripcion: "Diseño de piezas visuales para el evento de difusión institucional.", estado: "pendiente" },
  { id: 2, ini: "DH", nombre: "Diego Hernández", matricula: "A01876543", fecha: "15 ago 2026", horas: 4.5, descripcion: "Migración de datos legacy a la nueva base de datos relacional.", estado: "pendiente" },
  { id: 3, ini: "MG", nombre: "María González", matricula: "A01234567", fecha: "11 ago 2026", horas: 4, descripcion: "Reunión semanal con el equipo + investigación de bibliografía para el proyecto.", estado: "pendiente" },
];

// Pestañas del filtro y la relación de cada una con su estado.
// "Todas" no aparece en TAB_ESTADO porque no filtra por estado.
const TABS = ["Pendientes", "Aprobadas", "Rechazadas", "Todas"] as const;
type Tab = (typeof TABS)[number];
const TAB_ESTADO: Record<Exclude<Tab, "Todas">, Estado> = {
  Pendientes: "pendiente",
  Aprobadas: "aprobada",
  Rechazadas: "rechazada",
};

/*
  Componente de iconos.

  Guarda los trazos de cada icono en el objeto "paths" y regresa
  el que corresponda al nombre recibido, dentro de un mismo svg.
*/
function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    clipboard: (
      <>
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="m9 14 2 2 4-4" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    x: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    pencil: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

// Círculo con las iniciales del alumno.
function Avatar({ ini }: { ini: string }) {
  return <div className="val-avatar">{ini}</div>;
}

// Componente principal del panel de validación de horas.
export function ValidacionHoras() {
  // Lista de solicitudes y pestaña seleccionada.
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(SOLICITUDES_INIT);
  const [tab, setTab] = useState<Tab>("Pendientes");

  // Pendientes se usa para el contador del encabezado.
  const pendientes = solicitudes.filter((s) => s.estado === "pendiente");
  // Visibles son las solicitudes que se muestran según la pestaña activa.
  const visibles = tab === "Todas" ? solicitudes : solicitudes.filter((s) => s.estado === TAB_ESTADO[tab]);

  // Cambia el estado de una solicitud al aceptarla o rechazarla.
  const setEstado = (id: number, estado: Estado) =>
    setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado } : s)));

  return (
    <section className="val-card">
      <div className="val-panel-head">
        {/* Encabezado: icono, título y número de solicitudes pendientes */}
        <div className="val-titlegroup">
          <div className="val-icon-box">
            <Icon name="clipboard" size={22} />
          </div>
          <div>
            <h2 className="val-title">Panel de Validación de Horas</h2>
            <p className="val-sub">{pendientes.length} solicitudes pendientes de revisión</p>
          </div>
        </div>

        {/* Pestañas del filtro. La clase "active" marca la seleccionada. */}
        <div className="val-tabs">
          {TABS.map((t) => (
            <button key={t} type="button" className={`val-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="val-table-wrap">
        <table className="val-table">
          {/* Encabezados de la tabla */}
          <thead>
            <tr>
              <th className="val-th">Alumno</th>
              <th className="val-th">Fecha</th>
              <th className="val-th">Horas</th>
              <th className="val-th">Descripción</th>
              <th className="val-th val-th--right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Mensaje que aparece cuando la pestaña no tiene solicitudes */}
            {visibles.length === 0 && (
              <tr>
                <td className="val-empty" colSpan={5}>
                  No hay solicitudes en esta categoría.
                </td>
              </tr>
            )}
            {/* Una fila por solicitud visible */}
            {visibles.map((s) => (
              <tr key={s.id} className="val-row">
                <td className="val-td">
                  <div className="val-alumno">
                    <Avatar ini={s.ini} />
                    <div>
                      <div className="val-alumno-name">{s.nombre}</div>
                      <div className="val-alumno-mat">{s.matricula}</div>
                    </div>
                  </div>
                </td>
                <td className="val-td val-nowrap">{s.fecha}</td>
                <td className="val-td val-horas">{s.horas}h</td>
                <td className="val-td val-desc">{s.descripcion}</td>
                <td className="val-td">
                  {/* Si sigue pendiente se muestran los botones; si ya se revisó, solo la etiqueta del resultado. */}
                  {s.estado === "pendiente" ? (
                    <div className="val-actions">
                      <div className="val-actions-row">
                        <button type="button" className="val-btn val-btn--accept" onClick={() => setEstado(s.id, "aprobada")}>
                          <Icon name="check" size={15} /> Aceptar
                        </button>
                        <button type="button" className="val-btn val-btn--reject" onClick={() => setEstado(s.id, "rechazada")}>
                          <Icon name="x" size={15} /> Rechazar
                        </button>
                      </div>
                      {/* Pendiente conectar la edición de la solicitud */}
                      <button type="button" className="val-btn val-btn--edit">
                        <Icon name="pencil" size={14} /> Modificar
                      </button>
                    </div>
                  ) : (
                    <div className="val-badge-wrap">
                      <span className={`val-badge ${s.estado === "aprobada" ? "val-badge--ok" : "val-badge--no"}`}>
                        {s.estado === "aprobada" ? "Aprobada" : "Rechazada"}
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
