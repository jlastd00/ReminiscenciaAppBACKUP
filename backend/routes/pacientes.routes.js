import { Router } from 'express';
const router = Router();

import * as pacientesController from '../controllers/pacientes.controller.js'

// Obtener recursos
router.get('/', pacientesController.obtenerPacientes);

// Obtener recurso por id
router.get('/:id', pacientesController.obtenerPaciente);

// Guardar recurso
router.post('/', pacientesController.guardarPaciente);

// Actualizar recurso
router.put('/:id', pacientesController.actualizarPaciente);

// Eliminar recurso
router.delete('/:id', pacientesController.eliminarPaciente);

export default router;
