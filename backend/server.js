import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import path from 'path'

import properties from './config/properties.js'
import indexRoutes from './routes/index.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import recursosRoutes from './routes/recursos.routes.js'
import pacientesRoutes from './routes/pacientes.routes.js'
import terapiasRoutes from './routes/terapias.routes.js'
import './config/database.js'

// Initializations
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', indexRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/recursos', recursosRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/terapias', terapiasRoutes);
/*
app.use(express.static(path.join(__dirname, '../public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
}); 
*/
// Server running
app.listen(properties.PORT);
console.log('Server running on port ', properties.PORT);
