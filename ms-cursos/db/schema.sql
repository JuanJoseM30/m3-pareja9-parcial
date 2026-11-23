SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS cursos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  codigo      VARCHAR(20)  NOT NULL UNIQUE,
  nombre      VARCHAR(100) NOT NULL,
  creditos    INT          NOT NULL,
  cupo        INT          NOT NULL,
  semestre    VARCHAR(6)   NOT NULL,
  programa_id INT          NOT NULL
);

INSERT INTO cursos (codigo, nombre, creditos, cupo, semestre, programa_id) VALUES
  ('RSM-101', 'Redes y Servicios Multimedia', 3, 30, '2026-2', 1),
  ('BDM-201', 'Bases de Datos Multimedia',    4, 25, '2026-2', 1),
  ('PRG-110', 'Programación Web',             3, 35, '2026-1', 2);
