import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuariologinForm: FormGroup;
  userdata!: {};

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usuariologinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  loginUsuario() {

    if (this.usuariologinForm.invalid) {
      this.usuariologinForm.get('email')?.markAsTouched({onlySelf: true});
      this.usuariologinForm.get('password')?.markAsTouched({onlySelf: true});
      return;
    }

    this.userdata = {
      email: this.usuariologinForm.get('email')!.value,
      password: this.usuariologinForm.get('password')!.value
    }

    this.authService.login(this.userdata)
      .subscribe(
        res => {
          if (res.resultado === "ERROR") {
            this.toastr.error(res.mensaje, res.resultado);
            return;
          }
          Swal.fire({
            title: 'Bienvenido!',
            text: 'Has iniciado sesión correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
          this.authService.storeUserData(res.token, res.usuario);
          this.router.navigate(['../inicio'], { relativeTo: this.route });
        },
        err => {
          console.log(err);
          return;
        }
      );

    //console.log(this.usuariologinForm);

  }

}
