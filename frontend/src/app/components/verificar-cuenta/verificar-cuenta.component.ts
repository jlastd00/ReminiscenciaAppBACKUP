import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

enum EmailStatus {
  Verifying,
  Failed
}

@Component({
  selector: 'app-verificar-cuenta',
  templateUrl: './verificar-cuenta.component.html',
  styleUrls: ['./verificar-cuenta.component.css']
})
export class VerificarCuentaComponent implements OnInit {

  EmailStatus = EmailStatus;
  emailStatus = EmailStatus.Verifying;

  token!: {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.token = {
      token: this.route.snapshot.queryParams['token']
    }
    //this.token = this.route.snapshot.queryParams['token'];
    // remove token from url to prevent http referer leakage
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
    console.log(this.token);
    this.authService.verificarCuenta(this.token)
      .subscribe(
          res => {
            if (res.resultado === "OK") {
              this.toastr.success(res.mensaje, res.resultado);
              this.router.navigate(['../login'], { relativeTo: this.route });
              return true;
            }
            this.toastr.error(res.mensaje, res.resultado);
            return false;
          },
          error => {
            this.emailStatus = EmailStatus.Failed;
            console.log(error);
          }
      );
  }

}
