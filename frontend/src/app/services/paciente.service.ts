import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private pacientesURL = "http://localhost:3000/api/pacientes";

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

}
