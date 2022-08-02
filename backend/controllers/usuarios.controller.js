import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js'

import properties from '../config/properties.js'

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
        return res.json({ resultado: "ERROR", mensaje: 'Faltan campos obligatorios'});
    }
    if (existeUsuario) {
        return res.json({ resultado: "ERROR", mensaje: 'El usuario ya existe'});
    }
    if (password !== repassword) {
        return res.json({ resultado: "ERROR", mensaje: 'Las contraseñas no coinciden'});
    }

    if (!pacientes) pacientes = [];

    const token = jwt.sign({ nombre, email }, properties.SECRET_KEY);

    const nuevoUsuario = new Usuario({
        nombre: nombre,
        email: email,
        password: await Usuario.encryptPassword(password),
        role: role,
        pacientes: pacientes,
        verifyToken: token
    });

    // Activacion de cuenta  
    
    const link = `http://localhost:4200/verificar-cuenta/?token=${token}`;
    console.log(link);

    const contentHTML = `
        <center>
            <h1>Activación de cuenta</h1>
            Hola,<br> Por favor, haz Click en el siguiente enlace para verificar tu email.<br>
            <a href="${link}">Click aqui para verificar</a>
        </center>
    `;

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'jaeden.grant12@ethereal.email',
            pass: 'kkhYKBZ7jZdytpKZUB'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"App Reminiscencia" <jaeden.grant12@ethereal.email>', // sender address
        to: nuevoUsuario.email, // list of receivers
        subject: "Por favor, confirma tu cuenta de Email", // Subject line
        html: contentHTML, // html body
    });

    console.log("Message sent: ", info.messageId);
    console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));  
    console.log('Mensaje enviado');

    const usuarioRegistrado = await nuevoUsuario.save(); 

    if (!usuarioRegistrado) {
        return res.status(409).json({ resultado: "ERROR", mensaje: 'Error al registrar el usuario' });
    }
    
    return res.status(201).json({ resultado: "OK", mensaje: 'Usuario creado correctamente', usuarioRegistrado });
}

// Verificacion de cuenta
export async function verificarCuenta(req, res) {

    console.log(req.protocol + "://" + req.get('host'));

    const { token } = req.body;
    //console.log(token);
    const errormsg = 'Algo ha ido mal, no se ha verificado el email';
    const successmsg = 'El Email se ha verificado con exito, ya puede iniciar sesion';
    
    if ((req.protocol + "://localhost:3000") == ("http://" + req.get('host'))) {

        console.log("El dominio coincide. La informacion viene desde un Email valido");
        
        jwt.verify(token, properties.SECRET_KEY, async (error, decoded) => {
            if (error) {
                return res.json({ resultado: "ERROR", mensaje: errormsg });
            } 
            else {
                const email = decoded.email;
                
                const usuario = await Usuario.findOne({email});
                if (!usuario) { return res.json({ resultado: "ERROR", mensaje: errormsg }); } 

                if (token == usuario.verifyToken) {
                    
                    const usuarioUpdated = await Usuario.findByIdAndUpdate(usuario._id, { verifyToken: "" });
                    if (!usuarioUpdated) { return res.json({resultado: "ERROR", mensaje: errormsg }); } 

                    console.log("Email verificado");
                    return res.json({resultado: "OK", mensaje: successmsg });
                }
                else {
                    console.log("Email NO verificado");
                    return res.json({resultado: "ERROR", mensaje: errormsg });
                }
            }
        });
    }
    else {
        console.log("Request is from unknown source");
        return res.send('No coincide el dominio ni el host, no se puede verificar el Email');
    }
    
}

// Login
export async function login(req, res) {
    
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.json({ resultado: "ERROR", mensaje: 'Falta email o contraseña' });
    }
    
    const usuario = await Usuario.findOne({ email: email }).populate('pacientes'); // Obtengo el usuario con sus pacientes
    if (!usuario) return res.json({ resultado: "ERROR", mensaje: 'El usuario no existe' });

    const coincidePassword = await Usuario.comparePassword(password, usuario.password);
    if (!coincidePassword) return res.json({ resultado: "ERROR", mensaje: 'Contraseña incorrecta' });

    if (usuario.verifyToken !== "") { 
        return res.json({
            resultado: "ERROR", 
            mensaje: 'Su cuenta no esta activada, por favor revise su email para activarla'
        });
    }

    const token = jwt.sign({ id: usuario._id }, properties.SECRET_KEY, {
        expiresIn: 86400 // 24 horas
    })

    return res.status(200).json({
        resultado: "OK", 
        mensaje: "Has iniciado sesión con éxito",
        token: token,
        usuario: {
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            role: usuario.role,
            pacientes: usuario.pacientes
        }
    });
}

