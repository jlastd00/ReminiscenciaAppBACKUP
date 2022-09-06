import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  emailUsuario!: {};

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }

  loginUsuario() {

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.get('email')?.markAsTouched({onlySelf: true});
      return;
    }

    this.emailUsuario = {
      email: this.resetPasswordForm.get('email')!.value
    };

    this.authService.recuperarPassword(this.emailUsuario)
      .subscribe(
        res => {
          if (res.resultado === "OK") {
            this.toastr.success(res.mensaje, res.resultado);
            this.router.navigate(['../login'], { relativeTo: this.route });
            return;
          }
          else {
            this.toastr.error(res.mensaje, res.resultado);
            return;
          }
        },
        err => {
          console.log(err);
          return;
        }
      );

    //console.log(this.emailUsuario);
  }

}
