// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Aplica las validaciones y las reglas del negocio.
// No sabe nada de HTTP (req/res) ni de cómo se guardan los datos.
// =====================================================================
const repo = require('../repositories/curso.repository');
const { validarCurso, construirCurso } = require('../models/curso');
const { obtenerPrograma, obtenerProgramasPorIds } = require('../clients/programas.client');
const HttpError = require('../utils/http-error');

function formatearPrograma(p) {
  if (!p) return null;
  return {
    id: p.id,
    nombre_programa: p.nombre_programa,
    facultad: p.facultad,
  };
}

async function componer(cursos, auth) {
  const ids = [...new Set(cursos.map((c) => c.programa_id))];
  if (ids.length === 0) return cursos;

  const lista = await obtenerProgramasPorIds(ids, auth);
  if (!lista) {
    return cursos.map((c) => ({
      ...c,
      programa: null,
      aviso: 'El proveedor ms-programas no responde',
    }));
  }

  const porId = new Map(lista.map((p) => [p.id, formatearPrograma(p)]));
  return cursos.map((c) => ({
    ...c,
    programa: porId.get(c.programa_id) || null,
  }));
}

async function listar(filtros, auth) {
  const cursos = await repo.findAll(filtros);
  return componer(cursos, auth);
}

async function obtener(id, auth) {
  const curso = await repo.findById(id);
  if (!curso) throw new HttpError(404, `No existe el curso con id ${id}`);
  const [compuesto] = await componer([curso], auth);
  return compuesto;
}

async function crear(datos, auth) {
  const errores = validarCurso(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  const curso = construirCurso(datos);

  if (await repo.findByCodigo(curso.codigo)) {
    throw new HttpError(409, `Ya existe un curso con el codigo ${curso.codigo}`);
  }

  const programa = await obtenerPrograma(curso.programa_id, auth);
  if (curso.creditos > programa.creditos_max_curso) {
    throw new HttpError(
      400,
      `Los creditos del curso (${curso.creditos}) superan el máximo permitido por el programa (${programa.creditos_max_curso})`
    );
  }

  const creado = await repo.create(curso);
  return { ...creado, programa: formatearPrograma(programa) };
}

async function actualizar(id, datos, auth) {
  const errores = validarCurso(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);

  const curso = construirCurso(datos);

  if (!(await repo.findById(id))) {
    throw new HttpError(404, `No existe el curso con id ${id}`);
  }

  const otro = await repo.findByCodigo(curso.codigo);
  if (otro && otro.id !== id) {
    throw new HttpError(409, `Ya existe otro curso con el codigo ${curso.codigo}`);
  }

  const programa = await obtenerPrograma(curso.programa_id, auth);
  if (curso.creditos > programa.creditos_max_curso) {
    throw new HttpError(
      400,
      `Los creditos del curso (${curso.creditos}) superan el máximo permitido por el programa (${programa.creditos_max_curso})`
    );
  }

  const actualizado = await repo.update(id, curso);
  return { ...actualizado, programa: formatearPrograma(programa) };
}

async function eliminar(id) {
  const eliminado = await repo.remove(id);
  if (!eliminado) throw new HttpError(404, `No existe el curso con id ${id}`);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };