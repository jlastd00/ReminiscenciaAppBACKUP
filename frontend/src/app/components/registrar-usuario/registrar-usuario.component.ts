import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
})
export class RegistrarUsuarioComponent implements OnInit {

  registroUsuario: FormGroup
  usuario!: {}

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registroUsuario = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repassword: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Selecciona tipo de usuario', Validators.pattern("TERAPEUTA|FAMILIAR")]
    });
  }

  ngOnInit(): void {}

  registrarUsuario() {

    if (this.registroUsuario.invalid) {
      this.registroUsuario.get('nombre')?.markAsTouched({onlySelf: true});
      this.registroUsuario.get('email')?.markAsTouched({onlySelf: true});
      this.registroUsuario.get('password')?.markAsTouched({onlySelf: true});
      this.registroUsuario.get('repassword')?.markAsTouched({onlySelf: true});
      this.registroUsuario.get('role')?.markAsTouched({onlySelf: true});
      return;
    }

    this.usuario = {
      nombre: this.registroUsuario.get('nombre')!.value,
      email: this.registroUsuario.get('email')!.value,
      password: this.registroUsuario.get('password')!.value,
      repassword: this.registroUsuario.get('repassword')!.value,
      role: this.registroUsuario.get('role')!.value,
      pacientes: []
    }

    if (this.registroUsuario.get('password')!.value !== this.registroUsuario.get('repassword')!.value) {
      this.toastr.error("Las contraseñas NO coinciden", "Contraseñas distintas");
      return;
    }

    this.authService.registrarUsuarior(this.usuario)
      .subscribe(
        res => {
          console.log(res);
          if (res.resultado === "ERROR") {
            this.toastr.error(res.mensaje, res.resultado);
          }
          else {
            this.toastr.success("Por favor, revise su email para verificar su cuenta", res.mensaje);
            this.router.navigate(['../login'], { relativeTo: this.route });
          }
        },
        err => {
          console.log(err);
        }
      )

  }
}
