// Componentes que forman la vista del líder de proyecto.
import { ValidacionHoras } from "./ValidacionHoras";
import { Disponibilidad } from "./Disponibilidad";
import { DashboardProyecto } from "./DashboardProyecto";
import "../Estilos/PanelLider.css";

/*
  Vista de Líder de Proyecto.

  Este componente solo arma el layout: acomoda los tres componentes
  de la vista y el texto del encabezado. La lógica de cada sección
  vive dentro de su propio componente.
*/
export function PanelLider() {
  return (
    <main className="panel-main">
      {/* Encabezado de la vista */}
      <p className="panel-eyebrow">Vista de Líder de Proyecto</p>
      <h1 className="panel-h1">Panel de gestión del proyecto</h1>
      <p className="panel-lead">
        Valida las horas reportadas por tu equipo, configura tu disponibilidad para asesorías y monitorea el avance de
        cada becario hacia su meta semestral.
      </p>

      {/* Validación de horas y disponibilidad van juntas en la misma cuadrícula */}
      <div className="panel-grid">
        <ValidacionHoras />
        <Disponibilidad />
      </div>

      {/* El dashboard va abajo, ocupando todo el ancho */}
      <DashboardProyecto />
    </main>
  );
}
