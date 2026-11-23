-- db/schema.sql — base de datos de ms-programas
SET NAMES utf8mb4;

CREATE TABLE programas (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  nombre_programa      VARCHAR(100) NOT NULL,
  facultad             VARCHAR(100) NOT NULL,
  creditos_max_curso   INT NOT NULL
);

INSERT INTO programas (nombre_programa, facultad, creditos_max_curso) VALUES
  ('Ingeniería Multimedia', 'Ingeniería', 4),
  ('Ingeniería Electrónica', 'Ingeniería', 5),
  ('Comunicación Social', 'Comunicación', 3),
  ('Ingeniería Industrial', 'Ingeniería', 6);
