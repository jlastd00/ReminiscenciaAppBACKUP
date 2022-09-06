import { Router } from 'express';
const router = Router();

import * as terapiasController from '../controllers/terapias.controller.js'

// Obtener recursos
router.get('/', terapiasController.obtenerTerapias);

// Obtener recurso por id
router.get('/:id', terapiasController.obtenerTerapia);

// Guardar recurso
router.post('/', terapiasController.guardarTerapia);

// Actualizar recurso
router.put('/:id', terapiasController.actualizarTerapia);

// Eliminar recurso
router.delete('/:id', terapiasController.eliminarTerapia);

export default router;
