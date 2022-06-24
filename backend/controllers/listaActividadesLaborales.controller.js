import ListaActividadesLaborales from "../models/ListaActividadesLaborales.js"

export async function obtenerListaActividadesLaborales(req, res) {
    const actividades = await ListaActividadesLaborales.find();
    if (actividades.length === 0) {
        return res.status(409).json({ resultado: "ERROR", mensaje: "La lista está vacía" });
    }
    return res.status(200).json({ resultado: "OK", actividades });
}
