import Terapia from "../models/Terapia.js";

// Obtener todas las terapias
export async function obtenerTerapias(req, res) {
    const terapias = await Terapia.find().populate('recursos');
    if (terapias.length === 0) {
        return res.status(409).json({ resultado: "ERROR", mensaje: "No hay terapias en la base de datos" });
    }
    return res.status(200).json({ resultado: "OK", terapias: terapias });
}

// Obtener una terapia por id
export async function obtenerTerapia(req, res) {
    await Terapia.findById(req.params.id).populate('recursos')
        .then((terapia) => {
            return res.status(200).json({ resultado: "OK", terapia: terapia });
        },
        (error) => {
            return res.status(404).json({ resultado: "ERROR", mensaje: `La terapia con id = ${req.params.id} no existe` });
        }
    );
}

// Guardar una terapia
export async function guardarTerapia(req, res) {
    const { nombre, descripcion, tipo, recursos } = req.body;

    // Validaciones
    if (!nombre || !descripcion || !tipo) {
        return res.status(409).json({ resultado: "ERROR", mensaje: 'Faltan campos obligatorios'});
    }
    
    const nuevaTerapia = new Terapia({
        nombre: nombre,
        descripcion: descripcion,
        tipo: tipo,
        recursos: recursos
    });

    const terapiaGuardada = await nuevaTerapia.save(); 

    if (!terapiaGuardada) {
        return res.status(409).json({ resultado: "ERROR", mensaje: 'Error al guardar la terapia' });
    }
    
    return res.status(201).json({ resultado: "OK", mensaje: 'Terapia guardada correctamente', terapiaGuardada });
}

// Actualizar una terapia
export async function actualizarTerapia(req, res) {
    await Terapia.findById(req.params.id)
        .then(async (terapia) => {
            const terapiaActualizada = await Terapia.findByIdAndUpdate(req.params.id, req.body);
            if (terapiaActualizada) {
                return res.status(202).json({
                    resultado: "OK", 
                    mensaje: 'Terapia actualizada correctamente', 
                    terapiaActualizada
                });
            }
            else {
                return res.status(500).json({ resultado: "ERROR",  mensaje: 'Error al actualizar la terapia'});
            }
        },
        (error) => {
            return res.status(404).json({ resultado: "ERROR", mensaje: `La terapia con id = ${req.params.id} no existe` });
        }
    );
}

// Eliminar una terapia
export async function eliminarTerapia(req, res) {
    await Terapia.findById(req.params.id)
        .then(async (terapia) => {
            const terapiaEliminada = await Terapia.findByIdAndDelete(req.params.id);
            if (terapiaEliminada) {
                return res.status(202).json({
                    resultado: "OK", 
                    mensaje: 'Terapia eliminada correctamente', 
                    terapiaEliminada
                });
            }
            else {
                return res.status(500).json({ resultado: "ERROR",  mensaje: 'Error al eliminar la terapia'});
            }
        },
        (error) => {
            return res.status(404).json({ resultado: "ERROR", mensaje: `La terapia con id = ${req.params.id} no existe` });
        }
    );
}
