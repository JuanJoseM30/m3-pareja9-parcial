# ms-programas · Contrato de la API

Microservicio **proveedor** del examen del Módulo 3 (solo lectura). Puerto: **3012**.
Lo consulta el microservicio de cursos, que guarda el atributo `programa_id`.

## Cómo ejecutarlo

Requisitos: Node.js 22.9 o superior, MySQL 8 y ms-usuarios corriendo (para obtener tokens).

1. Como root en MySQL:

```sql
CREATE DATABASE programas_db;
CREATE USER 'programas_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON programas_db.* TO 'programas_user'@'localhost';
```

2. `mysql -u programas_user -p programas_db` y luego `SOURCE db/schema.sql;`
3. `npm install`
4. Copiar `.env.example` como `.env`. `JWT_SECRET` debe ser **la misma de ms-usuarios**.
5. `npm run dev`

## Representación

```json
{"id": 1, "nombre_programa": "Ingeniería Multimedia", "facultad": "Ingeniería", "creditos_max_curso": 4}
```

## Atributos

| Atributo | Tipo |
|---|---|
| id | entero |
| nombre_programa | texto |
| facultad | texto |
| creditos_max_curso | entero |

## Endpoints

Todas las peticiones llevan `Authorization: Bearer <token>`. Cualquier rol autenticado puede consultar.

| Operación | Método | URI | Respuesta exitosa | Errores |
|---|---|---|---|---|
| Listar | GET | /programas | 200 arreglo | 401 |
| Consultar por lotes | GET | /programas?ids=1,3 | 200 arreglo (solo los que existen) | 400 · 401 |
| Obtener | GET | /programas/:id | 200 objeto | 400 · 401 · 404 |

## Datos iniciales

| id | nombre_programa | facultad | creditos_max_curso |
|---|---|---|---|
| 1 | Ingeniería Multimedia | Ingeniería | 4 |
| 2 | Ingeniería Electrónica | Ingeniería | 5 |
| 3 | Comunicación Social | Comunicación | 3 |
| 4 | Ingeniería Industrial | Ingeniería | 6 |

## Para el consumidor

La carpeta `para-el-consumidor/` trae `programas.client.js` con la función `pedir()` ya escrita (token y tiempo de espera). Se copia en `ms-cursos/src/clients/` y se completa.

## Frontend del examen

La carpeta `frontend/` trae `index.html`, ya configurado para ms-cursos y ms-programas. No se modifica: se copia al `DocumentRoot` del host virtual del examen en servidor2, y desde Windows se abre `http://examen.<dominio>/`. La página inicia sesión por `/api/usuarios/login` y muestra los listados de `/api/cursos` y `/api/programas` por el mismo nombre, así que no necesita CORS.

## Me consultan

| Me consulta | Peticiones que me hace |
|---|---|
| ms-cursos | `GET /programas/:id` (validar) · `GET /programas?ids=…` (componer) |
