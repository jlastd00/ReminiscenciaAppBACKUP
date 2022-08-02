import { Component, OnInit } from '@angular/core';
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-admin-pacientes',
  templateUrl: './admin-pacientes.component.html',
  styleUrls: ['./admin-pacientes.component.css']
})
export class AdminPacientesComponent implements OnInit {

  errorListaVacia = "";
  pacientes: any = [];

  constructor(
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.pacienteService.obtenerPacientes()
      .subscribe(
        res => {
          console.log(res);
          if (res.resultado === "OK") {
            this.pacientes = res.pacientes;
          }
          else {
            this.errorListaVacia = res.mensaje;
          }
          return;
        },
        err => {
          console.log(err);
          return;
        }
      )
  }

  hayPacientes() {
    return this.pacientes.length > 0;
  }

}
