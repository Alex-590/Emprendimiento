CREATE DATABASE `web_database`;
USE `web_database`;

-- web_database.Jornada definition

CREATE TABLE `Jornada` (
  `id_jornada` int NOT NULL AUTO_INCREMENT,
  `hora_de_entrada` time NOT NULL,
  `hora_de_salida` time DEFAULT NULL,
  `total_horas` int GENERATED ALWAYS AS (timestampdiff(HOUR,`hora_de_entrada`,`hora_de_salida`)) STORED,
  `fecha` date NOT NULL,
  `status` text,
  `matricula_alumno` varchar(9) NOT NULL,
  PRIMARY KEY (`id_jornada`),
  KEY `matricula_alumno` (`matricula_alumno`),
  CONSTRAINT `Jornada_ibfk_1` FOREIGN KEY (`matricula_alumno`) REFERENCES `becarios` (`matricula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- web_database.Lideres definition

CREATE TABLE `Lideres` (
  `nomina` varchar(20) NOT NULL,
  `nombre_completo` text NOT NULL,
  `correo` varchar(64) NOT NULL,
  `proyecto` text,
  `tiene_evaluacion` tinyint(1) DEFAULT '0',
  `calificacion_evaluacion_cumplimiento` float DEFAULT NULL,
  PRIMARY KEY (`nomina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- web_database.becarios definition

CREATE TABLE `becarios` (
  `matricula` varchar(9) NOT NULL,
  `nombre_completo` text NOT NULL,
  `email` varchar(64) NOT NULL,
  `tipo_beca` enum('Talento Academico','Talento Estudiantil','Talento Deportivo','Talento Emprendedor','Talento Creativo','Talento Transformador','Lideres del Manana','Socioeconomica') NOT NULL,
  `porcentaje_beca` int DEFAULT NULL,
  `campus` enum('Estado de Mexico','Santa Fe','Ciudad de Mexico','Toluca','Cuernavaca','Puebla','Hidalgo','Queretaro','Monterrey','Laguna','Guadalajara') NOT NULL,
  `semestre` enum('1','2','3','4','5','6','7','8','9','10') NOT NULL,
  `clave_carrera` text,
  `descripcion_carrera` text,
  `nomina_lider` varchar(20) DEFAULT NULL,
  `realiza_servicio` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`matricula`),
  KEY `nomina_lider` (`nomina_lider`),
  CONSTRAINT `becarios_ibfk_1` FOREIGN KEY (`nomina_lider`) REFERENCES `Lideres` (`nomina`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;