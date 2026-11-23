// =====================================================================
// CLIENTE HTTP de ms-programas, para el microservicio de cursos.
// Copie este archivo en ms-cursos/src/clients/ y COMPLÉTELO:
// la función pedir() ya está hecha; faltan las funciones que usan
// la validación, la regla de negocio y la composición.
// En el .env de ms-cursos:  PROGRAMAS_URL=http://127.0.0.1:3012
// =====================================================================
const HttpError = require('../../../ms-programas/src/utils/http-error');
const PROGRAMAS_URL = process.env.PROGRAMAS_URL;

async function pedir(ruta, token) {
  try {
    return await fetch(`${PROGRAMAS_URL}${ruta}`, {
      headers: { Authorization: token },
      signal: AbortSignal.timeout(3000),
    });
  } catch (error) {
    return null;
  }
}

async function obtenerPrograma(id, token) {
  const respuesta = await pedir(`/programas/${id}`, token);
  if (!respuesta) {
    throw new HttpError(503, 'El servicio ms-programas no responde');
  }
  if (respuesta.status === 404) {
    throw new HttpError(400, `No existe el programa con id ${id}`);
  }
  if (!respuesta.ok) {
    throw new HttpError(503, 'El servicio ms-programas respondió con error');
  }
  return respuesta.json();
}

async function obtenerProgramasPorIds(ids, token) {
  const respuesta = await pedir(`/programas?ids=${ids.join(',')}`, token);
  if (!respuesta || !respuesta.ok) {
    return null;
  }
  return respuesta.json();
}

module.exports = { pedir, obtenerPrograma, obtenerProgramasPorIds };
