import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthSharedService } from './_pages/shared/shared-services/auth-shared.service';
import { logging } from 'protractor';
import { first } from 'rxjs/operators';
import { environment } from './../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'new-finanzas-client';

  addressForm = this.fb.group({
    nombreUsuario: ['', Validators.required],
    hash: ['', Validators.required],
  });

  estadoSesion!: boolean;
  returnUrl!: string;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar, 
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthSharedService,
  ){
  }

  ngOnInit(): void {
    this.estadoSesion = this.authService.estadoSesion();    
  }

  get f() {
    return this.addressForm.controls;
  }

  onSubmit(){
    switch (this.addressForm.status) {
      //Si el formulario esta correcto
      case 'VALID':
        this.authService
        .login(this.f.nombreUsuario.value, this.f.hash.value)
        .pipe(first())
        .subscribe(
          (data) => {
            let nombre = data.nombre + " " + data.apellido;
            this.snackBar.open('Bienvenid@: ' + nombre, 'cerrar', {
              duration: 2000,
              verticalPosition: 'top',
            });
            localStorage.setItem('usuario', JSON.stringify(data));
            localStorage.setItem('usertoken', data.token);
            this.estadoSesion = this.authService.estadoSesion();
          },
          (error) => {
            this.snackBar.open('No se pudo ingresar, contacte con informatica', 'cerrar', {
              duration: 2000,
              verticalPosition: 'top',
            });
            console.log(error);
          }
        );
        break;
      
      //Si el formulario es erroneo 
      case 'INVALID':
        this.snackBar.open('EL formulario debe ser Completado', 'cerrar', {
          duration: 2000,
          verticalPosition: 'top',
        });
        break;
      
      default:
        break;
    }
  }
}
