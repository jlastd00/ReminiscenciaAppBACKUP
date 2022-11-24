import Paciente from "../models/Paciente.js";

// Obtener todos los pacientes
export async function obtenerPacientes(req, res) {
    const pacientes = await Paciente.find().populate('terapias');
    if (pacientes.length === 0) {
        return res
            .status(409)
            .json({
                resultado: "ERROR",
                mensaje: "No hay ningún paciente creado",
            });
    }
    return res.status(200).json({ resultado: "OK", pacientes: pacientes });
}

// Obtener un paciente por id
export async function obtenerPaciente(req, res) {
    await Paciente.findById(req.params.id).populate('terapias')    
        .then(
            (paciente) => {
                return res
                    .status(200)
                    .json({ resultado: "OK", paciente: paciente });
            },
            (error) => {
                return res
                    .status(404)
                    .json({
                        resultado: "ERROR",
                        mensaje: `El paciente con id = ${req.params.id} no existe`,
                    });
            }
    );
}

// Guardar un paciente
export async function guardarPaciente(req, res) {
    const {
        foto, fechaNacimiento,  nombre, apellido1, apellido2,
        fechaAlta, institucionalizado, institucion, direccion,
        diagnosticos, valoracionesYpruebas,
        lugarNacimiento, lugarResidencia, nivelEstudios, estudios,
        actividadLaboral,  aficiones, terapias
    } = req.body;

    // Validaciones
    if (!foto || !fechaNacimiento || !nombre || !apellido1 || !fechaAlta ||
        !institucionalizado ||
        !lugarNacimiento || !lugarResidencia || !nivelEstudios ||
        !estudios || !actividadLaboral || !aficiones || !terapias
    ) {
        return res
            .status(409)
            .json({
                resultado: "ERROR",
                mensaje: "Faltan campos obligatorios"
            });
    }

    const nuevoPaciente = new Paciente({
        foto: foto,
        fechaNacimiento: fechaNacimiento,
        nombre: nombre,
        apellido1: apellido1,
        apellido2: apellido2,
        fechaAlta: fechaAlta,
        institucionalizado: institucionalizado,
        institucion: institucion,
        direccion: direccion,
        diagnosticos: diagnosticos,
        profesional: profesional,
        fechaDiagnostico: fechaDiagnostico,
        valoracionesYpruebas: valoracionesYpruebas,
        lugarNacimiento: lugarNacimiento,
        lugarResidencia: lugarResidencia,
        nivelEstudios: nivelEstudios,
        estudios: estudios,
        actividadLaboral: actividadLaboral,
        aficiones: aficiones,
        terapias: terapias,
    });
    
    const pacienteGuardado = await nuevoPaciente.save();

    if (!pacienteGuardado) {
        return res.status(409).json({ resultado: "ERROR", mensaje: 'Error al guardar el paciente' });
    }
    
    return res.status(201).json({ resultado: "OK", mensaje: 'Paciente guardado correctamente', pacienteGuardado });
}

// Actualizar un paciente
export async function actualizarPaciente(req, res) {
    await Paciente.findById(req.params.id).then(
        async (paciente) => {
            const pacienteActualizado = await Paciente.findByIdAndUpdate(
                req.params.id,
                req.body
            );
            if (pacienteActualizado) {
                return res.status(202).json({
                    resultado: "OK",
                    mensaje: "Paciente actualizado correctamente",
                    pacienteActualizado,
                });
            } else {
                return res
                    .status(500)
                    .json({
                        resultado: "ERROR",
                        mensaje: "Error al actualizar el paciente",
                    });
            }
        },
        (error) => {
            return res
                .status(404)
                .json({
                    resultado: "ERROR",
                    mensaje: `El paciente con id = ${req.params.id} no existe`,
                });
        }
    );
}

// Eliminar un paciente
export async function eliminarPaciente(req, res) {
    await Paciente.findById(req.params.id).then(
        async (paciente) => {
            const pacienteEliminado = await Paciente.findByIdAndDelete(
                req.params.id
            );
            if (pacienteEliminado) {
                return res.status(202).json({
                    resultado: "OK",
                    mensaje: "Paciente eliminado correctamente",
                    pacienteEliminado,
                });
            } else {
                return res
                    .status(500)
                    .json({
                        resultado: "ERROR",
                        mensaje: "Error al eliminar el paciente",
                    });
            }
        },
        (error) => {
            return res
                .status(404)
                .json({
                    resultado: "ERROR",
                    mensaje: `El paciente con id = ${req.params.id} no existe`,
                });
        }
    );
}
