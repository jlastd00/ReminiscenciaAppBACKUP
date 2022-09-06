import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/Usuario';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  usuario: any;

  constructor() { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario')!);
  }

  hayPacientes() {
    return this.usuario.pacientes.length > 0;
  }

}
