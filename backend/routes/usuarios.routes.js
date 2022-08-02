import { Router } from 'express';
const router = Router();

import * as usuariosController from '../controllers/usuarios.controller.js'

// Obtener usuarios
router.get('/', usuariosController.obtenerUsuarios);

// Obtener usuario por id
router.get('/:id', usuariosController.obtenerUsuario);

// Guardar usuario
router.post('/', usuariosController.guardarUsuario);

// Verificar email
router.post('/verificar-cuenta', usuariosController.verificarCuenta);

// Recuperar password
router.post('/recuperar-password', usuariosController.recuperarPassword);

// Validar reset token
router.post('/validar-reset-token', usuariosController.validarResetToken);

// Resetear password
router.post('/nuevo-password', usuariosController.resetearPassword);

// Iniciar sesión
router.post('/login', usuariosController.login);

// Actualizar usuario
router.put('/:id', usuariosController.actualizarUsuario);

// Eliminar usuario
router.delete('/:id', usuariosController.eliminarUsuario);

export default router;


