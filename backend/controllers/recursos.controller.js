import Recurso from "../models/Recurso.js";

// Obtener todos los recursos
export async function obtenerRecursos(req, res) {
    const recursos = await Recurso.find().populate('usuario');
    if (recursos.length === 0) {
        return res.status(409).json({ resultado: "ERROR", mensaje: "No hay recursos en la base de datos" });
    }
    return res.status(200).json({ resultado: "OK", recursos: recursos });
}

// Obtener un recurso por id
export async function obtenerRecurso(req, res) {
    await Recurso.findById(req.params.id).populate('usuario')
        .then((recurso) => {
            return res.status(200).json({ resultado: "OK", recurso: recurso });
        },
        (error) => {
            return res.status(404).json({ resultado: "ERROR", mensaje: `El recurso con id = ${req.params.id} no existe` });
        }
    );
}

// Guardar un recurso
export async function guardarRecurso(req, res) {
    const { nombre, usuario, url, publico, formato, tipo, fechaReferencia, descripcion } = req.body;

    const existeRecurso = await Recurso.findOne({ url: url });

    // Validaciones
    if (!nombre || !usuario || !url || !publico || !formato || !tipo || !fechaReferencia || !descripcion) {
        return res.status(409).json({ resultado: "ERROR", mensaje: 'Faltan campos obligatorios'});
    }
    if (existeRecurso) {
        return res.status(409).json({ resultado: "ERROR", mensaje: 'El recurso ya se ha guardado antes'});
    }
    
    const nuevoRecurso = new Recurso({
        nombre: nombre,
        usuario: usuario,
        url: url,
        publico: publico,
        formato: formato,
        tipo: tipo,
        fechaReferencia: fechaReferencia,
        descripcion: descripcion
    });

    const recursoGuardado = await nuevoRecurso.save(); 

    if (!recursoGuardado) {
        return res.status(409).json({ resultado: "ERROR", mensaje: 'Error al guardar el recurso' });
    }
    
    return res.status(201).json({ resultado: "OK", mensaje: 'Recurso guardado correctamente', recursoGuardado });
}

// Actualizar un recurso
export async function actualizarRecurso(req, res) {
    await Recurso.findById(req.params.id)
        .then(async (recurso) => {
            const recursoActualizado = await Recurso.findByIdAndUpdate(req.params.id, req.body);
            if (recursoActualizado) {
                return res.status(202).json({
                    resultado: "OK", 
                    mensaje: 'Recurso actualizado correctamente', 
                    recursoActualizado
                });
            }
            else {
                return res.status(500).json({ resultado: "ERROR",  mensaje: 'Error al actualizar el recurso'});
            }
        },
        (error) => {
            return res.status(404).json({ resultado: "ERROR", mensaje: `El recurso con id = ${req.params.id} no existe` });
        }
    );
}

// Eliminar un recurso
export async function eliminarRecurso(req, res) {
    await Recurso.findById(req.params.id)
        .then(async (recurso) => {
            const recursoEliminado = await Recurso.findByIdAndDelete(req.params.id);
            if (recursoEliminado) {
                return res.status(202).json({
                    resultado: "OK", 
                    mensaje: 'Recurso eliminado correctamente', 
                    recursoEliminado
                });
            }
            else {
                return res.status(500).json({ resultado: "ERROR",  mensaje: 'Error al eliminar el recurso'});
            }
        },
        (error) => {
            return res.status(404).json({ resultado: "ERROR", mensaje: `El recurso con id = ${req.params.id} no existe` });
        }
    );
}
