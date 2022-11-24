import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private pacientesURL = "http://localhost:3000/api/pacientes";
  private listaPruebasURL = "http://localhost:3000/api/lista-pruebas";
  private listaActividadesLaboralesURL = "http://localhost:3000/api/lista-actividades-laborales";

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  obtenerPacientes() {
    return this.http.get<any>(this.pacientesURL);
  }

  obtenerPaciente(id: String) {
    return this.http.get<any>(`${this.pacientesURL}/${id}`);
  }

  obtenerListaPruebas() {
    return this.http.get<any>(this.listaPruebasURL);
  }

  obtenerListaActividadesLaborales() {
    return this.http.get<any>(this.listaActividadesLaboralesURL);
  }

}
