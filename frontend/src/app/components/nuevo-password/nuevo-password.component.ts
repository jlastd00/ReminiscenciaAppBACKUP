import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

enum TokenStatus {
  Validating,
  Valid,
  Invalid
}

@Component({
  selector: 'app-nuevo-password',
  templateUrl: './nuevo-password.component.html',
  styleUrls: ['./nuevo-password.component.css']
})
export class NuevoPasswordComponent implements OnInit {

  TokenStatus = TokenStatus;
  tokenStatus = TokenStatus.Validating;
  nuevoPassForm!: FormGroup;
  loading = false;
  submitted = false;
  token = {};
  userdata = {};
  tokenRecived!: String;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.nuevoPassForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      repassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.token = {
      token: this.route.snapshot.queryParams['token']
    }

    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
  }

  ngOnInit() {
    this.authService.validarResetToken(this.token)
      .subscribe(
        res => {
          if (res.resultado === "ERROR") {
            this.toastr.error(res.mensaje, res.resultado);
            this.tokenStatus = TokenStatus.Invalid;
          }
          this.tokenRecived = res.token;
          this.tokenStatus = TokenStatus.Valid;
        },
        error => {
          console.log(error);
        }
      );
  }

  resetearPassword() {

    if (this.nuevoPassForm.invalid) {
      return;
    }

    this.loading = true;

    this.userdata = {
      usuarioToken: this.tokenRecived,
      password: this.nuevoPassForm.get('password')!.value,
      repassword: this.nuevoPassForm.get('repassword')!.value
    }

    this.authService.resetearPassword(this.userdata)
      .subscribe(
        res => {
          if (res.resultado === "ERROR") {
            this.toastr.error(res.mensaje, res.resultado);
            return;
          }
          this.toastr.success(res.mensaje, res.resultado);
          this.router.navigate(['../login'], { relativeTo: this.route });
          return;
        },
        error => {
          console.log(error);
          return;
        }
      );
  }

}
