import Usuario from '../models/Usuario.js'

// Obtener todos los usuarios
export async function obtenerUsuarios(req, res) {
    const usuarios = await Usuario.find().populate('pacientes');
    if (usuarios.length === 0) {
        return res.status(409).json({ resultado: "ERROR", mensaje: "No hay usuarios en la base de datos" });
    }
    return res.status(200).json({ resultado: "OK", usuarios: usuarios });
}

// Obtener un usuario por id
export async function obtenerUsuario(req, res) {
    await Usuario.findById(req.params.id).populate('pacientes')
        .then((usuario) => {
            return res.status(200).json({ resultado: "OK", usuario: usuario });
        },
        (error) => {
            return res.status(404).json({ resultado: "ERROR", mensaje: `El usuario con id = ${req.params.id} no existe` });
        }
    ); 
}

// Guardar un usuario
export async function guardarUsuario(req, res) {
    const { nombre, email, password, repassword, role, pacientes } = req.body;

    const existeUsuario = await Usuario.findOne({ email: email });

    // Validaciones
    if (!nombre || !email || !password || !role) {
        return res.status(409).json({ resultado: "ERROR", mensaje: 'Faltan campos obligatorios'});
    }
    if (existeUsuario) {
        return res.status(409).json({ resultado: "ERROR", mensaje: 'El usuario ya existe'});
    }
    if (password !== repassword) {
        return res.status(409).json({ resultado: "ERROR", mensaje: 'Las contraseñas no coinciden'});
    }

    if (!pacientes) pacientes = [];

    const nuevoUsuario = new Usuario({
        nombre: nombre,
        email: email,
        password: await Usuario.encryptPassword(password),
        role: role,
        pacientes: pacientes
    });

    const usuarioRegistrado = await nuevoUsuario.save(); 

    if (!usuarioRegistrado) {
        return res.status(409).json({ resultado: "ERROR", mensaje: 'Error al registrar el usuario' });
    }
    
    return res.status(201).json({ resultado: "OK", mensaje: 'Usuario creado correctamente', usuarioRegistrado });
}

// Actualizar un usuario
export async function actualizarUsuario(req, res) {
    // compruebo si existe el usuario antes de actualizar
    await Usuario.findById(req.params.id)
        .then(async (usuario) => {
            const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body);
            if (usuarioActualizado) {
                return res.status(202).json({
                    resultado: "OK", 
                    mensaje: 'Usuario actualizado correctamente', 
                    usuarioActualizado
                });
            }
            else {
                return res.status(500).json({ resultado: "ERROR",  mensaje: 'Error al actualizar el usuario'});
            }
        },
        (error) => {
            return res.status(404).json({ resultado: "ERROR", mensaje: `El usuario con id = ${req.params.id} no existe` });
        }
    );
}

// Eliminar un usuario
export async function eliminarUsuario(req, res) {
    // compruebo si existe el usuario antes de eliminarlo
    await Usuario.findById(req.params.id)
        .then(async (usuario) => {
            const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
            if (usuarioEliminado) {
                return res.status(202).json({
                    resultado: "OK", 
                    mensaje: 'Usuario eliminado correctamente', 
                    usuarioEliminado
                });
            }
            else {
                return res.status(500).json({ resultado: "ERROR",  mensaje: 'Error al eliminar el usuario'});
            }
        },
        (error) => {
            return res.status(404).json({ resultado: "ERROR", mensaje: `El usuario con id = ${req.params.id} no existe` });
        }
    );
}
