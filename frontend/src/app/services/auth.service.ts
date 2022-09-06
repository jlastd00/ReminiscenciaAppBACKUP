import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registroURL = "http://localhost:3000/api/usuarios";
  private loginURL = "http://localhost:3000/api/usuarios/login";
  private verificarCuentaURL = "http://localhost:3000/api/usuarios/verificar-cuenta";
  private recuperarPasswordURL = "http://localhost:3000/api/usuarios/recuperar-password";
  private validarResetTokenURL = "http://localhost:3000/api/usuarios/validar-reset-token";
  private nuevoPasswordURL = "http://localhost:3000/api/usuarios/nuevo-password";

  authToken: any;
  authUser: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  registrarUsuarior(usuario: {}) {
    return this.http.post<any>(this.registroURL, usuario);
  }

  verificarCuenta(token: {}) {
    var headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.http.post<any>(this.verificarCuentaURL, token, { headers: headers });
  }

  login(userdata: {}) {
    return this.http.post<any>(this.loginURL, userdata);
  }

  recuperarPassword(email: {}) {
    return this.http.post<any>(this.recuperarPasswordURL, email);
  }

  validarResetToken(token: {}) {
    return this.http.post<any>(this.validarResetTokenURL, token);
  }

  resetearPassword(userdata: {}) {
    return this.http.post<any>(this.nuevoPasswordURL, userdata);
  }

  storeUserData(token: string, usuario: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.authToken = token;
    this.authUser = usuario;
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

}
