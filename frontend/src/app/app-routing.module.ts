import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPacientesComponent } from './components/admin-pacientes/admin-pacientes.component';
import { DetallePacienteComponent } from './components/detalle-paciente/detalle-paciente.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { NuevoPacienteComponent } from './components/nuevo-paciente/nuevo-paciente.component';
import { NuevoPasswordComponent } from './components/nuevo-password/nuevo-password.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { VerificarCuentaComponent } from './components/verificar-cuenta/verificar-cuenta.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registrar-usuario', component: RegistrarUsuarioComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'nuevo-password', component: NuevoPasswordComponent },
  { path: 'verificar-cuenta', component: VerificarCuentaComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
  { path: 'admin-pacientes', component: AdminPacientesComponent, canActivate: [AuthGuard] },
  { path: 'nuevo-paciente', component: NuevoPacienteComponent, canActivate: [AuthGuard] },
  { path: 'detalle-paciente', component: DetallePacienteComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
