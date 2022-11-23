import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.loggedIn()) {
      return true;
    }
    else {
      Swal.fire({
        title: 'Error!',
        text: '¡¡ACCESO DENEGADO!!',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      })
      this.router.navigate(['/login']);
      return false;
    }
  }
}
