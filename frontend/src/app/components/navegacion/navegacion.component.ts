import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit {

  usuario: any;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.loggedIn()) {
      this.usuario = JSON.parse(localStorage.getItem('usuario')!);
      //console.log(this.usuario)
    }
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logOut() {
    Swal.fire({
      title: 'Hasta pronto!',
      text: 'Has salido de la aplicación',
      icon: 'info',
      confirmButtonText: 'Aceptar'
    })
    return this.authService.logOut();
  }

}
