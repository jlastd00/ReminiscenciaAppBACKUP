import { Router } from 'express';
const router = Router();

import * as usuariosController from '../controllers/usuarios.controller.js'

// Obtener usuarios
router.get('/', usuariosController.obtenerUsuarios);

// Obtener usuario por id
router.get('/:id', usuariosController.obtenerUsuario);

// Guardar usuario
router.post('/', usuariosController.guardarUsuario);

// Actualizar usuario
router.put('/:id', usuariosController.actualizarUsuario);

// Eliminar usuario
router.delete('/:id', usuariosController.eliminarUsuario);

export default router;
