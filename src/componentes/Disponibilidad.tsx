import { useState } from "react";
import type { ReactNode, ChangeEvent } from "react";
import "../Estilos/Disponibilidad.css";

// Estructura de cada día del horario semanal.
interface Dia {
  dia: string;
  activo: boolean;
  inicio: string;
  fin: string;
}

// Estructura de un bloque específico (horario puntual, fuera del horario semanal).
interface Bloque {
  id: number;
  titulo: string;
  detalle: string;
}

// Valores iniciales del horario semanal. Sábado y domingo empiezan apagados.
const DIAS_INIT: Dia[] = [
  { dia: "Lunes", activo: true, inicio: "09:00", fin: "13:00" },
  { dia: "Martes", activo: true, inicio: "09:00", fin: "13:00" },
  { dia: "Miércoles", activo: true, inicio: "14:00", fin: "18:00" },
  { dia: "Jueves", activo: true, inicio: "09:00", fin: "13:00" },
  { dia: "Viernes", activo: true, inicio: "10:00", fin: "12:00" },
  { dia: "Sábado", activo: false, inicio: "09:00", fin: "13:00" },
  { dia: "Domingo", activo: false, inicio: "09:00", fin: "13:00" },
];

/*
  Componente de iconos.

  Guarda los trazos de cada icono en el objeto "paths" y regresa
  el que corresponda al nombre recibido, dentro de un mismo svg.
  Así no se necesita una librería de iconos.
*/
function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </>
    ),
  };
  // stroke="currentColor" hace que el icono tome el color del texto del contenedor.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

/*
  Interruptor para activar o desactivar un día.

  Recibe el estado desde el componente padre. La clase "on" es la que
  cambia el color y mueve el círculo desde el CSS.
*/
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`disp-toggle${on ? " on" : ""}`} onClick={onClick} aria-pressed={on}>
      <span className="disp-toggle-knob" />
    </button>
  );
}

// Componente principal de la sección de disponibilidad.
export function Disponibilidad() {
  // Estado del horario semanal.
  const [dias, setDias] = useState<Dia[]>(DIAS_INIT);
  // Estado de los bloques específicos.
  const [bloques, setBloques] = useState<Bloque[]>([
    { id: 1, titulo: "Viernes, 17 De Julio", detalle: "15:00 – 17:00 · Asesoría especial pre-entrega" },
  ]);

  // Prende o apaga el día que está en la posición i.
  const toggleDia = (i: number) =>
    setDias((prev) => prev.map((d, idx) => (idx === i ? { ...d, activo: !d.activo } : d)));
  // Actualiza la hora de inicio o de fin del día que está en la posición i.
  const setHora = (i: number, campo: "inicio" | "fin", valor: string) =>
    setDias((prev) => prev.map((d, idx) => (idx === i ? { ...d, [campo]: valor } : d)));
  // Quita de la lista el bloque con el id recibido.
  const borrarBloque = (id: number) => setBloques((prev) => prev.filter((b) => b.id !== id));

  return (
    <section className="disp-card">
      {/* Encabezado: icono, título y descripción */}
      <div className="disp-titlegroup">
        <div className="disp-icon-box">
          <Icon name="calendar" size={22} />
        </div>
        <div>
          <h2 className="disp-title">Configuración de Disponibilidad</h2>
          <p className="disp-sub">Define tu horario semanal por defecto y excepciones.</p>
        </div>
      </div>

      <p className="disp-section-label">Horario por defecto</p>

      {/* Se dibuja una fila por cada día del arreglo. Las horas se deshabilitan si el día está apagado. */}
      <div className="disp-days">
        {dias.map((d, i) => (
          <div className="disp-day-row" key={d.dia}>
            <Toggle on={d.activo} onClick={() => toggleDia(i)} />
            <span className="disp-day-name">{d.dia}</span>
            <input
              type="time"
              className="disp-time"
              value={d.inicio}
              disabled={!d.activo}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setHora(i, "inicio", e.target.value)}
            />
            <span className="disp-dash">–</span>
            <input
              type="time"
              className="disp-time"
              value={d.fin}
              disabled={!d.activo}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setHora(i, "fin", e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Pendiente conectar con el backend para guardar el horario */}
      <button type="button" className="disp-save-btn">
        Guardar horario por defecto
      </button>

      {/* Encabezado de la sección de bloques específicos */}
      <div className="disp-section-head">
        <p className="disp-section-label">Bloques específicos</p>
        <button type="button" className="disp-add-btn">
          <Icon name="plus" size={15} /> Agregar
        </button>
      </div>

      {/* Lista de bloques específicos, cada uno con su botón para eliminarlo */}
      <div className="disp-blocks">
        {bloques.map((b) => (
          <div className="disp-block" key={b.id}>
            <div>
              <div className="disp-block-title">{b.titulo}</div>
              <div className="disp-block-detail">{b.detalle}</div>
            </div>
            <button type="button" className="disp-trash" onClick={() => borrarBloque(b.id)} aria-label="Eliminar bloque">
              <Icon name="trash" size={17} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
