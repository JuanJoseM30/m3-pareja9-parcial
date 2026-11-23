// CAPA DE PRESENTACIÓN: rutas de programas (solo lectura, cualquier rol autenticado)
const { Router } = require('express');
const controller = require('../controllers/programas.controller');
const { verificarToken } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);                // todas las rutas exigen token

router.get('/', controller.listar);       // GET /programas  y  GET /programas?ids=1,3
router.get('/:id', controller.obtener);   // GET /programas/:id

module.exports = router;
