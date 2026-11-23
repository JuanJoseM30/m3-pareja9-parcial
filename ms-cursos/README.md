# ms-cursos · Contrato de la API

## Descripción
- **Entidad que gestiona:** Cursos (Evaluación del Módulo 3, microservicio n.º 1).
- **Pareja:** Santiago Garzón Gómez · Juan José Marín Orejuela.
- **Puerto en el que escucha:** 3011, en `127.0.0.1`.
- **Base de datos:** `cursos_db` (MySQL 8).
- **Proveedor asociado:** `ms-programas` (puerto 3012), configurado mediante `PROGRAMAS_URL`.
- **Arquitectura en capas:** routes → controller → service → repository, con modelo (`models/curso.js`), cliente HTTP (`clients/programas.client.js`) y `HttpError` (`utils/http-error.js`).

## Cómo ejecutarlo

1. Crear la base de datos y su usuario (en MySQL, como root):

```sql
CREATE DATABASE cursos_db CHARACTER SET utf8mb4;
CREATE USER 'cursos_user'@'localhost' IDENTIFIED BY '<CLAVE>';
GRANT ALL PRIVILEGES ON cursos_db.* TO 'cursos_user'@'localhost';
USE cursos_db;
SOURCE ruta/completa/ms-cursos/db/schema.sql;
```

2. Instalar dependencias y configurar:

```bash
npm install
cp .env.example .env
```

En el `.env` ajustar `DB_PASSWORD`, poner la **misma** `JWT_SECRET` que tiene ms-usuarios y configurar `PROGRAMAS_URL=http://127.0.0.1:3012`.

3. Arrancar (ms-usuarios en el 3001 y ms-programas en el 3012):

```bash
npm start
```

Cada petición queda registrada en la terminal con su método, ruta y código de respuesta:

```text
10:15:02 GET /cursos?semestre=2026-2 → 200
```

## Representación

```json
{
  "id": 1,
  "codigo": "RSM-101",
  "nombre": "Redes y Servicios Multimedia",
  "creditos": 3,
  "cupo": 30,
  "semestre": "2026-2",
  "programa_id": 1,
  "programa": {
    "id": 1,
    "nombre_programa": "Ingeniería Multimedia",
    "facultad": "Ingeniería"
  }
}
```

## Atributos

| Atributo | Tipo | Reglas y obligatoriedad |
|---|---|---|
| id | entero | No: lo asigna la base de datos |
| codigo | texto | Sí (no vacío). **Único → 409** |
| nombre | texto | Sí (no vacío) |
| creditos | entero | Sí, entre 1 y 6. No puede superar `creditos_max_curso` del programa (**→ 400**) |
| cupo | entero | Sí, mayor que 0 |
| semestre | texto | Sí, formato `AAAA-1` o `AAAA-2` |
| programa_id | entero | Sí, entero positivo. Debe existir en `ms-programas` (**→ 400** si no existe, **→ 503** si no responde) |

## Endpoints

| Operación | Método + URI | Respuesta y errores |
|---|---|---|
| Listar | GET `/cursos` | 200 arreglo (compuesto con `programa`) |
| Filtrar por semestre | GET `/cursos?semestre=2026-2` | 200 arreglo (compuesto con `programa`) |
| Consultar por lotes | GET `/cursos?ids=1,3` | 200 arreglo · 400 |
| Obtener | GET `/cursos/:id` | 200 objeto (compuesto con `programa`) · 400 · 404 |
| Crear | POST `/cursos` | 201 objeto + Location · 400 · 409 · 503 |
| Actualizar | PUT `/cursos/:id` | 200 objeto · 400 · 404 · 409 · 503 |
| Eliminar | DELETE `/cursos/:id` | 204 · 400 · 404 |

Todos los endpoints pueden responder además **401** y **403** (ver Seguridad).

## Ejemplo para crear

```json
{
  "codigo": "MAT-101-1",
  "nombre": "Cálculo I",
  "creditos": 4,
  "cupo": 30,
  "semestre": "2026-2",
  "programa_id": 1
}
```

## Errores

Todos los errores responden un JSON con `error` y, en los 400 de validación, `detalles`:

```json
{ "error": "Datos inválidos", "detalles": ["creditos es obligatorio y debe ser un entero entre 1 y 6"] }
```

| Código | Cuándo |
|---|---|
| 400 | Datos inválidos, `programa_id` inexistente, o `creditos` supera `creditos_max_curso` |
| 401 | Falta el token, es inválido o venció |
| 403 | El rol del token no tiene permiso |
| 404 | No existe el curso solicitado |
| 409 | Ya existe otro curso con el mismo `codigo` |
| 503 | El proveedor `ms-programas` no responde al crear o actualizar |

## Seguridad

Todas las rutas de `/cursos` exigen la cabecera `Authorization: Bearer <token>`.
El token se obtiene con el login de ms-usuarios (`POST http://127.0.0.1:3001/usuarios/login`)
y ms-cursos lo verifica con la `JWT_SECRET` del `.env` (`middlewares/auth.js`), sin preguntarle a ms-usuarios.

| Operación | Roles permitidos |
|---|---|
| GET (listar, filtrar, obtener) | Cualquier rol autenticado |
| POST, PUT, DELETE | Solo `administrador` (los demás → 403) |

## Pruebas

La colección de Postman está en `docs/ms-cursos.postman_collection.json`.
Antes de correrla: hacer el login (caso 0) y pegar el token en la variable `token_admin` de la colección.