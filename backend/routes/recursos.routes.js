import { Router } from 'express';
const router = Router();

import * as recursosController from '../controllers/recursos.controller.js'

// Obtener recursos
router.get('/', recursosController.obtenerRecursos);

// Obtener recurso por id
router.get('/:id', recursosController.obtenerRecurso);

// Guardar recurso
router.post('/', recursosController.guardarRecurso);

// Actualizar recurso
router.put('/:id', recursosController.actualizarRecurso);

// Eliminar recurso
router.delete('/:id', recursosController.eliminarRecurso);

export default router;
