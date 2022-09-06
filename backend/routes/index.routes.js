import { Router } from 'express';
const router = Router();

import * as indexController from '../controllers/index.controller.js'
import * as listaPruebasController from '../controllers/listaPruebas.controller.js'
import * as listaActividadesLaboralesController from '../controllers/listaActividadesLaborales.controller.js'

// Home page
router.get('/', indexController.index);

// Obtener lista de pruebas 
router.get('/lista-pruebas', listaPruebasController.obtenerListaPruebas);

// Obtener lista de actividades laborales 
router.get('/lista-actividades-laborales', listaActividadesLaboralesController.obtenerListaActividadesLaborales);

export default router;