// Recuperar password
export async function recuperarPassword(req, res) { 

    const { email } = req.body;
    
    const usuario = await Usuario.findOne({ email: email });
    if (!usuario) return res.json({resultado: "ERROR", mensaje: 'El usuario no existe'});

    const hash = await bcrypt.hash(email, 10);
    const token = jwt.sign({ email, hash }, properties.SECRET_KEY);

    const usuarioActualizado = await Usuario.findByIdAndUpdate(usuario._id, { resetToken: token });
    if (!usuarioActualizado) { return res.json({ resultado: "ERROR", mensaje: 'Ha ocurrido un error' }); }

    const link = `http://localhost:4200/nuevo-password/?token=${token}`;
    console.log(link);

    const contentHTML = `
        <center>
            <h1>Cambio de contraseña</h1>
            Hola,<br> Por favor, haz Click en el siguiente enlace para introducir la nueva contraseña.<br>
            <a href="${link}">Cambiar contraseña</a>
        </center>
    `;
    
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'jaeden.grant12@ethereal.email',
            pass: 'kkhYKBZ7jZdytpKZUB'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const info = await transporter.sendMail({
        from: '"Jaeden Grant" <jaeden.grant12@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Cambio de contraseña", // Subject line
        html: contentHTML, // html body
    });

    console.log("Message sent: ", info.messageId);
    console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));  
    console.log('Mensaje enviado');

    return res.json({ resultado: "OK", mensaje: 'Solicitud recibida, revise su email para reestablecer su contraseña' });
}

// Validar reset token
export async function validarResetToken(req, res) {
    
    const { token } = req.body;

    jwt.verify(token, properties.SECRET_KEY, async (error, decoded) => {
        if (error) {
            return res.json({ resultado: "ERROR", mensaje: 'Ha ocurrido un error al validar el token' });
        } 
        else {
            const email = decoded.email;
            
            const usuario = await Usuario.findOne({email});
            if (!usuario) { return res.json({ resultado: "ERROR", mensaje: 'Ha ocurrido un error' }); } 

            if (usuario.resetToken == "") { return res.json({ resultado: "ERROR", mensaje: 'Ha ocurrido un error' }); }

            if (token == usuario.resetToken) {          
                console.log("Todo correcto, se puede cambiar la contraseña");
                return res.json({ resultado: "OK", token: token, mensaje: 'Correcto, ya puede cambiar la contraseña' });
            }
            else {
                console.log("No coinciden los token");
                return res.json({ resultado: "ERROR", mensaje: 'Ha ocurrido un error' });
            }
        }
    });    
}

// Resetear password
export async function resetearPassword(req, res) {
    
    const { usuarioToken, password, repassword } = req.body;
    
    jwt.verify(usuarioToken, properties.SECRET_KEY, async (error, decoded) => {
        if (error) {
            return res.json({ resultado: "ERROR", mensaje: 'Ha ocurrido un error' });
        } 
        else {
            const email = decoded.email;
            
            const usuario = await Usuario.findOne({email});
            if (!usuario) { return res.json({ resultado: "ERROR", mensaje: 'El usuario no existe' }); } 

            if (usuarioToken !== usuario.resetToken) { return res.json({ resultado: "ERROR", mensaje: 'Los token no coinciden' }); }

            if (!password || !repassword) {
                return res.json({ resultado: "ERROR", mensaje: 'Faltan campos obligatorios' });
            }
            if (password !== repassword) {
                return res.json({ resultado: "ERROR", mensaje: 'Las contraseñas no coinciden' });
            }

            const existePassword = await Usuario.comparePassword(password, usuario.password);
            if (existePassword) return res.json({ resultado: "ERROR", mensaje: 'La contraseña no es válida' });

            const usuarioActualizado = await Usuario.findByIdAndUpdate(usuario._id, {
                resetToken: "",
                password: await Usuario.encryptPassword(password)
            });
            if (!usuarioActualizado) { 
                return res.json({ resultado: "ERROR", mensaje: 'Ha ocurrido un error al actualizar la contraseña' }); 
            } 

            return res.json({ resultado: "OK", mensaje: 'La contraseña se ha reestablecido con éxito, ya puede iniciar sesion' });
        }
    })
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
