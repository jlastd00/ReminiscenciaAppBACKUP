import ListaPruebas from "../models/ListaPruebas.js"

export async function obtenerListaPruebas(req, res) {
    const pruebas = await ListaPruebas.find();
    if (pruebas.length === 0) {
        return res.status(409).json({ resultado: "ERROR", mensaje: "La lista está vacía" });
    }
    return res.status(200).json({ resultado: "OK", pruebas });
}
